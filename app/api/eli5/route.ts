import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 60;

const MAX_INPUT_LENGTH = 2000;

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        // Validation
        if (!text || typeof text !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Text input is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (text.length > MAX_INPUT_LENGTH) {
            return new Response(
                JSON.stringify({
                    error: `Text is too long. Maximum ${MAX_INPUT_LENGTH} characters allowed.`
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const systemPrompt = `You are an expert at explaining complex topics to 5-year-olds using only emojis and simple words.

Rules:
1. Use LOTS of emojis (🍎📱💰🏠🚗) to make it fun and visual
2. Use only simple words a 5-year-old would understand
3. Break complex ideas into tiny, digestible steps
4. Use analogies with everyday things (toys, food, games, family)
5. Make it a story or narrative when possible
6. Keep sentences short and punchy (max 15 words per sentence)
7. Add "But if..." scenarios to show edge cases or risks
8. Use "Imagine..." to help visualize concepts
9. End with a simple summary using the 🎯 emoji

Format your response as a flowing narrative explanation, not bullet points. Make it engaging and fun to read!

Example style:
"Imagine you have 10 cookies 🍪. Your friend wants to borrow 5 cookies and promises to give you back 6 cookies tomorrow. That's like lending! 💰 You give something now, and get back MORE later. But if your friend eats all the cookies and can't give them back, you lose your cookies! 😢 That's the risk of lending."`;

        const result = await streamText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: `Explain this like I'm 5 years old: ${text}`,
                },
            ],
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('ELI5 API Error:', error);
        return new Response(
            JSON.stringify({
                error: 'Failed to generate explanation. Please try again.'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
