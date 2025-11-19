import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                <div className={styles.grid}></div>
                <div className={styles.glow}></div>
            </div>

            <div className={`container ${styles.content}`}>
                <h1 className={styles.title}>
                    Decoding the <br />
                    <span className={styles.highlight}>Future of Tech</span>
                </h1>
                <p className={styles.subtitle}>
                    Premium equity research and data-driven analysis for the modern investor.
                    Specializing in US Tech & Global Innovation.
                </p>
                <div className={styles.actions}>
                    <button className="btn btn-primary">View Latest Reports</button>
                    <button className={styles.secondaryBtn}>Explore Analysis</button>
                </div>
            </div>
        </section>
    );
}
