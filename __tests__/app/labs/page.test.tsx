import { render, screen } from '@testing-library/react';
import LabsPage from '@/app/labs/page';

// Mock the Navbar component
jest.mock('@/components/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('LabsPage', () => {
  beforeEach(() => {
    render(<LabsPage />);
  });

  describe('Page Structure', () => {
    it('should render the navbar', () => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should render the hero section', () => {
      expect(screen.getByText('Kirboreo')).toBeInTheDocument();
      expect(screen.getByText('Labs')).toBeInTheDocument();
    });

    it('should render the hero subtitle', () => {
      expect(screen.getByText('Experimental AI-Powered Tools for Modern Investors')).toBeInTheDocument();
    });

    it('should render the hero description', () => {
      expect(screen.getByText(/Where serious finance meets playful innovation/i)).toBeInTheDocument();
    });
  });

  describe('FOMO Meter Project', () => {
    it('should render the FOMO Meter card', () => {
      expect(screen.getByText('The "FOMO" Meter')).toBeInTheDocument();
    });

    it('should render the Chinese subtitle', () => {
      expect(screen.getByText('错失恐惧症仪表盘')).toBeInTheDocument();
    });

    it('should render the description', () => {
      expect(screen.getByText(/A minimalist dashboard that analyzes trending tech news/i)).toBeInTheDocument();
    });

    it('should render the emoji', () => {
      const cards = screen.getAllByText('😱');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should display tech stack tags', () => {
      const nextJsTags = screen.getAllByText('Next.js');
      expect(nextJsTags.length).toBeGreaterThanOrEqual(1);
      const openAITags = screen.getAllByText('OpenAI API');
      expect(openAITags.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Yahoo Finance')).toBeInTheDocument();
    });

    it('should render example scenario', () => {
      expect(screen.getByText(/Input \$TSLA/i)).toBeInTheDocument();
    });

    it('should display Live status', () => {
      const statusBadges = screen.getAllByText('Live');
      expect(statusBadges.length).toBe(3); // One for each project
    });
  });

  describe('Stoic Mirror Project', () => {
    it('should render the Stoic Mirror card', () => {
      expect(screen.getByText('The Digital "Stoic" Mirror')).toBeInTheDocument();
    });

    it('should render the Chinese subtitle', () => {
      expect(screen.getByText('赛博斯多葛之镜')).toBeInTheDocument();
    });

    it('should render the description', () => {
      expect(screen.getByText(/An AI-driven journaling companion/i)).toBeInTheDocument();
    });

    it('should render the emoji', () => {
      expect(screen.getByText('🪞')).toBeInTheDocument();
    });

    it('should display tech stack', () => {
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
      expect(screen.getByText('Vercel AI SDK')).toBeInTheDocument();
    });

    it('should render example with Wang Yangming quote', () => {
      expect(screen.getByText(/This heart unmoved/i)).toBeInTheDocument();
    });
  });

  describe('ELI5 Generator Project', () => {
    it('should render the ELI5 Generator card', () => {
      expect(screen.getByText('"Explain Like I\'m 5" Generator')).toBeInTheDocument();
    });

    it('should render the Chinese subtitle', () => {
      expect(screen.getByText('五岁小孩解释器 - 基金版')).toBeInTheDocument();
    });

    it('should render the description', () => {
      expect(screen.getByText(/Input complex financial terms/i)).toBeInTheDocument();
    });

    it('should render the emoji', () => {
      expect(screen.getByText('🍎')).toBeInTheDocument();
    });

    it('should display tech stack', () => {
      expect(screen.getByText('Vercel/OG')).toBeInTheDocument();
      expect(screen.getByText('Image Generation')).toBeInTheDocument();
    });

    it('should render short selling example', () => {
      expect(screen.getByText(/Short Selling/i)).toBeInTheDocument();
    });
  });

  describe('Project Cards Common Features', () => {
    it('should render "Why It\'s Fun" sections', () => {
      const funSections = screen.getAllByText(/🎨 Why It's Fun/i);
      expect(funSections.length).toBe(3);
    });

    it('should render "Why It\'s Useful" sections', () => {
      const usefulSections = screen.getAllByText(/💡 Why It's Useful/i);
      expect(usefulSections.length).toBe(3);
    });

    it('should render "Example Scenario" sections', () => {
      const exampleSections = screen.getAllByText(/📖 Example Scenario/i);
      expect(exampleSections.length).toBe(3);
    });

    it('should render "Tech Stack" sections', () => {
      const techSections = screen.getAllByText(/🛠️ Tech Stack/i);
      expect(techSections.length).toBe(3);
    });

    it('should render live status badge for all projects', () => {
      const statusBadges = screen.getAllByText('Live');
      expect(statusBadges.length).toBe(3); // All projects are live
    });

    it('should render Try It Now links for live projects', () => {
      const tryNowButtons = screen.getAllByRole('link', { name: /Try It Now/i });
      expect(tryNowButtons.length).toBe(3);

      // Check that each link points to the correct lab
      const fomoLink = tryNowButtons.find(link => link.getAttribute('href') === '/labs/fomo-meter');
      const stoicLink = tryNowButtons.find(link => link.getAttribute('href') === '/labs/stoic-mirror');
      const eli5Link = tryNowButtons.find(link => link.getAttribute('href') === '/labs/eli5-generator');

      expect(fomoLink).toBeTruthy();
      expect(stoicLink).toBeTruthy();
      expect(eli5Link).toBeTruthy();
    });
  });

  describe('CTA Section', () => {
    it('should render the CTA title', () => {
      expect(screen.getByText('Have an Idea for a Lab Project?')).toBeInTheDocument();
    });

    it('should render the CTA description', () => {
      expect(screen.getByText(/We're always looking for innovative ways/i)).toBeInTheDocument();
    });

    it('should render the CTA button with correct link', () => {
      const ctaButton = screen.getByRole('link', { name: /Share Your Thoughts/i });
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton).toHaveAttribute('href', '/about#contact');
    });
  });

  describe('Anchor Links', () => {
    it('should have correct id attributes for anchor navigation', () => {
      const { container } = render(<LabsPage />);
      expect(container.querySelector('#fomo-meter')).toBeInTheDocument();
      expect(container.querySelector('#stoic-mirror')).toBeInTheDocument();
      expect(container.querySelector('#eli5-generator')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should use semantic HTML elements', () => {
      expect(screen.getByRole('main')).toBeInTheDocument();

      const articles = screen.getAllByRole('article');
      expect(articles.length).toBe(3);
    });

    it('should have proper heading hierarchy', () => {
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements.length).toBeGreaterThan(0);

      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);

      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Elements', () => {
    it('should render all project emojis', () => {
      const { container } = render(<LabsPage />);
      const emojiElements = container.querySelectorAll('[class*="cardEmoji"]');
      expect(emojiElements.length).toBe(3);
    });

    it('should render background effects container', () => {
      const { container } = render(<LabsPage />);
      const backgroundEffects = container.querySelector('[class*="backgroundEffects"]');
      expect(backgroundEffects).toBeInTheDocument();
    });
  });
});

describe('Labs Page Metadata', () => {
  it('should have correct metadata configuration', async () => {
    // Import the metadata directly
    const { metadata } = await import('@/app/labs/page');
    expect(metadata.title).toBe('Kirboreo Labs | Experimental Projects');
    expect(metadata.description).toContain('Explore our experimental AI-powered tools');
  });
});
