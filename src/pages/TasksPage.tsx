
import { logoutUser } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

export default function TasksPage() {
    const { user } = useAuth();

    async function handleLogout() {
        try {
            await logoutUser();
        } catch (error) {
            console.error('No se pudo cerrar la sesión:', error);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <p className="eyebrow">TASK MANAGER</p>
                <h1>¡Ya estás dentro!</h1>
                <p className="auth-description">
                    La autenticación funciona correctamente.
                </p>

                <p className="user-email">
                    Sesión iniciada como: {user?.email ?? 'Usuario'}
                </p>

                <button type="button" onClick={handleLogout}>
                    Cerrar sesión
                </button>

                <p className="auth-description">
                    ...
                </p>
            </section>
        </main>
    );
}
