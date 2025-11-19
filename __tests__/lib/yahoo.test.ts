import { getStockChart } from '@/lib/yahoo';

const mockChart = jest.fn();
const mockHistorical = jest.fn();

jest.mock('yahoo-finance2', () => {
  return jest.fn().mockImplementation(() => ({
    chart: (...args: any[]) => mockChart(...args),
    historical: (...args: any[]) => mockHistorical(...args),
  }));
});

describe('Yahoo Finance Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStockChart', () => {
    it('should fetch 1-day intraday data', async () => {
      const mockData = {
        quotes: [
          { date: new Date('2024-01-01T10:00:00'), close: 150.5 },
          { date: new Date('2024-01-01T10:15:00'), close: 151.2 },
        ],
      };

      mockChart.mockResolvedValue(mockData);

      const result = await getStockChart('AAPL', '1d');

      expect(mockChart).toHaveBeenCalledWith(
        'AAPL',
        expect.objectContaining({
          interval: '15m',
        })
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('close');
    });

    it('should fetch 1-year historical data', async () => {
      const mockData = [
        { date: new Date('2023-01-01'), close: 140.0 },
        { date: new Date('2023-01-02'), close: 141.0 },
      ];

      mockHistorical.mockResolvedValue(mockData);

      const result = await getStockChart('TSLA', '1y');

      expect(mockHistorical).toHaveBeenCalledWith(
        'TSLA',
        expect.objectContaining({
          interval: '1d',
        })
      );

      expect(result).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      mockChart.mockRejectedValue(new Error('API Error'));

      const result = await getStockChart('INVALID', '1d');
      expect(result).toEqual([]);
    });
  });
});
