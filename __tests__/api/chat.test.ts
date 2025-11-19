/**
 * API Route Tests: /api/chat
 * Tests the RAG-powered chat endpoint input validation
 */

import { POST } from '@/app/api/chat/route';

describe('Chat API Route', () => {
  describe('Input Validation', () => {
    it('should return 400 for missing messages', async () => {
      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toContain('Invalid messages format');
    });

    it('should return 400 for empty messages array', async () => {
      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should return 400 for non-array messages', async () => {
      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: 'not an array',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
