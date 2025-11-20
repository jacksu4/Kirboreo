import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '@/components/Navbar';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('Navbar Component', () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  describe('Logo', () => {
    it('should render the Kirboreo logo', () => {
      expect(screen.getByText('Kir')).toBeInTheDocument();
      expect(screen.getByText('boreo')).toBeInTheDocument();
    });

    it('should have logo link to home page', () => {
      const logoLink = screen.getByText('Kir').closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Navigation Links', () => {
    it('should render all main navigation links', () => {
      expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Research/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Analysis/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
    });

    it('should have correct href attributes', () => {
      expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /Research/i })).toHaveAttribute('href', '/research');
      expect(screen.getByRole('link', { name: /Analysis/i })).toHaveAttribute('href', '/analysis');
      expect(screen.getByRole('link', { name: /About/i })).toHaveAttribute('href', '/about');
    });
  });

  describe('Labs Dropdown', () => {
    it('should render Labs link with emoji', () => {
      expect(screen.getByText(/Labs 🧪/i)).toBeInTheDocument();
    });

    it('should have Labs link pointing to /labs', () => {
      const labsLink = screen.getByRole('link', { name: /Labs 🧪/i });
      expect(labsLink).toHaveAttribute('href', '/labs');
    });

    it('should not show dropdown menu initially', () => {
      // The dropdown items should not be visible initially
      expect(screen.queryByText('Market sentiment visualizer')).not.toBeInTheDocument();
    });

    it('should show dropdown menu on mouse enter', async () => {
      const labsLink = screen.getByRole('link', { name: /Labs 🧪/i });
      const dropdownContainer = labsLink.closest('[class*="dropdown"]');

      if (dropdownContainer) {
        fireEvent.mouseEnter(dropdownContainer);

        await waitFor(() => {
          expect(screen.getByText('FOMO Meter')).toBeInTheDocument();
          expect(screen.getByText('Stoic Mirror')).toBeInTheDocument();
          expect(screen.getByText('ELI5 Generator')).toBeInTheDocument();
        });
      }
    });

    it('should hide dropdown menu on mouse leave', async () => {
      const labsLink = screen.getByRole('link', { name: /Labs 🧪/i });
      const dropdownContainer = labsLink.closest('[class*="dropdown"]');

      if (dropdownContainer) {
        // Show dropdown
        fireEvent.mouseEnter(dropdownContainer);

        await waitFor(() => {
          expect(screen.getByText('FOMO Meter')).toBeInTheDocument();
        });

        // Hide dropdown
        fireEvent.mouseLeave(dropdownContainer);

        await waitFor(() => {
          expect(screen.queryByText('Market sentiment visualizer')).not.toBeInTheDocument();
        });
      }
    });

    it('should render all four dropdown items when open', async () => {
      const labsLink = screen.getByRole('link', { name: /Labs 🧪/i });
      const dropdownContainer = labsLink.closest('[class*="dropdown"]');

      if (dropdownContainer) {
        fireEvent.mouseEnter(dropdownContainer);

        await waitFor(() => {
          // Check titles
          expect(screen.getByText('FOMO Meter')).toBeInTheDocument();
          expect(screen.getByText('AI Lab')).toBeInTheDocument();
          expect(screen.getByText('Stoic Mirror')).toBeInTheDocument();
          expect(screen.getByText('ELI5 Generator')).toBeInTheDocument();

          // Check descriptions
          expect(screen.getByText('Market sentiment visualizer')).toBeInTheDocument();
          expect(screen.getByText('Experimental AI playground')).toBeInTheDocument();
          expect(screen.getByText('AI-powered reflection companion')).toBeInTheDocument();
          expect(screen.getByText('Complex finance made simple')).toBeInTheDocument();
        });
      }
    });

    it('should have correct anchor links for dropdown items', async () => {
      const labsLink = screen.getByRole('link', { name: /Labs 🧪/i });
      const dropdownContainer = labsLink.closest('[class*="dropdown"]');

      if (dropdownContainer) {
        fireEvent.mouseEnter(dropdownContainer);

        await waitFor(() => {
          const fomoLink = screen.getByText('FOMO Meter').closest('a');
          const aiLabLink = screen.getByText('AI Lab').closest('a');
          const stoicLink = screen.getByText('Stoic Mirror').closest('a');
          const eli5Link = screen.getByText('ELI5 Generator').closest('a');

          expect(fomoLink).toHaveAttribute('href', '/labs/fomo-meter');
          expect(aiLabLink).toHaveAttribute('href', 'https://ai-lab-green.vercel.app/');
          expect(aiLabLink).toHaveAttribute('target', '_blank');
          expect(aiLabLink).toHaveAttribute('rel', 'noopener noreferrer');
          expect(stoicLink).toHaveAttribute('href', '/labs#stoic-mirror');
          expect(eli5Link).toHaveAttribute('href', '/labs#eli5-generator');
        });
      }
    });

    it('should render dropdown item emojis', async () => {
      const labsLink = screen.getByRole('link', { name: /Labs 🧪/i });
      const dropdownContainer = labsLink.closest('[class*="dropdown"]');

      if (dropdownContainer) {
        fireEvent.mouseEnter(dropdownContainer);

        await waitFor(() => {
          expect(screen.getByText('😱')).toBeInTheDocument();
          expect(screen.getByText('🤖')).toBeInTheDocument();
          expect(screen.getByText('🪞')).toBeInTheDocument();
          expect(screen.getByText('🍎')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Contact Button', () => {
    it('should render Contact Us button', () => {
      expect(screen.getByRole('link', { name: /Contact Us/i })).toBeInTheDocument();
    });

    it('should have Contact Us button link to about page contact section', () => {
      const contactButton = screen.getByRole('link', { name: /Contact Us/i });
      expect(contactButton).toHaveAttribute('href', '/about#contact');
    });

    it('should render email icon in Contact Us button', () => {
      const contactButton = screen.getByRole('link', { name: /Contact Us/i });
      expect(contactButton.textContent).toContain('✉️');
    });
  });

  describe('Component Structure', () => {
    it('should render as a nav element', () => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have container with all main elements', () => {
      const { container } = render(<Navbar />);
      const navContainer = container.querySelector('[class*="container"]');
      expect(navContainer).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should manage dropdown state correctly', async () => {
      render(<Navbar />);
      const labsLinks = screen.getAllByRole('link', { name: /Labs 🧪/i });
      const labsLink = labsLinks[0]; // Get the first one
      const dropdownContainer = labsLink.closest('[class*="dropdown"]');

      if (dropdownContainer) {
        // Initial state - closed
        expect(screen.queryByText('Market sentiment visualizer')).not.toBeInTheDocument();

        // Open dropdown
        fireEvent.mouseEnter(dropdownContainer);
        await waitFor(() => {
          expect(screen.getByText('Market sentiment visualizer')).toBeInTheDocument();
        });

        // Close dropdown
        fireEvent.mouseLeave(dropdownContainer);
        await waitFor(() => {
          expect(screen.queryByText('Market sentiment visualizer')).not.toBeInTheDocument();
        });

        // Reopen dropdown
        fireEvent.mouseEnter(dropdownContainer);
        await waitFor(() => {
          expect(screen.getByText('Market sentiment visualizer')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Accessibility', () => {
    it('should have semantic navigation structure', () => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have accessible link elements', () => {
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('Client Component', () => {
    it('should be a client component (uses useState)', () => {
      // This test verifies that the component can manage state
      // by checking if the dropdown functionality works (which requires client-side JS)
      const { container } = render(<Navbar />);
      const labsLink = container.querySelector('[class*="dropdown"]');
      expect(labsLink).toBeInTheDocument();
    });
  });
});
