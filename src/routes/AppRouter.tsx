
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
                            <div className="terminal-header-bar" aria-hidden="true">
                                <div className="terminal-status-group">
                                    <span className="status-led status-led--amber"></span>
                                    <span>SYSTEM ALERT</span>
                                </div>
                                <span>SECTOR: 404</span>
                            </div>
                            <p className="eyebrow">
                                <span className="terminal-chip">ROUTE MALFUNCTION</span>
                                NOT FOUND
                            </p>
                            <h1>Página no encontrada<span className="terminal-cursor" aria-hidden="true">_</span></h1>
                            <p className="auth-description">
                                La dirección que buscás no existe o no tiene permisos en esta terminal.
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
