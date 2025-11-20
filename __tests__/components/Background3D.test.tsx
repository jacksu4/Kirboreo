import { render } from '@testing-library/react';
import Background3D from '@/components/Background3D';

// Comprehensive Three.js mocks
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    viewport: { width: 100, height: 100 },
  })),
}));

jest.mock('@react-three/drei', () => ({
  Float: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="float">{children}</div>
  ),
  Stars: () => <div data-testid="stars" />,
  Points: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="points">{children}</div>
  ),
  PointMaterial: () => <div data-testid="point-material" />,
}));

// Mock THREE to prevent errors
jest.mock('three', () => ({
  AdditiveBlending: 2,
  Points: jest.fn(),
  Float32Array: global.Float32Array,
  Group: jest.fn(),
  Mesh: jest.fn(),
}));

describe('Background3D Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<Background3D />);
    // Just verify component renders - testing 3D canvas in JSDOM is not practical
    expect(container.querySelector('[data-testid="canvas"]')).toBeTruthy();
  });

  it('should have correct background styling', () => {
    const { container } = render(<Background3D />);
    const bgDiv = container.firstChild as HTMLElement;
    expect(bgDiv).toHaveClass('fixed');
    expect(bgDiv).toHaveClass('inset-0');
  });

  it('should render Stars component', () => {
    const { container } = render(<Background3D />);
    expect(container.querySelector('[data-testid="stars"]')).toBeTruthy();
  });
});

