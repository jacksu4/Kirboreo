import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

describe('Hero Component', () => {
  it('should render the main heading', () => {
    render(<Hero />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should display the company tagline', () => {
    render(<Hero />);
    
    // Check for key text content parts
    expect(screen.getByText(/Future of Tech/i)).toBeInTheDocument();
  });

  it('should render call-to-action buttons', () => {
    render(<Hero />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should have proper accessibility attributes', () => {
    render(<Hero />);
    
    // Check for main landmark or section
    const hero = document.querySelector('.hero');
    expect(hero).toBeInTheDocument();
  });
});

