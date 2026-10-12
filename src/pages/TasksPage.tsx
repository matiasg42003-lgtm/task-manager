
import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { logoutUser } from '../services/auth';
import type { CreateTaskInput } from '../types/task';

export default function TasksPage() {
    const { user } = useAuth();

    const {
        tasks,
        loading,
        error,
        addTask,
        toggleTask,
        removeTask,
    } = useTasks(user?.uid);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);

    async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const cleanTitle = title.trim();
        const cleanDescription = description.trim();

        if (!cleanTitle) {
            setActionError('El título es obligatorio.');
            return;
        }

        if (cleanTitle.length > 120 || cleanDescription.length > 500) {
            setActionError('El título admite hasta 120 caracteres y la descripción hasta 500.');
            return;
        }

        const input: CreateTaskInput = {
            title: cleanTitle,
            completed: false,
            ...(cleanDescription ? { description: cleanDescription } : {}),
        };

        setSaving(true);
        setActionError(null);

        try {
            await addTask(input);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            setActionError('No se pudo crear la tarea. Intentá nuevamente.');
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleTask(
        taskId: string,
        completed: boolean,
    ) {
        setBusyTaskId(taskId);
        setActionError(null);

        try {
            await toggleTask(taskId, completed);
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            setActionError('No se pudo actualizar la tarea.');
        } finally {
            setBusyTaskId(null);
        }
    }

    async function handleDeleteTask(taskId: string) {
        const confirmed = window.confirm(
            '¿Seguro que querés eliminar esta tarea?',
        );

        if (!confirmed) return;

        setBusyTaskId(taskId);
        setActionError(null);

        try {
            await removeTask(taskId);
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            setActionError('No se pudo eliminar la tarea.');
        } finally {
            setBusyTaskId(null);
        }
    }

    async function handleLogout() {
        setLoggingOut(true);

        try {
            await logoutUser();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setActionError('No se pudo cerrar la sesión.');
            setLoggingOut(false);
        }
    }

    if (!user) return null;

    const completedCount = tasks.filter((task) => task.completed).length;

    return (
        <main className="tasks-page">
            <header className="tasks-header">
                <div>
                    <p className="tasks-eyebrow">TU ESPACIO DE TRABAJO</p>
                    <h1>Mis tareas</h1>
                    <p className="tasks-user">{user.email}</p>
                </div>

                <button
                    className="tasks-logout"
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                >
                    {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                </button>
            </header>

            <section className="tasks-summary" aria-label="Resumen de tareas">
                <p>
                    <strong>{tasks.length}</strong> tareas en total
                </p>
                <p>
                    <strong>{completedCount}</strong> completadas
                </p>
                <p>
                    <strong>{tasks.length - completedCount}</strong> pendientes
                </p>
            </section>

            <section className="tasks-panel">
                <h2>Agregar una tarea</h2>

                <form className="tasks-form" onSubmit={handleCreateTask}>
                    <label htmlFor="task-title">Título</label>
                    <input
                        id="task-title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Ej.: Terminar el ejercicio de React"
                        maxLength={120}
                        required
                    />

                    <label htmlFor="task-description">
                        Descripción (opcional)
                    </label>
                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Agregá algún detalle..."
                        maxLength={500}
                        rows={3}
                    />

                    <button type="submit" disabled={saving}>
                        {saving ? 'Guardando...' : 'Crear tarea'}
                    </button>
                </form>
            </section>

            {actionError && (
                <p className="tasks-error" role="alert">
                    {actionError}
                </p>
            )}

            <section className="tasks-panel">
                <h2>Lista de tareas</h2>

                {loading && (
                    <p role="status">Cargando tus tareas...</p>
                )}

                {!loading && error && (
                    <p className="tasks-error" role="alert">{error}</p>
                )}

                {!loading && !error && tasks.length === 0 && (
                    <p className="tasks-empty">
                        Todavía no tenés tareas. ¡Creá la primera!
                    </p>
                )}

                {!loading && !error && tasks.length > 0 && (
                    <ul className="tasks-list">
                        {tasks.map((task) => (
                            <li
                                className={`task-item${task.completed ? ' task-completed' : ''}`}
                                key={task.id}
                            >
                                <div className="task-content">
                                    <label className="task-title">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            disabled={busyTaskId === task.id}
                                            onChange={(event) =>
                                                handleToggleTask(task.id, event.target.checked)
                                            }
                                        />
                                        <span>{task.title}</span>
                                    </label>

                                    {task.description && (
                                        <p className="task-description">
                                            {task.description}
                                        </p>
                                    )}
                                </div>

                                <button
                                    className="task-delete"
                                    type="button"
                                    disabled={busyTaskId === task.id}
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    {busyTaskId === task.id ? 'Procesando...' : 'Eliminar'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
