
import { useCallback, useEffect, useState } from 'react';
import type { Task, CreateTaskInput } from '../types/task';
import {
    createTask as createTaskInFirestore,
    updateTask as updateTaskInFirestore,
    deleteTask as deleteTaskInFirestore,
    subscribeToTasks,
} from '../services/taskService';

export function useTasks(userId: string | undefined) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const unsubscribe = subscribeToTasks(
            userId,
            (updatedTasks) => {
                setTasks(updatedTasks);
                setLoading(false);
            },
            (error) => {
                console.error('Error al escuchar las tareas:', error);
                setError('No se pudieron cargar las tareas. Revisá la conexión y las reglas de Firestore.');
                setLoading(false);
            },
        );

        return unsubscribe;
    }, [userId]);

    const addTask = useCallback(
        async (input: CreateTaskInput) => {
            if (!userId) throw new Error('No hay un usuario autenticado.');

            await createTaskInFirestore(userId, input);
        },
        [userId],
    );

    const toggleTask = useCallback(
        async (taskId: string, completed: boolean) => {
            if (!userId) throw new Error('No hay un usuario autenticado.');

            await updateTaskInFirestore(userId, taskId, completed);
        },
        [userId],
    );

    const removeTask = useCallback(
        async (taskId: string) => {
            if (!userId) throw new Error('No hay un usuario autenticado.');

            await deleteTaskInFirestore(userId, taskId);
        },
        [userId],
    );

    return {
        tasks,
        loading,
        error,
        addTask,
        toggleTask,
        removeTask,
    };
}
