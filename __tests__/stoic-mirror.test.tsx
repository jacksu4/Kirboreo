import { render, screen } from '@testing-library/react';
import StoicMirrorPage from '../app/labs/stoic-mirror/page';
import '@testing-library/jest-dom';

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

        const button = screen.getByTestId('send-button');
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled(); // Should be disabled because input is empty
    });

    it('renders the chat input field', () => {
        render(<StoicMirrorPage />);

        const input = screen.getByTestId('chat-input');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Write your thoughts here...');
    });
});

