import { render } from '@testing-library/react';
import Background3D from '@/components/Background3D';

// Mock Three.js related components - just render divs
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    viewport: { width: 100, height: 100 },
  })),
}));

jest.mock('@react-three/drei', () => ({
  Float: ({ children }: { children: React.ReactNode }) => <div data-testid="float">{children}</div>,
  Stars: () => <div data-testid="stars">Stars</div>,
}));

jest.mock('three', () => {
  const actual = jest.requireActual('three');
  return {
    ...actual,
    Mesh: jest.fn(),
    SphereGeometry: jest.fn(),
    PointsMaterial: jest.fn(),
    Points: jest.fn(),
  };
});

describe('Background3D Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<Background3D />);
    // Just verify component renders
    expect(container).toBeTruthy();
  });
});
