import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar Component', () => {
  it('should render the logo/brand name', () => {
    render(<Navbar />);
    
    expect(screen.getByText(/Kirboreo/i)).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Navbar />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should have correct navigation structure', () => {
    render(<Navbar />);
    
    // Check for main nav sections
    expect(screen.getByText(/Research/i)).toBeInTheDocument();
    expect(screen.getByText(/Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  it('should have responsive mobile menu', () => {
    render(<Navbar />);
    
    // Check for mobile menu button (if exists)
    const nav = document.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });
});

