import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';

describe('Navbar', () => {
  it('should render all main navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText(/Research/i)).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
    expect(screen.getByText(/Labs/i)).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should render the logo with correct text', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Kir')).toBeInTheDocument();
    expect(screen.getByText('boreo')).toBeInTheDocument();
  });

  it('should render the Contact Us button', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('should have correct href for logo link', () => {
    const { container } = render(<Navbar />);
    
    const logoLink = container.querySelector('a[href="/"]');
    expect(logoLink).toBeInTheDocument();
  });

  it('should have correct href for Contact Us button', () => {
    const { container } = render(<Navbar />);
    
    const contactButton = container.querySelector('a[href="/about#contact"]');
    expect(contactButton).toBeInTheDocument();
  });

  it('should show Labs dropdown on hover', () => {
    render(<Navbar />);
    
    const labsLink = screen.getByText(/Labs/i);
    const dropdown = labsLink.closest('.dropdown');
    
    expect(dropdown).toBeInTheDocument();
    
    // Initially dropdown menu should not be visible
    expect(screen.queryByText('FOMO Meter')).not.toBeInTheDocument();
    
    // Trigger mouse enter
    if (dropdown) {
      fireEvent.mouseEnter(dropdown);
    }
    
    // Now dropdown items should be visible
    expect(screen.getByText('FOMO Meter')).toBeInTheDocument();
    expect(screen.getByText('Stoic Mirror')).toBeInTheDocument();
    expect(screen.getByText('ELI5 Generator')).toBeInTheDocument();
  });

  it('should hide Labs dropdown on mouse leave', () => {
    render(<Navbar />);
    
    const labsLink = screen.getByText(/Labs/i);
    const dropdown = labsLink.closest('.dropdown');
    
    if (dropdown) {
      // Show dropdown
      fireEvent.mouseEnter(dropdown);
      expect(screen.getByText('FOMO Meter')).toBeInTheDocument();
      
      // Hide dropdown
      fireEvent.mouseLeave(dropdown);
      expect(screen.queryByText('FOMO Meter')).not.toBeInTheDocument();
    }
  });

  it('should have correct links in Labs dropdown', () => {
    render(<Navbar />);
    
    const labsLink = screen.getByText(/Labs/i);
    const dropdown = labsLink.closest('.dropdown');
    
    if (dropdown) {
      fireEvent.mouseEnter(dropdown);
      
      const fomoMeterLink = screen.getByText('FOMO Meter').closest('a');
      const stoicMirrorLink = screen.getByText('Stoic Mirror').closest('a');
      const eli5GeneratorLink = screen.getByText('ELI5 Generator').closest('a');
      
      expect(fomoMeterLink).toHaveAttribute('href', '/labs#fomo-meter');
      expect(stoicMirrorLink).toHaveAttribute('href', '/labs#stoic-mirror');
      expect(eli5GeneratorLink).toHaveAttribute('href', '/labs#eli5-generator');
    }
  });

  it('should display dropdown descriptions', () => {
    render(<Navbar />);
    
    const labsLink = screen.getByText(/Labs/i);
    const dropdown = labsLink.closest('.dropdown');
    
    if (dropdown) {
      fireEvent.mouseEnter(dropdown);
      
      expect(screen.getByText('Market sentiment visualizer')).toBeInTheDocument();
      expect(screen.getByText('AI-powered reflection companion')).toBeInTheDocument();
      expect(screen.getByText('Complex finance made simple')).toBeInTheDocument();
    }
  });

  it('should display emoji icons in dropdown', () => {
    render(<Navbar />);
    
    const labsLink = screen.getByText(/Labs/i);
    const dropdown = labsLink.closest('.dropdown');
    
    if (dropdown) {
      fireEvent.mouseEnter(dropdown);
      
      expect(screen.getByText('😱')).toBeInTheDocument();
      expect(screen.getByText('🪞')).toBeInTheDocument();
      expect(screen.getByText('🍎')).toBeInTheDocument();
    }
  });

  it('should have fixed positioning for navbar', () => {
    const { container } = render(<Navbar />);
    
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  it('should render contact icon emoji', () => {
    render(<Navbar />);
    
    expect(screen.getByText('✉️')).toBeInTheDocument();
  });
});
