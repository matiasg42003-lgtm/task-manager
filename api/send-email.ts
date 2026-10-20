
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

type TaskSummary = {
    title: string;
    completed: boolean;
};

function getFirebaseAdminAuth() {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (!serviceAccountJson) {
        throw new Error('Falta configurar FIREBASE_SERVICE_ACCOUNT_JSON.');
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    const app =
        getApps().length > 0
            ? getApps()[0]
            : initializeApp({
                credential: cert(serviceAccount),
            });

    return getAuth(app);
}

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    if (request.method !== 'POST') {
        return response.status(405).json({
            error: 'Método no permitido.',
        });
    }

    try {
        // Verificar que la solicitud venga de un usuario autenticado.
        const authorization = request.headers.authorization;

        if (!authorization?.startsWith('Bearer ')) {
            return response.status(401).json({
                error: 'Falta el token de autenticación.',
            });
        }

        const idToken = authorization.slice('Bearer '.length);
        const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);

        if (!decodedToken.email) {
            return response.status(400).json({
                error: 'La cuenta no tiene un email asociado.',
            });
        }

        // Validar las tareas recibidas desde el frontend.
        const tasks = request.body?.tasks;

        if (!Array.isArray(tasks) || tasks.length > 50) {
            return response.status(400).json({
                error: 'La solicitud debe incluir hasta 50 tareas.',
            });
        }

        const validTasks = tasks.every(
            (task: unknown) =>
                typeof task === 'object' &&
                task !== null &&
                typeof (task as TaskSummary).title === 'string' &&
                typeof (task as TaskSummary).completed === 'boolean',
        );

        if (!validTasks) {
            return response.status(400).json({
                error: 'El formato de las tareas no es válido.',
            });
        }

        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.error('Falta configurar RESEND_API_KEY.');

            return response.status(500).json({
                error: 'El servicio de email no está configurado.',
            });
        }

        // Preparar el contenido del correo.
        const taskList = (tasks as TaskSummary[])
            .map(
                (task, index) =>
                    `${index + 1}. [${task.completed ? 'Completada' : 'Pendiente'}] ${task.title}`,
            )
            .join('\n');

        const emailBody =
            tasks.length > 0
                ? `Este es el resumen de tus tareas:\n\n${taskList}\n\nTotal de tareas: ${tasks.length}\nCompletadas: ${(tasks as TaskSummary[]).filter((task) => task.completed).length}\nPendientes: ${(tasks as TaskSummary[]).filter((task) => !task.completed).length}`
                : 'Todavía no tenés tareas registradas.';

        // Enviar el correo mediante Resend.
        const resend = new Resend(apiKey);

        const { error } = await resend.emails.send({
            from: 'Task Manager <onboarding@resend.dev>',
            to: [decodedToken.email],
            subject: 'Resumen de tus tareas',
            text: emailBody,
        });

        if (error) {
            console.error('Error de Resend:', error);

            return response.status(502).json({
                error: 'El proveedor no pudo enviar el email.',
            });
        }

        return response.status(200).json({
            message: 'El resumen se envió correctamente.',
        });
    } catch (error) {
        console.error('Error al enviar el resumen:', error);

        return response.status(500).json({
            error: 'No se pudo enviar el resumen. Revisá la configuración del servidor.',
        });
    }
}
