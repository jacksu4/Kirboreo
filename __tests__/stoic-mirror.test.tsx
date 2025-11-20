import { render, screen, fireEvent } from '@testing-library/react';
import StoicMirrorPage from '../app/labs/stoic-mirror/page';
import '@testing-library/jest-dom';

// Mock the useChat hook
const mockHandleInputChange = jest.fn();
const mockHandleSubmit = jest.fn((e) => e.preventDefault());

jest.mock('@ai-sdk/react', () => ({
    useChat: () => ({
        messages: [],
        input: '', // Initial state is empty string
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        isLoading: false,
    }),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <span data-testid="arrow-left">ArrowLeft</span>,
    Send: () => <span data-testid="send">Send</span>,
    Sparkles: () => <span data-testid="sparkles">Sparkles</span>,
}));

describe('StoicMirrorPage', () => {
    it('renders the header and main content', () => {
        render(<StoicMirrorPage />);

        expect(screen.getByText('The Digital Stoic Mirror')).toBeInTheDocument();
        expect(screen.getByText('Reflect on your inner self')).toBeInTheDocument();
        expect(screen.getByText('Back to Labs')).toBeInTheDocument();
    });

    it('renders the empty state initially', () => {
        render(<StoicMirrorPage />);

        expect(screen.getByText('Gaze into the mirror')).toBeInTheDocument();
        expect(screen.getByText(/The happiness of your life depends/)).toBeInTheDocument();
    });

    it('renders the input form and disables button when empty', () => {
        render(<StoicMirrorPage />);

        const input = screen.getByPlaceholderText('Write your thoughts here...');
        expect(input).toBeInTheDocument();

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled(); // Should be disabled because input is empty
    });
});
