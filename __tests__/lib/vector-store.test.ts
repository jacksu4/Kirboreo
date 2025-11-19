import { embedDocument, queryVectorStore } from '@/lib/vector-store';

const mockEmbed = jest.fn();

// Mock dependencies
jest.mock('ai', () => ({
  embed: (...args: any[]) => mockEmbed(...args),
}));

jest.mock('@ai-sdk/openai', () => ({
  openai: {
    embedding: jest.fn(),
  },
}));

const mockIndexQuery = jest.fn();

jest.mock('@pinecone-database/pinecone', () => ({
  Pinecone: jest.fn().mockImplementation(() => ({
    index: jest.fn().mockReturnValue({
      query: (...args: any[]) => mockIndexQuery(...args),
    }),
  })),
}));

describe('Vector Store Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('embedDocument', () => {
    it('should embed text successfully', async () => {
      mockEmbed.mockResolvedValue({ embedding: [0.1, 0.2, 0.3] });
      
      const result = await embedDocument('test document');
      
      expect(result).toEqual([0.1, 0.2, 0.3]);
      expect(mockEmbed).toHaveBeenCalled();
    });

    it('should handle embedding errors', async () => {
      mockEmbed.mockRejectedValue(new Error('Embed error'));
      
      await expect(embedDocument('test')).rejects.toThrow('Embed error');
    });
  });

  describe('queryVectorStore', () => {
    it('should query vector store successfully', async () => {
      mockEmbed.mockResolvedValue({ embedding: [0.1, 0.2] });
      mockIndexQuery.mockResolvedValue({
        matches: [
          { id: '1', score: 0.9, metadata: { text: 'Result 1' } },
          { id: '2', score: 0.8, metadata: { text: 'Result 2' } },
        ],
      });
      
      const result = await queryVectorStore('test query');
      
      expect(result).toEqual(['Result 1', 'Result 2']);
      expect(mockEmbed).toHaveBeenCalled();
      expect(mockIndexQuery).toHaveBeenCalled();
    });

    it('should filter out empty results', async () => {
      mockEmbed.mockResolvedValue({ embedding: [0.1, 0.2] });
      mockIndexQuery.mockResolvedValue({
        matches: [
          { id: '1', score: 0.9, metadata: { text: 'Result 1' } },
          { id: '2', score: 0.8, metadata: {} },
          { id: '3', score: 0.7, metadata: { text: null } },
        ],
      });
      
      const result = await queryVectorStore('test query');
      
      expect(result).toEqual(['Result 1']);
    });
  });
});
