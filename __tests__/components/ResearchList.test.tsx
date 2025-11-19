import { render } from '@testing-library/react';
import ResearchList from '@/components/ResearchList';

// Mock Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('ResearchList Component', () => {
  const mockPosts = [
    {
      _id: '1',
      title: 'AI Revolution 2024',
      slug: 'ai-revolution-2024',
      summary: 'Deep dive into AI trends',
      publishedAt: '2024-01-01',
      categories: ['AI', 'Tech'],
    },
    {
      _id: '2',
      title: 'Cloud Computing Future',
      slug: 'cloud-computing-future',
      summary: 'Analysis of cloud trends',
      publishedAt: '2024-01-02',
      categories: ['Cloud'],
    },
  ];

  it('should render list of posts', () => {
    const { container } = render(<ResearchList posts={mockPosts} />);
    // Simple render test
    expect(container.querySelector('.container')).toBeTruthy();
  });

  it('should render empty state when no posts', () => {
    const { container } = render(<ResearchList posts={[]} />);
    expect(container.querySelector('.container')).toBeTruthy();
  });
});
