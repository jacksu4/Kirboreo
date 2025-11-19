import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from '@/app/chat/page';

// Mock ai/react useChat hook
const mockHandleSubmit = jest.fn(e => e.preventDefault());
const mockHandleInputChange = jest.fn();
const mockSetInput = jest.fn();

jest.mock('@ai-sdk/react', () => ({
  useChat: jest.fn(() => ({
    messages: [],
    input: '',
    handleInputChange: mockHandleInputChange,
    handleSubmit: mockHandleSubmit,
    isLoading: false,
    setInput: mockSetInput,
  })),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <span data-testid="arrow-left" />,
  Send: () => <span data-testid="send" />,
  Bot: () => <span data-testid="bot" />,
  User: () => <span data-testid="user" />,
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock fetch for our manual implementation in ChatPage
global.fetch = jest.fn();

describe('ChatPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the chat interface', () => {
    render(<ChatPage />);
    
    expect(screen.getByText(/Kirboreo AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Neural Interface/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
  });

  it('should handle user input', () => {
    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText(/Type your message/i);
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    
    expect(input).toHaveValue('Hello AI');
  });

  it('should disable send button when input is empty', () => {
    render(<ChatPage />);
    
    const button = screen.getByRole('button', { name: /Send/i });
    expect(button).toBeDisabled();
  });

  it('should enable send button when input has text', () => {
    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText(/Type your message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    const button = screen.getByRole('button', { name: /Send/i });
    expect(button).not.toBeDisabled();
  });
});

