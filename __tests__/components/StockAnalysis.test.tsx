import { render, screen, fireEvent } from '@testing-library/react';
import StockAnalysis from '@/components/StockAnalysis';

// Mock Recharts to avoid canvas dependency
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  AreaChart: ({ children }: any) => <div>{children}</div>,
  Area: () => <div>Area</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
}));

// Mock actions
jest.mock('@/app/actions/stock', () => ({
  fetchStockChart: jest.fn().mockResolvedValue([
    { date: '2024-01-01', close: 150 },
    { date: '2024-01-02', close: 155 },
  ]),
}));

describe('StockAnalysis Component', () => {
  const mockStockData = {
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    currentPrice: 150.0,
    priceChangePercentage: 2.5,
    kirboreoScore: 85,
    scoreLabel: 'Buy',
    metrics: {
      growth: 80,
      value: 70,
      momentum: 90,
    },
    priceHistory: [
      { date: '2024-01-01', close: 140 },
      { date: '2024-01-02', close: 150 },
    ],
  };

  const mockRelatedPosts = [
    {
      _id: '1',
      title: 'Apple Analysis',
      slug: 'apple-analysis',
      summary: 'Deep dive into AAPL',
      publishedAt: '2024-01-01',
      categories: ['Tech'],
    },
  ];

  it('should render stock information correctly', () => {
    render(<StockAnalysis stockData={mockStockData} relatedPosts={mockRelatedPosts} />);
    
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    // Price is split into separate elements with $
    expect(screen.getByText((content, element) => {
      return element?.textContent === '$150.00' || content === '150.00';
    })).toBeInTheDocument();
  });

  it('should render Kirboreo score', () => {
    render(<StockAnalysis stockData={mockStockData} relatedPosts={mockRelatedPosts} />);
    
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Buy')).toBeInTheDocument();
  });

  it('should render metrics', () => {
    render(<StockAnalysis stockData={mockStockData} relatedPosts={mockRelatedPosts} />);
    
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Momentum')).toBeInTheDocument();
  });

  it('should render related posts', () => {
    render(<StockAnalysis stockData={mockStockData} relatedPosts={mockRelatedPosts} />);
    
    expect(screen.getByText('Apple Analysis')).toBeInTheDocument();
    expect(screen.getByText('Deep dive into AAPL')).toBeInTheDocument();
  });

  it('should handle time range changes', () => {
    render(<StockAnalysis stockData={mockStockData} relatedPosts={mockRelatedPosts} />);
    
    const rangeButtons = screen.getAllByRole('button');
    const oneDayButton = rangeButtons.find(btn => btn.textContent === '1d');
    
    if (oneDayButton) {
      fireEvent.click(oneDayButton);
      // Expect loading state or update
    }
  });
});

