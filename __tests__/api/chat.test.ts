/**
 * API Route Tests: /api/chat
 * Tests the RAG-powered chat endpoint
 */

import { POST } from '@/app/api/chat/route';

// Define mock functions
const mockEmbed = jest.fn();
const mockStreamText = jest.fn();
const mockConvertToCoreMessages = jest.fn((msgs) => msgs);
const mockIndexQuery = jest.fn();

// Mock dependencies
jest.mock('@ai-sdk/openai', () => ({
  openai: {
    embedding: jest.fn(() => 'text-embedding-3-small'),
  },
}));

jest.mock('ai', () => ({
  embed: (...args: any[]) => mockEmbed(...args),
  streamText: (...args: any[]) => mockStreamText(...args),
  convertToCoreMessages: (...args: any[]) => mockConvertToCoreMessages(...args),
}));

jest.mock('@pinecone-database/pinecone', () => ({
  Pinecone: jest.fn().mockImplementation(() => ({
    index: jest.fn().mockReturnValue({
      query: (...args: any[]) => mockIndexQuery(...args),
    }),
  })),
}));

describe('Chat API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default successful mocks
    mockEmbed.mockResolvedValue({
      embedding: new Array(1536).fill(0.1),
    });

    mockStreamText.mockReturnValue({
      toTextStreamResponse: jest.fn().mockReturnValue(
        new Response('Mock response', {
          headers: { 'Content-Type': 'text/plain' },
        })
      ),
    });

    mockIndexQuery.mockResolvedValue({
      matches: [
        {
          id: '1',
          score: 0.9,
          metadata: { text: 'Relevant context' },
        },
      ],
    });
  });

  describe('POST /api/chat', () => {
    it('should return 400 for missing messages', async () => {
      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should handle valid chat request', async () => {
      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'What is the stock price of AAPL?' },
          ],
        }),
      });

      const response = await POST(request);

      expect(response).toBeInstanceOf(Response);
      expect(mockEmbed).toHaveBeenCalled();
      expect(mockIndexQuery).toHaveBeenCalled();
      expect(mockStreamText).toHaveBeenCalled();
    });

    it('should handle Pinecone errors gracefully', async () => {
      // Simulate Pinecone error
      mockIndexQuery.mockRejectedValue(new Error('Pinecone error'));

      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Test query' }],
        }),
      });

      const response = await POST(request);

      // Should still succeed despite Pinecone error
      expect(response).toBeInstanceOf(Response);
      expect(mockEmbed).toHaveBeenCalled();
      // Should still call streamText even if retrieval failed
      expect(mockStreamText).toHaveBeenCalled();
    });

    it('should handle AI generation errors', async () => {
      mockStreamText.mockImplementation(() => {
        throw new Error('AI Error');
      });

      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Test query' }],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });
  });
});
