
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';

import { db } from './firebase';
import type { Task, CreateTaskInput } from '../types/task';

function getTasksCollection(userId: string) {
    return collection(db, 'users', userId, 'tasks');
}

export async function createTask(
    userId: string,
    input: CreateTaskInput,
): Promise<void> {
    await addDoc(getTasksCollection(userId), {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

export async function updateTask(
    userId: string,
    taskId: string,
    completed: boolean,
): Promise<void> {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);

    await updateDoc(taskRef, {
        completed,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteTask(
    userId: string,
    taskId: string,
): Promise<void> {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);

    await deleteDoc(taskRef);
}

export function subscribeToTasks(
    userId: string,
    onTasks: (tasks: Task[]) => void,
    onError: (error: Error) => void,
) {
    const tasksQuery = query(
        getTasksCollection(userId),
        orderBy('createdAt', 'desc'),
    );

    return onSnapshot(
        tasksQuery,
        (snapshot) => {
            const tasks: Task[] = snapshot.docs.map((document) => {
                const data = document.data({
                    serverTimestamps: 'estimate',
                }) as Omit<Task, 'id'>;

                return {
                    ...data,
                    id: document.id,
                };
            });

            onTasks(tasks);
        },
        onError,
    );
}
