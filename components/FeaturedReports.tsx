import styles from './FeaturedReports.module.css';
import { client } from '@/sanity/lib/client';
import { HOME_LATEST_POSTS_QUERY } from '@/sanity/lib/queries';
import Link from 'next/link';

// Helper to format date
function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

export default async function FeaturedReports() {
    const posts = await client.fetch(HOME_LATEST_POSTS_QUERY);

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>Latest Research</h2>
                <div className={styles.grid}>
                    {posts.map((post: any) => (
                        <div key={post._id} className={`glass-panel ${styles.card}`}>
                            <div className={styles.tag}>
                                {post.categories?.[0] || 'Research'}
                            </div>
                            <h3 className={styles.title}>{post.title}</h3>
                            <p className={styles.summary}>{post.summary}</p>
                            <div className={styles.footer}>
                                <span className={styles.date}>
                                    {post.publishedAt ? formatDate(post.publishedAt) : 'Date N/A'}
                                </span>
                                <Link href={`/research/${post.slug}`} className={styles.readMore}>
                                    Read Report →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
