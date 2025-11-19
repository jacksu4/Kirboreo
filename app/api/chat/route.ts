import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';
import { embed } from 'ai';

export const maxDuration = 60;

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'knowledge');

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // 1. Embed the user's query
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: lastMessage.content,
  });

  // 2. Retrieve relevant context from Pinecone
  const results = await index.query({
    vector: embedding,
    topK: 3,
    includeMetadata: true,
  });

  const context = results.matches.map((match) => match.metadata?.text as string).filter(Boolean);
  const contextString = context.join('\n\n---\n\n');

  // 3. Construct System Prompt
  const systemPrompt = `You are Kirboreo AI, a helpful assistant for the Kirboreo website.
  
  Answer the user's question using ONLY the following context. If the answer is not in the context, politely say you don't know.
  
  Context:
  ${contextString}
  `;

  // 4. Generate Response
  const result = await streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  return result.toTextStreamResponse();
}
