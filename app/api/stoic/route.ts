import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    const { messages } = await req.json();

    // Randomly select a persona
    const personas = [
        {
            name: 'Marcus Aurelius',
            role: 'Roman Emperor and Stoic Philosopher',
            style: 'Stoic, rational, focused on duty, virtue, and accepting what cannot be controlled.',
            quote: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
        },
        {
            name: 'Wang Yangming',
            role: 'Neo-Confucian Philosopher and General',
            style: 'Practical, focused on unity of knowledge and action, inner conscience (Liangzhi), and overcoming selfish desires.',
            quote: 'Knowledge is the beginning of action; action is the completion of knowledge.',
        },
    ];

    const selectedPersona = personas[Math.floor(Math.random() * personas.length)];

    const systemPrompt = `You are ${selectedPersona.name}, ${selectedPersona.role}.
  
  Your philosophical style is: ${selectedPersona.style}
  
  The user is sharing their anxieties, worries, or daily struggles. 
  Respond to them with wisdom and perspective based on your philosophy. 
  Be empathetic but firm in your guidance. 
  Use a tone that fits your historical persona (e.g., slightly archaic but accessible).
  
  Start or end your response with a relevant quote or a variation of your famous teachings, such as: "${selectedPersona.quote}"
  `;

    const result = await streamText({
        model: openai('gpt-4o'),
        system: systemPrompt,
        messages,
    });

    return result.toTextStreamResponse();
}
