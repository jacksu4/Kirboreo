import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardPreview from '@/components/CardPreview';

// Mock canvas
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 100 })),
    createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
    })),
})) as any;

HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,mock');

describe('CardPreview Component', () => {
    it('should render canvas element', () => {
        render(
            <CardPreview
                title="Test Title"
                explanation="Test explanation"
            />
        );

        const canvas = document.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
    });

    it('should render download button', () => {
        render(
            <CardPreview
                title="Test Title"
                explanation="Test explanation"
            />
        );

        expect(screen.getByRole('button', { name: /Download Image/i })).toBeInTheDocument();
    });

    it('should disable download button when explanation is empty', () => {
        render(
            <CardPreview
                title="Test Title"
                explanation=""
            />
        );

        const downloadButton = screen.getByRole('button', { name: /Download Image/i });
        expect(downloadButton).toBeDisabled();
    });

    it('should enable download button when explanation is provided', () => {
        render(
            <CardPreview
                title="Test Title"
                explanation="Test explanation"
            />
        );

        const downloadButton = screen.getByRole('button', { name: /Download Image/i });
        expect(downloadButton).not.toBeDisabled();
    });

    it('should set correct canvas dimensions', () => {
        render(
            <CardPreview
                title="Test Title"
                explanation="Test explanation"
            />
        );

        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        expect(canvas.width).toBe(1200);
        expect(canvas.height).toBe(630);
    });

    it('should apply gradient template styling', () => {
        const mockContext = {
            clearRect: jest.fn(),
            fillRect: jest.fn(),
            fillText: jest.fn(),
            measureText: jest.fn(() => ({ width: 100 })),
            createLinearGradient: jest.fn(() => ({
                addColorStop: jest.fn(),
            })),
        };

        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext) as any;

        render(
            <CardPreview
                title="Test Title"
                explanation="Test explanation"
                template="gradient"
            />
        );

        expect(mockContext.createLinearGradient).toHaveBeenCalled();
    });

    it('should call onDownload callback when download button is clicked', () => {
        const mockOnDownload = jest.fn();

        // Mock createElement and click
        const mockLink = {
            click: jest.fn(),
            download: '',
            href: '',
            style: {},
            setAttribute: jest.fn(),
        } as unknown as HTMLAnchorElement;

        const originalCreateElement = document.createElement.bind(document);
        jest.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
            if (tagName === 'a') {
                return mockLink;
            }
            return originalCreateElement(tagName, options);
        });

        render(
            <CardPreview
                title="Test Title"
                explanation="Test explanation"
                onDownload={mockOnDownload}
            />
        );

        const downloadButton = screen.getByRole('button', { name: /Download Image/i });
        downloadButton.click();

        expect(mockOnDownload).toHaveBeenCalled();
        expect(mockLink.click).toHaveBeenCalled();
    });
});
