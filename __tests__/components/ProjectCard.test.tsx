import { render, screen } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';

const mockProject = {
  id: 'test-project',
  icon: '🧪',
  title: 'Test Project',
  subtitle: '测试项目',
  description: 'This is a test project description.',
  features: [
    'Feature 1: First amazing feature',
    'Feature 2: Second incredible feature',
    'Feature 3: Third wonderful feature',
  ],
  techStack: ['Next.js', 'React', 'TypeScript'],
  example: {
    input: 'Test input',
    output: 'Test output result',
  },
  status: 'coming-soon' as const,
};

describe('ProjectCard', () => {
  it('should render project title and subtitle', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('测试项目')).toBeInTheDocument();
  });

  it('should render project icon', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByText('🧪')).toBeInTheDocument();
  });

  it('should render project description', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByText('This is a test project description.')).toBeInTheDocument();
  });

  it('should render all features', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByText(/Feature 1: First amazing feature/)).toBeInTheDocument();
    expect(screen.getByText(/Feature 2: Second incredible feature/)).toBeInTheDocument();
    expect(screen.getByText(/Feature 3: Third wonderful feature/)).toBeInTheDocument();
  });

  it('should render tech stack badges', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should render example input and output', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByText('Test input')).toBeInTheDocument();
    expect(screen.getByText('Test output result')).toBeInTheDocument();
  });

  it('should render "Coming Soon" badge for coming-soon status', () => {
    render(<ProjectCard {...mockProject} status="coming-soon" />);
    
    const badges = screen.getAllByText(/Coming Soon/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should render "Beta" badge for beta status', () => {
    render(<ProjectCard {...mockProject} status="beta" />);
    
    expect(screen.getByText(/Beta/i)).toBeInTheDocument();
  });

  it('should render "Live" badge for live status', () => {
    render(<ProjectCard {...mockProject} status="live" />);
    
    expect(screen.getByText(/Live/i)).toBeInTheDocument();
  });

  it('should disable launch button for coming-soon status', () => {
    render(<ProjectCard {...mockProject} status="coming-soon" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/Coming Soon/i);
  });

  it('should enable launch button for live status', () => {
    render(<ProjectCard {...mockProject} status="live" />);
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent(/Launch Project/i);
  });

  it('should enable launch button for beta status', () => {
    render(<ProjectCard {...mockProject} status="beta" />);
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent(/Launch Project/i);
  });

  it('should have correct id attribute for scroll anchoring', () => {
    const { container } = render(<ProjectCard {...mockProject} />);
    
    const card = container.querySelector('#test-project');
    expect(card).toBeInTheDocument();
  });

  it('should render section headers', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByText(/Key Features/i)).toBeInTheDocument();
    expect(screen.getByText(/Tech Stack/i)).toBeInTheDocument();
    expect(screen.getByText(/Example/i)).toBeInTheDocument();
  });

  it('should render input and output labels in example section', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByText('Input:')).toBeInTheDocument();
    expect(screen.getByText('Output:')).toBeInTheDocument();
  });

  it('should handle multiple tech stack items', () => {
    const projectWithManyTechStack = {
      ...mockProject,
      techStack: ['Next.js', 'React', 'TypeScript', 'Vercel', 'OpenAI', 'Tailwind CSS'],
    };
    
    render(<ProjectCard {...projectWithManyTechStack} />);
    
    projectWithManyTechStack.techStack.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  it('should handle long descriptions', () => {
    const projectWithLongDescription = {
      ...mockProject,
      description: 'This is a very long description that contains multiple sentences. It should be rendered properly without any issues. The component should handle long text gracefully.',
    };
    
    render(<ProjectCard {...projectWithLongDescription} />);
    
    expect(screen.getByText(projectWithLongDescription.description)).toBeInTheDocument();
  });

  it('should render multiline example output', () => {
    const projectWithMultilineOutput = {
      ...mockProject,
      example: {
        input: 'Test',
        output: 'Line 1\nLine 2\nLine 3',
      },
    };
    
    const { container } = render(<ProjectCard {...projectWithMultilineOutput} />);
    
    const outputElement = container.querySelector('.exampleOutputContent');
    expect(outputElement).toBeInTheDocument();
    expect(outputElement?.textContent).toContain('Line 1');
    expect(outputElement?.textContent).toContain('Line 2');
    expect(outputElement?.textContent).toContain('Line 3');
  });
});

