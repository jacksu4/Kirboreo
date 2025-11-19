'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './ResearchList.module.css';

interface Post {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    publishedAt: string;
    categories: string[];
}

interface ResearchListProps {
    posts: Post[];
}

export default function ResearchList({ posts }: ResearchListProps) {
    const [activeTag, setActiveTag] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Extract unique categories from posts for tags
    const allTags = posts.flatMap(post => post.categories || []);
    const uniqueTags = ["All", ...Array.from(new Set(allTags))];

    const filteredReports = posts.filter(report => {
        const matchesTag = activeTag === "All" || (report.categories && report.categories.includes(activeTag));
        const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (report.summary && report.summary.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTag && matchesSearch;
    });

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div className={styles.tabs}>
                    {uniqueTags.map(tag => (
                        <button
                            key={tag}
                            className={`${styles.tab} ${activeTag === tag ? styles.activeTab : ''}`}
                            onClick={() => setActiveTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Search reports..."
                    className={styles.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className={styles.grid}>
                {filteredReports.map((report) => (
                    <div key={report._id} className={`glass-panel ${styles.card}`}>
                        <div className={styles.cardHeader}>
                            <div className={styles.tags}>
                                {report.categories?.map(cat => (
                                    <span key={cat} className={styles.tag}>{cat}</span>
                                ))}
                            </div>
                        </div>
                        <h3 className={styles.title}>{report.title}</h3>
                        <p className={styles.summary}>{report.summary}</p>
                        <div className={styles.footer}>
                            <span className={styles.date}>{new Date(report.publishedAt).toLocaleDateString()}</span>
                            <Link href={`/research/${report.slug}`} className={styles.readBtn}>Read Analysis</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
