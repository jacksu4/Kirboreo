import { fetchStockChart } from '@/lib/yahoo';

// Mock yahoo-finance2
jest.mock('yahoo-finance2', () => ({
  chart: jest.fn(),
}));

import yahooFinance from 'yahoo-finance2';

describe('Yahoo Finance Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchStockChart', () => {
    it('should fetch 1-day intraday data with correct interval', async () => {
      const mockData = {
        quotes: [
          { date: new Date('2024-01-01T10:00:00'), close: 150.5 },
          { date: new Date('2024-01-01T10:15:00'), close: 151.2 },
        ],
      };

      (yahooFinance.chart as jest.Mock).mockResolvedValue(mockData);

      const result = await fetchStockChart('AAPL', '1d');

      expect(yahooFinance.chart).toHaveBeenCalledWith(
        'AAPL',
        expect.objectContaining({
          period1: expect.any(Date),
          interval: '15m',
        })
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('close');
    });

    it('should fetch 1-year daily data', async () => {
      const mockData = {
        quotes: [
          { date: new Date('2023-01-01'), close: 140.0 },
          { date: new Date('2023-01-02'), close: 141.0 },
        ],
      };

      (yahooFinance.chart as jest.Mock).mockResolvedValue(mockData);

      const result = await fetchStockChart('TSLA', '1y');

      expect(yahooFinance.chart).toHaveBeenCalledWith(
        'TSLA',
        expect.objectContaining({
          interval: '1d',
        })
      );

      expect(result).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      (yahooFinance.chart as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      await expect(fetchStockChart('INVALID', '1d')).rejects.toThrow();
    });

    it('should return empty array for invalid tickers', async () => {
      (yahooFinance.chart as jest.Mock).mockResolvedValue({ quotes: [] });

      const result = await fetchStockChart('INVALID', '1d');

      expect(result).toEqual([]);
    });
  });
});

