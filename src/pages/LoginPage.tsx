
import { useState, type FormEvent } from 'react';
import { loginUser } from '../services/auth';

interface LoginPageProps {
    onSwitchToRegister: () => void;
}

function getLoginErrorMessage(code: string): string {
    switch (code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Email o contraseña incorrectos.';
        case 'auth/invalid-email':
            return 'Ingresá un email válido.';
        case 'auth/too-many-requests':
            return 'Demasiados intentos. Esperá un momento y probá de nuevo.';
        default:
            return 'No pudimos iniciar sesión. Intentá nuevamente.';
    }
}

export default function LoginPage({
    onSwitchToRegister,
}: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await loginUser(email.trim(), password);
        } catch (err: unknown) {
            const code =
                typeof err === 'object' &&
                    err !== null &&
                    'code' in err &&
                    typeof err.code === 'string'
                    ? err.code
                    : '';

            setError(getLoginErrorMessage(code));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="terminal-header-bar" aria-hidden="true">
                    <div className="terminal-status-group">
                        <span className="status-led"></span>
                        <span>SYSTEM ONLINE</span>
                    </div>
                    <span>AUTH-NODE // 80S</span>
                </div>

                <p className="eyebrow">
                    <span className="terminal-chip">SYS.ACCESS</span>
                    TASK TERMINAL
                </p>
                <h1>
                    Bienvenido de nuevo<span className="terminal-cursor" aria-hidden="true">_</span>
                </h1>
                <p className="auth-description">
                    Iniciá sesión para continuar con tus tareas en la consola.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder="operador@terminal.sys"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label htmlFor="login-password">Contraseña</label>
                    <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    {error && <p className="form-error" role="alert">{error}</p>}

                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>
                </form>

                <p className="auth-switch">
                    ¿Todavía no tenés cuenta?{' '}
                    <button type="button" className="text-button" onClick={onSwitchToRegister}>
                        Crear cuenta
                    </button>
                </p>
            </section>
        </main>
    );
}
