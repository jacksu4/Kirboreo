import { PortableText } from '@portabletext/react';
import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import Navbar from '@/components/Navbar';
import styles from './Post.module.css';

interface PostProps {
    params: Promise<{ slug: string }>;
}

const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0] {
  title,
  publishedAt,
  "author": author->name,
  "categories": categories[]->title,
  body,
  summary
}`;

export const revalidate = 60;

export default async function Post({ params }: PostProps) {
    const { slug } = await params;
    const post = await client.fetch(POST_QUERY, { slug });

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <main>
            <Navbar />
            <article className={styles.article}>
                <div className="container">
                    <header className={styles.header}>
                        <div className={styles.meta}>
                            <span className={styles.date}>{new Date(post.publishedAt).toLocaleDateString()}</span>
                            {post.author && <span className={styles.author}>by {post.author}</span>}
                            <div className={styles.categories}>
                                {post.categories?.map((cat: string) => (
                                    <span key={cat} className={styles.category}>{cat}</span>
                                ))}
                            </div>
                        </div>
                        <h1 className={styles.title}>{post.title}</h1>
                        {post.summary && <p className={styles.summary}>{post.summary}</p>}
                    </header>

                    <div className={styles.content}>
                        <PortableText value={post.body} />
                    </div>
                </div>
            </article>
        </main>
    );
}
