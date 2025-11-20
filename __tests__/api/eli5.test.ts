import { POST } from '@/app/api/eli5/route';

// Mock the AI SDK
jest.mock('@ai-sdk/openai', () => ({
    openai: jest.fn(() => 'mock-model'),
}));

jest.mock('ai', () => ({
    streamText: jest.fn(),
}));

describe('/api/eli5', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if text is missing', async () => {
        const request = new Request('http://localhost:3000/api/eli5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        });

        const response = await POST(request);
        expect(response.status).toBe(400);

        const data = await response.json();
        expect(data.error).toBe('Text input is required');
    });

    it('should return 400 if text is not a string', async () => {
        const request = new Request('http://localhost:3000/api/eli5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 123 }),
        });

        const response = await POST(request);
        expect(response.status).toBe(400);

        const data = await response.json();
        expect(data.error).toBe('Text input is required');
    });

    it('should return 400 if text exceeds maximum length', async () => {
        const longText = 'a'.repeat(2001);
        const request = new Request('http://localhost:3000/api/eli5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: longText }),
        });

        const response = await POST(request);
        expect(response.status).toBe(400);

        const data = await response.json();
        expect(data.error).toContain('too long');
    });

    it('should call streamText with correct parameters for valid input', async () => {
        const { streamText } = require('ai');

        // Mock streamText to return a mock response
        const mockToTextStreamResponse = jest.fn(() => new Response('mock stream'));
        streamText.mockResolvedValue({
            toTextStreamResponse: mockToTextStreamResponse,
        });

        const request = new Request('http://localhost:3000/api/eli5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Explain quantum computing' }),
        });

        const response = await POST(request);

        expect(streamText).toHaveBeenCalledWith(
            expect.objectContaining({
                model: 'mock-model',
                system: expect.stringContaining('5-year-olds'),
                messages: expect.arrayContaining([
                    expect.objectContaining({
                        role: 'user',
                        content: expect.stringContaining('Explain quantum computing'),
                    }),
                ]),
            })
        );

        expect(mockToTextStreamResponse).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
        const { streamText } = require('ai');
        streamText.mockRejectedValue(new Error('OpenAI API error'));

        const request = new Request('http://localhost:3000/api/eli5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Test input' }),
        });

        const response = await POST(request);
        expect(response.status).toBe(500);

        const data = await response.json();
        expect(data.error).toBe('Failed to generate explanation. Please try again.');
    });
});
