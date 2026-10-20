

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
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailMessage, setEmailMessage] = useState<string | null>(null);

    async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const cleanTitle = title.trim();
        const cleanDescription = description.trim();

        if (!cleanTitle) {
            setActionError('El título es obligatorio.');
            return;
        }

        if (cleanTitle.length > 120 || cleanDescription.length > 500) {
            setActionError(
                'El título admite hasta 120 caracteres y la descripción hasta 500.',
            );
            return;
        }

        const input: CreateTaskInput = {
            title: cleanTitle,
            completed: false,
            ...(cleanDescription ? { description: cleanDescription } : {}),
        };

        setSaving(true);
        setActionError(null);
        setEmailMessage(null);

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
        setEmailMessage(null);

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
        setEmailMessage(null);

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
        setActionError(null);

        try {
            await logoutUser();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setActionError('No se pudo cerrar la sesión.');
            setLoggingOut(false);
        }
    }

    async function handleSendEmail() {
        if (!user) {
            setActionError('Tenés que iniciar sesión para enviar el resumen.');
            return;
        }

        setSendingEmail(true);
        setActionError(null);
        setEmailMessage(null);

        try {
            const idToken = await user.getIdToken();

            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    tasks: tasks.map(({ title, completed }) => ({
                        title,
                        completed,
                    })),
                }),
            });


            const responseText = await response.text();

            let result: { message?: string; error?: string };

            try {
                result = JSON.parse(responseText);
            } catch {
                throw new Error(
                    `El servidor devolvió una respuesta inesperada (HTTP ${response.status}). Revisá los registros de Vercel.`,
                );
            }

            if (!response.ok) {
                throw new Error(
                    result.error || `Error del servidor (HTTP ${response.status}).`,
                );
            }


            setEmailMessage(
                result.message || '¡Resumen enviado correctamente!',
            );
        } catch (error) {
            console.error('Error al enviar el resumen:', error);

            setActionError(
                error instanceof Error
                    ? error.message
                    : 'No se pudo enviar el resumen. Intentá nuevamente.',
            );
        } finally {
            setSendingEmail(false);
        }
    }

    if (!user) return null;

    const completedCount = tasks.filter((task) => task.completed).length;
    const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    return (
        <main className="tasks-page">
            <div className="terminal-header-bar" aria-hidden="true">
                <div className="terminal-status-group">
                    <span className="status-led"></span>
                    <span>SYSTEM ONLINE</span>
                    <span className="terminal-chip">ARCADE CONSOLE // v2.4</span>
                </div>
                <span>SESSION ACTIVE // SECURE NODE</span>
            </div>

            <header className="tasks-header">
                <div>
                    <p className="tasks-eyebrow">
                        <span className="status-led"></span>
                        TU ESPACIO DE TRABAJO
                    </p>
                    <h1>
                        Mis tareas<span className="terminal-cursor" aria-hidden="true">_</span>
                    </h1>
                    <p className="tasks-user">{user.email}</p>
                </div>

                <div className="tasks-header-actions">
                    <button
                        className="tasks-email-button"
                        type="button"
                        onClick={handleSendEmail}
                        disabled={sendingEmail || loading}
                    >
                        {sendingEmail
                            ? 'Enviando resumen...'
                            : 'Enviar resumen por email'}
                    </button>

                    <button
                        className="tasks-logout"
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                    </button>
                </div>
            </header>

            <section
                className="tasks-summary"
                aria-label="Resumen de tareas"
            >
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

            {tasks.length > 0 && (
                <div
                    style={{
                        margin: '-12px 0 24px',
                        padding: '10px 16px',
                        background: 'var(--bg-panel-translucent)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        fontSize: '0.78rem',
                        color: 'var(--color-text-dim)',
                        letterSpacing: '0.06em',
                    }}
                    aria-hidden="true"
                >
                    <span>SYSTEM SYNC STATUS</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                        {completionPercentage}% SYNCHRONIZED
                    </span>
                </div>
            )}

            <section className="tasks-panel">
                <h2>Agregar una tarea</h2>

                <form className="tasks-form" onSubmit={handleCreateTask}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label htmlFor="task-title">Título</label>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }} aria-hidden="true">
                            {title.length}/120
                        </span>
                    </div>
                    <input
                        id="task-title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Ej.: Terminar el ejercicio de React"
                        maxLength={120}
                        required
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label htmlFor="task-description">
                            Descripción (opcional)
                        </label>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }} aria-hidden="true">
                            {description.length}/500
                        </span>
                    </div>
                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Agregá algún detalle técnico o nota adicional..."
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

            {emailMessage && (
                <p className="tasks-email-success" role="status">
                    {emailMessage}
                </p>
            )}

            <section className="tasks-panel">
                <h2>Lista de tareas</h2>

                {loading && (
                    <p role="status">Cargando tus tareas...</p>
                )}

                {!loading && error && (
                    <p className="tasks-error" role="alert">
                        {error}
                    </p>
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
                                                handleToggleTask(
                                                    task.id,
                                                    event.target.checked,
                                                )
                                            }
                                        />
                                        <span>{task.title}</span>
                                        <span
                                            className="terminal-chip"
                                            style={{
                                                fontSize: '0.68rem',
                                                marginLeft: 'auto',
                                                borderColor: task.completed ? 'var(--color-primary-dim)' : 'var(--color-accent-amber)',
                                                color: task.completed ? 'var(--color-primary)' : 'var(--color-accent-amber)',
                                            }}
                                            aria-hidden="true"
                                        >
                                            {task.completed ? 'COMPLETED' : 'PENDING'}
                                        </span>
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
                                    {busyTaskId === task.id
                                        ? 'Procesando...'
                                        : 'Eliminar'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
