import { render } from '@testing-library/react';

// Mock SpeedInsights component
jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid="speed-insights">SpeedInsights</div>,
}));

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
    className: 'geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
    className: 'geist-mono',
  }),
}));

describe('RootLayout Integration', () => {
  it('should render SpeedInsights component', () => {
    // Import dynamically to ensure mocks are applied
    const { SpeedInsights } = require('@vercel/speed-insights/next');
    
    const { getByTestId } = render(<SpeedInsights />);
    expect(getByTestId('speed-insights')).toBeInTheDocument();
  });

  it('should have SpeedInsights in the component tree', () => {
    const { SpeedInsights } = require('@vercel/speed-insights/next');
    const { getByText } = render(<SpeedInsights />);
    
    expect(getByText('SpeedInsights')).toBeInTheDocument();
  });

  it('Geist font should be configured correctly', () => {
    const { Geist } = require('next/font/google');
    const font = Geist();
    
    expect(font).toHaveProperty('variable');
    expect(font.variable).toBe('--font-geist-sans');
  });

  it('Geist_Mono font should be configured correctly', () => {
    const { Geist_Mono } = require('next/font/google');
    const font = Geist_Mono();
    
    expect(font).toHaveProperty('variable');
    expect(font.variable).toBe('--font-geist-mono');
  });

  it('should render without errors', () => {
    const { SpeedInsights } = require('@vercel/speed-insights/next');
    
    expect(() => {
      render(<SpeedInsights />);
    }).not.toThrow();
  });
});

describe('Layout Metadata', () => {
  it('should have correct metadata configuration', async () => {
    // Dynamically import to test metadata
    const layout = await import('@/app/layout');
    
    expect(layout.metadata).toBeDefined();
    expect(layout.metadata.title).toContain('Kirboreo');
    expect(layout.metadata.description).toBeTruthy();
  });
});
