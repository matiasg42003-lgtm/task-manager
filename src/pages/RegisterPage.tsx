
import { useState, type FormEvent } from 'react';
import { registerUser } from '../services/auth';

interface RegisterPageProps {
    onSwitchToLogin: () => void;
}

function getRegisterErrorMessage(code: string): string {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'Ya existe una cuenta con ese email.';
        case 'auth/invalid-email':
            return 'Ingresá un email válido.';
        case 'auth/weak-password':
            return 'La contraseña es demasiado débil.';
        case 'auth/operation-not-allowed':
            return 'El registro por email todavía no está habilitado en Firebase.';
        default:
            return 'No pudimos crear la cuenta. Intentá nuevamente.';
    }
}

export default function RegisterPage({
    onSwitchToLogin,
}: RegisterPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await registerUser(email.trim(), password);
        } catch (err: unknown) {
            const code =
                typeof err === 'object' &&
                    err !== null &&
                    'code' in err &&
                    typeof err.code === 'string'
                    ? err.code
                    : '';

            setError(getRegisterErrorMessage(code));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="terminal-header-bar" aria-hidden="true">
                    <div className="terminal-status-group">
                        <span className="status-led status-led--amber"></span>
                        <span>REGISTRATION MODULE</span>
                    </div>
                    <span>SYS.PROVISION // 80S</span>
                </div>

                <p className="eyebrow">
                    <span className="terminal-chip">NEW OPERATOR</span>
                    TASK TERMINAL
                </p>
                <h1>
                    Crear una cuenta<span className="terminal-cursor" aria-hidden="true">_</span>
                </h1>
                <p className="auth-description">
                    Registrate para empezar a organizar tus tareas en la consola.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <label htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
                        type="email"
                        autoComplete="email"
                        placeholder="operador@terminal.sys"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label htmlFor="register-password">Contraseña</label>
                    <input
                        id="register-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="mínimo 6 caracteres"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={6}
                        required
                    />

                    {error && <p className="form-error" role="alert">{error}</p>}

                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className="auth-switch">
                    ¿Ya tenés cuenta?{' '}
                    <button type="button" className="text-button" onClick={onSwitchToLogin}>
                        Iniciar sesión
                    </button>
                </p>
            </section>
        </main>
    );
}
