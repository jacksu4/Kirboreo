import * as dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import { Pinecone } from '@pinecone-database/pinecone';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'knowledge');

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-19',
    useCdn: false, // We want fresh data
    token: process.env.SANITY_API_TOKEN, // Optional if dataset is public, but good to have if needed
});

async function getPosts() {
    return client.fetch(`*[_type == "post"]{
    _id,
    title,
    "summary": summary,
    "body": body
  }`);
}

// Helper to convert Portable Text blocks to plain text
function blocksToText(blocks: any[] = []) {
    if (!blocks || !Array.isArray(blocks)) {
        return '';
    }
    return blocks
        .map((block) => {
            if (block._type !== 'block' || !block.children) {
                return '';
            }
            return block.children.map((child: any) => child.text).join('');
        })
        .join('\n\n');
}

async function main() {
    console.log('Fetching posts from Sanity...');
    const posts = await getPosts();
    console.log(`Found ${posts.length} posts.`);

    for (const post of posts) {
        console.log(`Processing: ${post.title}`);

        const bodyText = blocksToText(post.body);
        const combinedText = `Title: ${post.title}\n\nSummary: ${post.summary || ''}\n\nContent:\n${bodyText}`;

        // Generate embedding
        const { embedding } = await embed({
            model: openai.embedding('text-embedding-3-small'),
            value: combinedText,
        });

        // Upsert to Pinecone
        await index.upsert([
            {
                id: post._id,
                values: embedding,
                metadata: {
                    title: post.title,
                    text: combinedText,
                },
            },
        ]);
        console.log(`Indexed: ${post.title}`);
    }

    console.log('Done indexing!');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
