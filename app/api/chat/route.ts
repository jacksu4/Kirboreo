import { openai } from '@ai-sdk/openai';
import { streamText, embed } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';

export const runtime = 'edge';
export const maxDuration = 60;

/**
 * Kirboreo AI Chat API Route
 * 
 * Environment Variables Required:
 * - OPENAI_API_KEY: Your OpenAI API key
 * - PINECONE_API_KEY: Your Pinecone API key
 * - PINECONE_INDEX_NAME: Pinecone index name (default: 'knowledge')
 * 
 * RAG Flow:
 * 1. Receive user messages
 * 2. Generate embedding using OpenAI text-embedding-3-small
 * 3. Query Pinecone vector store for relevant context (topK: 3)
 * 4. Construct system prompt with retrieved context
 * 5. Stream response using OpenAI gpt-4o
 */

export async function POST(req: Request) {
  try {
    // Validate environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY');
      return new Response('OpenAI API key not configured', { status: 500 });
    }

    // Parse request body
    const body = await req.json();
    console.log('Received body:', JSON.stringify(body, null, 2));
    
    const { messages } = body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('Invalid messages format:', messages);
      return new Response('Invalid messages format', { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage || !lastMessage.content) {
      console.error('Message content missing:', lastMessage);
      return new Response('Message content is required', { status: 400 });
    }

    console.log('Processing message:', lastMessage.content);
    console.log('Total messages in conversation:', messages.length);

    let contextString = '';

    // Try to retrieve context from Pinecone (optional - graceful fallback)
    try {
      if (process.env.PINECONE_API_KEY) {
        const pinecone = new Pinecone({
          apiKey: process.env.PINECONE_API_KEY,
        });

        const indexName = process.env.PINECONE_INDEX_NAME || 'knowledge';
        const index = pinecone.index(indexName);

        // Generate embedding for the query
        const { embedding } = await embed({
          model: openai.embedding('text-embedding-3-small'),
          value: lastMessage.content,
        });

        console.log('Generated embedding, querying Pinecone...');

        // Query Pinecone for relevant context
        const results = await index.query({
          vector: embedding,
          topK: 3,
          includeMetadata: true,
        });

        console.log(`Found ${results.matches?.length || 0} matches from Pinecone`);

        // Extract context from matches
        const context = (results.matches || [])
          .map((match) => match.metadata?.text as string)
          .filter(Boolean);

        if (context.length > 0) {
          contextString = context.join('\n\n---\n\n');
          console.log('Context retrieved successfully');
        } else {
          console.log('No relevant context found in Pinecone');
        }
      } else {
        console.log('Pinecone API key not configured, skipping RAG');
      }
    } catch (pineconeError) {
      console.error('Pinecone retrieval failed (continuing without context):', pineconeError);
      // Continue without context - graceful degradation
    }

    // Construct system prompt
    const systemPrompt = contextString
      ? `You are Kirboreo AI, a helpful assistant for Kirboreo - a global equity research firm focused on US Tech and emerging innovations.

Use the following context from our research database to answer the user's question:

${contextString}

If the answer is in the context, provide a detailed response based on it. If not, use your general knowledge about technology, finance, and investment, but mention that you don't have specific information from Kirboreo's research on this topic.`
      : `You are Kirboreo AI, a helpful assistant for Kirboreo - a global equity research firm focused on US Tech and emerging innovations.

Answer the user's questions about technology, finance, investment strategies, and market analysis to the best of your ability. Be professional, insightful, and helpful.`;

    console.log('Generating response with GPT-4o...');

    // Format messages for AI SDK
    // The messages should have: role, content (and optionally id, createdAt, etc.)
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    console.log('Formatted messages:', JSON.stringify(formattedMessages, null, 2));

    // Generate streaming response
    const result = await streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: formattedMessages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return a proper error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: errorMessage 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
