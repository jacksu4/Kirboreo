// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.PINECONE_API_KEY = 'test-pinecone-key'
process.env.PINECONE_INDEX_NAME = 'test-knowledge'
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test'

