import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ELI5GeneratorPage from '@/app/labs/eli5-generator/page';

// Mock fetch
global.fetch = jest.fn();

// Mock CardPreview component
jest.mock('@/components/CardPreview', () => {
    return function MockCardPreview({ title, explanation }: any) {
        return (
            <div data-testid="card-preview">
                <div>{title}</div>
                <div>{explanation}</div>
            </div>
        );
    };
});

describe('ELI5 Generator Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the page with all main elements', () => {
        render(<ELI5GeneratorPage />);

        expect(screen.getByText(/Explain Like I'm 5/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Paste complex financial terms/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Simplifiy It/i })).toBeInTheDocument();
    });

    it('should show character count', () => {
        render(<ELI5GeneratorPage />);

        const textarea = screen.getByPlaceholderText(/Paste complex financial terms/i);
        fireEvent.change(textarea, { target: { value: 'Test input' } });

        expect(screen.getByText(/10 \/ 2000 chars/i)).toBeInTheDocument();
    });

    it('should disable submit button when input is empty', () => {
        render(<ELI5GeneratorPage />);

        const submitButton = screen.getByRole('button', { name: /Simplifiy It/i });
        expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when input has text', () => {
        render(<ELI5GeneratorPage />);

        const textarea = screen.getByPlaceholderText(/Paste complex financial terms/i);
        fireEvent.change(textarea, { target: { value: 'Explain blockchain' } });

        const submitButton = screen.getByRole('button', { name: /Simplifiy It/i });
        expect(submitButton).not.toBeDisabled();
    });

    it('should disable submit button when character limit is exceeded', () => {
        render(<ELI5GeneratorPage />);

        const textarea = screen.getByPlaceholderText(/Paste complex financial terms/i);
        const longText = 'a'.repeat(2001);
        fireEvent.change(textarea, { target: { value: longText } });

        const submitButton = screen.getByRole('button', { name: /Simplifiy It/i });
        expect(submitButton).toBeDisabled();
    });

    it('should populate input when example button is clicked', () => {
        render(<ELI5GeneratorPage />);

        const exampleButton = screen.getByRole('button', { name: /Short Selling/i });
        fireEvent.click(exampleButton);

        const textarea = screen.getByPlaceholderText(/Paste complex financial terms/i) as HTMLTextAreaElement;
        expect(textarea.value).toContain('Short selling');
    });

    it('should display loading state during generation', async () => {
        // Mock fetch to return a stream
        const mockReader = {
            read: jest.fn()
                .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('Test ') })
                .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('response') })
                .mockResolvedValueOnce({ done: true }),
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            body: {
                getReader: () => mockReader,
            },
        });

        render(<ELI5GeneratorPage />);

        const textarea = screen.getByPlaceholderText(/Paste complex financial terms/i);
        fireEvent.change(textarea, { target: { value: 'Test input' } });

        const submitButton = screen.getByRole('button', { name: /Simplifiy It/i });
        fireEvent.click(submitButton);

        expect(screen.getByText(/Processing.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Simplifiy It/i })).toBeInTheDocument();
        });
    });

    it('should display explanation after successful generation', async () => {
        const mockExplanation = 'This is a simple explanation 🍎';
        const mockReader = {
            read: jest.fn()
                .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(mockExplanation) })
                .mockResolvedValueOnce({ done: true, value: undefined }),
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            body: {
                getReader: () => mockReader,
            },
        });

        render(<ELI5GeneratorPage />);

        const textarea = screen.getByPlaceholderText(/Paste complex financial terms/i);
        fireEvent.change(textarea, { target: { value: 'Test input' } });

        const submitButton = screen.getByRole('button', { name: /Simplifiy It/i });
        fireEvent.click(submitButton);

        // Wait for the explanation to appear
        await waitFor(() => {
            // The explanation is streamed, so we check if the text content contains the expected text
            const explanationElement = screen.getByText((content, element) => {
                return element?.tagName.toLowerCase() === 'p' && content.includes(mockExplanation);
            });
            expect(explanationElement).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('should display error message on API failure', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'API Error' }),
        });

        render(<ELI5GeneratorPage />);

        const textarea = screen.getByPlaceholderText(/Paste complex financial terms/i);
        fireEvent.change(textarea, { target: { value: 'Test input' } });

        const submitButton = screen.getByRole('button', { name: /Simplifiy It/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/API Error/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('should show card preview when explanation is generated', async () => {
        const mockExplanation = 'Simple explanation';
        const mockReader = {
            read: jest.fn()
                .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(mockExplanation) })
                .mockResolvedValueOnce({ done: true, value: undefined }),
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            body: {
                getReader: () => mockReader,
            },
        });

        render(<ELI5GeneratorPage />);

        const textarea = screen.getByPlaceholderText(/Paste complex financial terms/i);
        fireEvent.change(textarea, { target: { value: 'Test input' } });

        const submitButton = screen.getByRole('button', { name: /Simplifiy It/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByTestId('card-preview')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('should copy explanation to clipboard', async () => {
        const mockExplanation = 'Simple explanation';
        const mockReader = {
            read: jest.fn()
                .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(mockExplanation) })
                .mockResolvedValueOnce({ done: true, value: undefined }),
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            body: {
                getReader: () => mockReader,
            },
        });

        // Mock clipboard API
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn().mockResolvedValue(undefined),
            },
        });

        render(<ELI5GeneratorPage />);

        const textarea = screen.getByPlaceholderText(/Paste complex financial terms/i);
        fireEvent.change(textarea, { target: { value: 'Test input' } });

        const submitButton = screen.getByRole('button', { name: /Simplifiy It/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            // Use custom matcher for partial text match in paragraph
            const explanationElement = screen.getByText((content, element) => {
                return element?.tagName.toLowerCase() === 'p' && content.includes(mockExplanation);
            });
            expect(explanationElement).toBeInTheDocument();
        }, { timeout: 3000 });

        const copyButton = screen.getByTitle(/Copy to clipboard/i);
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockExplanation);
        });
    });
});
