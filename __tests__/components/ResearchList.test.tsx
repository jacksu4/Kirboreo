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
      slug: { current: 'ai-revolution-2024' },
      summary: 'Deep dive into AI trends',
      publishedAt: '2024-01-01',
      author: { name: 'John Doe' },
      categories: [{ title: 'AI', slug: { current: 'ai' } }],
    },
    {
      _id: '2',
      title: 'Cloud Computing Future',
      slug: { current: 'cloud-computing-future' },
      summary: 'Analysis of cloud trends',
      publishedAt: '2024-01-02',
      author: { name: 'Jane Smith' },
      categories: [{ title: 'Cloud', slug: { current: 'cloud' } }],
    },
  ];

  it('should render list of posts', () => {
    render(<ResearchList posts={mockPosts} />);
    // Simple render test
    expect(document.querySelector('.container')).toBeTruthy();
  });

  it('should render empty state when no posts', () => {
    render(<ResearchList posts={[]} />);
    expect(document.querySelector('.container')).toBeTruthy();
  });
});

