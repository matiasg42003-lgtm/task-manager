import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TasksPage from '../src/pages/TasksPage';
import { useAuth } from '../src/hooks/useAuth';
import { useTasks } from '../src/hooks/useTasks';

vi.mock('../src/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../src/hooks/useTasks', () => ({
    useTasks: vi.fn(),
}));

vi.mock('../src/services/auth', () => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
    logoutUser: vi.fn(),
}));

describe('TasksPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useAuth).mockReturnValue({
            user: {
                uid: 'user-123',
                email: 'test@example.com',
            } as ReturnType<typeof useAuth>['user'],
            loading: false,
        });
    });

    it('crea una tarea con el título ingresado', async () => {
        const addTask = vi.fn().mockResolvedValue(undefined);

        vi.mocked(useTasks).mockReturnValue({
            tasks: [],
            loading: false,
            error: null,
            addTask,
            toggleTask: vi.fn(),
            removeTask: vi.fn(),
        });

        render(<TasksPage />);

        fireEvent.change(screen.getByLabelText('Título'), {
            target: { value: 'Estudiar React' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: 'Crear tarea' }),
        );

        await waitFor(() => {
            expect(addTask).toHaveBeenCalledWith({
                title: 'Estudiar React',
                completed: false,
            });
        });
    });

    it('muestra un error si falla la creación de una tarea', async () => {
        const addTask = vi.fn().mockRejectedValue(
            new Error('Error de prueba'),
        );

        vi.mocked(useTasks).mockReturnValue({
            tasks: [],
            loading: false,
            error: null,
            addTask,
            toggleTask: vi.fn(),
            removeTask: vi.fn(),
        });

        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => { });

        render(<TasksPage />);

        fireEvent.change(screen.getByLabelText('Título'), {
            target: { value: 'Estudiar React' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: 'Crear tarea' }),
        );

        expect(
            await screen.findByRole('alert'),
        ).toHaveTextContent(
            'No se pudo crear la tarea. Intentá nuevamente.',
        )

        consoleError.mockRestore();
    });
});
