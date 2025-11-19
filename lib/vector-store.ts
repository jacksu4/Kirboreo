import { Pinecone } from '@pinecone-database/pinecone';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'knowledge');

export async function embedDocument(text: string) {
    const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: text,
    });
    return embedding;
}

export async function queryVectorStore(query: string) {
    const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: query,
    });

    const results = await index.query({
        vector: embedding,
        topK: 3,
        includeMetadata: true,
    });

    return results.matches.map((match) => match.metadata?.text as string).filter(Boolean);
}
