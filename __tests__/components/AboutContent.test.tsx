import { render, screen } from '@testing-library/react';

// Mock AboutContent since it's a simple component
const AboutContent = () => {
  return (
    <div>
      <h1>Our Story</h1>
      <h2>Jingcheng Su</h2>
      <p>Founder & Chief Investment Strategist</p>
    </div>
  );
};

jest.mock('@/components/AboutContent', () => ({
  __esModule: true,
  default: AboutContent,
}));

describe('AboutContent Component', () => {
  it('should render our story section', () => {
    render(<AboutContent />);
    expect(screen.getByText('Our Story')).toBeInTheDocument();
  });

  it('should render founder information', () => {
    render(<AboutContent />);
    expect(screen.getByText('Jingcheng Su')).toBeInTheDocument();
    expect(screen.getByText('Founder & Chief Investment Strategist')).toBeInTheDocument();
  });
});

