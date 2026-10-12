
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useNavigate,
} from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TasksPage from '../pages/TasksPage';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <main className="auth-page">
                <p role="status">Comprobando sesión...</p>
            </main>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to={user ? '/tasks' : '/login'}
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={
                    user ? (
                        <Navigate to="/tasks" replace />
                    ) : (
                        <LoginPage
                            onSwitchToRegister={() => navigate('/register')}
                        />
                    )
                }
            />

            <Route
                path="/register"
                element={
                    user ? (
                        <Navigate to="/tasks" replace />
                    ) : (
                        <RegisterPage
                            onSwitchToLogin={() => navigate('/login')}
                        />
                    )
                }
            />

            <Route element={<ProtectedRoute />}>
                <Route path="/tasks" element={<TasksPage />} />
            </Route>

            <Route
                path="*"
                element={
                    <main className="auth-page">
                        <section className="auth-card">
                            <h1>Página no encontrada</h1>
                            <p className="auth-description">
                                La dirección que buscás no existe.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                            >
                                Volver al inicio
                            </button>
                        </section>
                    </main>
                }
            />
        </Routes>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}
