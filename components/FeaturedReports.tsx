import styles from './FeaturedReports.module.css';

const reports = [
    {
        id: 1,
        title: "AI Hardware: Beyond Nvidia",
        summary: "Analyzing the emerging players in the custom ASIC market.",
        date: "Nov 18, 2025",
        tag: "Hardware"
    },
    {
        id: 2,
        title: "SaaS Valuation Reset",
        summary: "Why the rule of 40 is evolving in a high-interest rate environment.",
        date: "Nov 15, 2025",
        tag: "SaaS"
    },
    {
        id: 3,
        title: "The Future of Cybersecurity",
        summary: "Zero trust architecture and the new leaders in network security.",
        date: "Nov 10, 2025",
        tag: "Security"
    }
];

export default function FeaturedReports() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>Latest Research</h2>
                <div className={styles.grid}>
                    {reports.map((report) => (
                        <div key={report.id} className={`glass-panel ${styles.card}`}>
                            <div className={styles.tag}>{report.tag}</div>
                            <h3 className={styles.title}>{report.title}</h3>
                            <p className={styles.summary}>{report.summary}</p>
                            <div className={styles.footer}>
                                <span className={styles.date}>{report.date}</span>
                                <button className={styles.readMore}>Read Report →</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
