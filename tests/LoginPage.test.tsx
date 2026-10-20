import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../src/pages/LoginPage';
import { loginUser } from '../src/services/auth';

vi.mock('../src/services/auth', () => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
    logoutUser: vi.fn(),
}));

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('inicia sesión con el email y la contraseña ingresados', async () => {
        vi.mocked(loginUser).mockResolvedValue(undefined as never);

        render(<LoginPage onSwitchToRegister={vi.fn()} />);

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'test@example.com' },
        });

        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: 'password123' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: 'Iniciar sesión' }),
        );

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith(
                'test@example.com',
                'password123',
            );
        });
    });

    it('muestra un error cuando las credenciales son incorrectas', async () => {
        vi.mocked(loginUser).mockRejectedValue({
            code: 'auth/invalid-credential',
        });

        render(<LoginPage onSwitchToRegister={vi.fn()} />);

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'test@example.com' },
        });

        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: 'incorrecta' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: 'Iniciar sesión' }),
        );

        expect(
            await screen.findByRole('alert'),
        ).toHaveTextContent('Email o contraseña incorrectos.');
    });
});
