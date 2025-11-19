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

            <section className={styles.founderSection}>
                <div className={styles.founderCard}>
                    <div className={styles.founderHeader}>
                        <div className={styles.founderAvatar}>
                            <span>JS</span>
                        </div>
                        <div className={styles.founderTitle}>
                            <h2>Jingcheng Su</h2>
                            <p className={styles.role}>Founder & Chief Investment Strategist</p>
                            <p className={styles.credentials}>MS Computer Science (Rice)</p>
                        </div>
                    </div>
                    
                    <div className={styles.founderBio}>
                        <p className={styles.tagline}>
                            <strong>Where Silicon Valley Engineering Meets Wall Street Rigor</strong>
                        </p>
                        
                        <p>
                            Jingcheng bridges two worlds rarely combined: deep technical expertise from building mission-critical systems 
                            at <strong>Tesla</strong> and <strong>BILL</strong>, and institutional-grade financial analysis honed through CFA Level 3 certification. 
                            This rare combination enables him to evaluate tech companies not just through traditional financial metrics, 
                            but by dissecting their <em>product architecture, engineering moats, and technological defensibility</em>.
                        </p>

                        <div className={styles.alphaEdge}>
                            <h3>The Alpha Edge</h3>
                            <ul>
                                <li>
                                    <strong>Insider Engineering Vision:</strong> Having architected fintech platforms and automation systems, 
                                    Jingcheng understands the difference between a replicable tech stack and a genuine engineering moat. 
                                    He evaluates companies from the code up—scrutinizing scalability, API design, and AI differentiation.
                                </li>
                                <li>
                                    <strong>Quantitative Rigor:</strong> Combines Python-powered data engineering with sophisticated financial modeling. 
                                    His frameworks dissect SaaS metrics (NRR, CAC payback, LTV/CAC ratios) and run backtests on alternative data sources 
                                    to identify mispriced growth opportunities.
                                </li>
                                <li>
                                    <strong>Domain Mastery:</strong> Expert in Cloud infrastructure economics, AI/ML deployment costs, 
                                    and the unit economics that separate sustainable SaaS businesses from cash-burning hype cycles.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.mission}>
                            <h3>Current Mission</h3>
                            <p>
                                Building algorithmic tools and research frameworks that identify high-growth tech stocks through the lens of 
                                <strong> product-market fit</strong>, <strong>technical moats</strong>, and <strong>fundamental SaaS metrics</strong>. 
                                Kirboreo's research combines sentiment analysis, alternative data mining, and rigorous valuation models 
                                to deliver hedge-fund-grade insights with engineering precision.
                            </p>
                        </div>

                        <div className={styles.philosophy}>
                            <blockquote>
                                "The best tech investments aren't found in earnings calls—they're hidden in GitHub commits, 
                                API adoption rates, and infrastructure choices that Wall Street can't read."
                            </blockquote>
                        </div>
                    </div>
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
