import styles from './AboutContent.module.css';

export default function AboutContent() {
    return (
        <div className={styles.container}>
            <section className={styles.storySection}>
                <h1 className={styles.heading}>Our Story</h1>
                <div className={styles.content}>
                    <p>
                        Kirboreo Limited is a Hong Kong-based investment research firm dedicated to decoding the complex world of global technology equities.
                        Founded with a vision to bridge the gap between institutional-grade analysis and accessible insights, we focus on the US tech sector
                        and emerging global innovations.
                    </p>
                    <p>
                        Our name, <strong>Kirboreo</strong>, reflects our philosophy: a blend of approachability and substance.
                        Inspired by the resilience and adaptability of "Kirby" and the classic, multi-layered delight of an "Oreo",
                        we aim to make serious financial research digestible, engaging, and surprisingly delightful.
                    </p>
                </div>
            </section>

            <section className={styles.contactSection}>
                <div className={`glass-panel ${styles.contactCard}`}>
                    <h2 className={styles.subheading}>Get in Touch</h2>
                    <form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" className={styles.input} placeholder="Your name" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" className={styles.input} placeholder="your@email.com" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="message">Message</label>
                            <textarea id="message" className={styles.textarea} placeholder="How can we help?" rows={4}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Send Message</button>
                    </form>
                </div>

                <div className={styles.info}>
                    <h3 className={styles.infoTitle}>Headquarters</h3>
                    <p>Kirboreo Limited</p>
                    <p>Central, Hong Kong</p>
                    <p className={styles.email}>contact@kirboreo.com</p>
                </div>
            </section>
        </div>
    );
}
