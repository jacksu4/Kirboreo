import { render, screen } from '@testing-library/react';
import LabsPage from '@/app/labs/page';

// Mock the Navbar component
jest.mock('@/components/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="mock-navbar">Navbar</nav>;
  };
});

// Mock the ProjectCard component
jest.mock('@/components/ProjectCard', () => {
  return function MockProjectCard({ title, id }: { title: string; id: string }) {
    return <div data-testid={`project-card-${id}`}>{title}</div>;
  };
});

describe('LabsPage', () => {
  it('should render the page without crashing', () => {
    render(<LabsPage />);
    
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
  });

  it('should render the hero title', () => {
    render(<LabsPage />);
    
    expect(screen.getByText(/Kirboreo/i)).toBeInTheDocument();
    expect(screen.getByText(/Labs/i)).toBeInTheDocument();
  });

  it('should render the hero subtitle', () => {
    render(<LabsPage />);
    
    expect(screen.getByText(/Experimental AI-Powered Tools for Finance & Investment/i)).toBeInTheDocument();
  });

  it('should render the hero description', () => {
    render(<LabsPage />);
    
    expect(screen.getByText(/Where curiosity meets innovation/i)).toBeInTheDocument();
  });

  it('should render all three project cards', () => {
    render(<LabsPage />);
    
    expect(screen.getByTestId('project-card-fomo-meter')).toBeInTheDocument();
    expect(screen.getByTestId('project-card-stoic-mirror')).toBeInTheDocument();
    expect(screen.getByTestId('project-card-eli5-generator')).toBeInTheDocument();
  });

  it('should render project titles in project cards', () => {
    render(<LabsPage />);
    
    expect(screen.getByText('FOMO Meter')).toBeInTheDocument();
    expect(screen.getByText('Stoic Mirror')).toBeInTheDocument();
    expect(screen.getByText('ELI5 Generator')).toBeInTheDocument();
  });

  it('should render the CTA section', () => {
    render(<LabsPage />);
    
    expect(screen.getByText('Have an Idea?')).toBeInTheDocument();
  });

  it('should render the CTA description', () => {
    render(<LabsPage />);
    
    expect(screen.getByText(/We're always experimenting with new concepts/i)).toBeInTheDocument();
  });

  it('should render the CTA button', () => {
    render(<LabsPage />);
    
    const ctaButton = screen.getByText(/Share Your Thoughts/i);
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton.closest('a')).toHaveAttribute('href', '/about#contact');
  });

  it('should have correct link for CTA button', () => {
    const { container } = render(<LabsPage />);
    
    const ctaLink = container.querySelector('a[href="/about#contact"]');
    expect(ctaLink).toBeInTheDocument();
  });

  it('should render emphasis on fun and useful in description', () => {
    render(<LabsPage />);
    
    const description = screen.getByText(/fun, useful, and surprisingly delightful/i);
    expect(description).toBeInTheDocument();
  });

  it('should mention AI in hero description', () => {
    render(<LabsPage />);
    
    expect(screen.getByText(/cutting-edge AI with practical financial insights/i)).toBeInTheDocument();
  });

  it('should render emoji in title', () => {
    render(<LabsPage />);
    
    expect(screen.getByText(/🧪/)).toBeInTheDocument();
  });

  it('should render emoji in CTA button', () => {
    render(<LabsPage />);
    
    expect(screen.getByText(/💬/)).toBeInTheDocument();
  });
});

describe('LabsPage Metadata', () => {
  it('should export correct metadata', () => {
    const { metadata } = require('@/app/labs/page');
    
    expect(metadata.title).toBe('Labs | Kirboreo Experimental Projects');
    expect(metadata.description).toBe('Explore experimental AI-powered tools for finance and investment analysis.');
  });
});

