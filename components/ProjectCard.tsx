import styles from './ProjectCard.module.css';

interface ProjectCardProps {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    techStack: string[];
    example: {
        input: string;
        output: string;
    };
    status: 'coming-soon' | 'beta' | 'live';
}

export default function ProjectCard({
    id,
    icon,
    title,
    subtitle,
    description,
    features,
    techStack,
    example,
    status
}: ProjectCardProps) {
    return (
        <div id={id} className={styles.card}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <span className={styles.icon}>{icon}</span>
                </div>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
                <div className={`${styles.badge} ${styles[status]}`}>
                    {status === 'coming-soon' ? '🚀 Coming Soon' : status === 'beta' ? '🧪 Beta' : '✅ Live'}
                </div>
            </div>

            <div className={styles.content}>
                <p className={styles.description}>{description}</p>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>✨ Key Features</h3>
                    <ul className={styles.featureList}>
                        {features.map((feature, index) => (
                            <li key={index} className={styles.featureItem}>{feature}</li>
                        ))}
                    </ul>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>🛠 Tech Stack</h3>
                    <div className={styles.techStack}>
                        {techStack.map((tech, index) => (
                            <span key={index} className={styles.techBadge}>{tech}</span>
                        ))}
                    </div>
                </div>

                <div className={styles.example}>
                    <h3 className={styles.sectionTitle}>💡 Example</h3>
                    <div className={styles.exampleContent}>
                        <div className={styles.exampleInput}>
                            <span className={styles.exampleLabel}>Input:</span>
                            <code>{example.input}</code>
                        </div>
                        <div className={styles.exampleArrow}>→</div>
                        <div className={styles.exampleOutput}>
                            <span className={styles.exampleLabel}>Output:</span>
                            <div className={styles.exampleOutputContent}>{example.output}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.launchButton} disabled={status === 'coming-soon'}>
                    {status === 'coming-soon' ? '🔒 Coming Soon' : '🚀 Launch Project'}
                </button>
            </div>
        </div>
    );
}

