import Navbar from '@/components/Navbar';
import styles from './Labs.module.css';
import Link from 'next/link';

export const metadata = {
  title: 'Kirboreo Labs | Experimental Projects',
  description: 'Explore our experimental AI-powered tools for investment research and financial analysis.',
};

const projects = [
  {
    id: 'fomo-meter',
    emoji: '😱',
    title: 'The "FOMO" Meter',
    subtitle: '错失恐惧症仪表盘',
    description: 'A minimalist dashboard that analyzes trending tech news and stocks, presenting a visual "emotion thermometer" to gauge market sentiment.',
    why_fun: 'Instead of complex charts, it uses emojis and exaggerated animations. When the market is crazy, the page vibrates; during panic, it turns cold-toned.',
    why_useful: 'Acts as a contrarian indicator. When the dashboard is "red-hot," it reminds you to stay calm.',
    example: 'Input $TSLA → System analyzes 10 recent headlines → Shows "😱 Extreme Hype" with rockets flying → Message: "Chill out, even Iron Man needs to sleep."',
    tech_stack: ['Next.js', 'OpenAI API', 'Yahoo Finance', 'Vercel'],
    status: 'Live',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
  },
  {
    id: 'stoic-mirror',
    emoji: '🪞',
    title: 'The Digital "Stoic" Mirror',
    subtitle: '赛博斯多葛之镜',
    description: 'An AI-driven journaling companion that combines meditation and reflection. Share your anxieties and receive wisdom from ancient philosophers like Marcus Aurelius or Wang Yangming.',
    why_fun: 'This "cross-time dialogue" has a unique vibe. The interface resembles ancient parchment or minimalist Zen style.',
    why_useful: 'Helps calm trading-day anxieties and provides higher-dimensional perspective.',
    example: 'Input: "My portfolio dropped 2% today, I feel like a failure." → Response (Wang Yangming style): "This heart unmoved, moves with opportunity. Gains and losses are external, inner anxiety stems from fear of the unknown, not the loss itself."',
    tech_stack: ['React', 'Tailwind CSS', 'Vercel AI SDK', 'Streaming Text'],
    status: 'Coming Soon',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'eli5-generator',
    emoji: '🍎',
    title: '"Explain Like I\'m 5" Generator',
    subtitle: '五岁小孩解释器 - 基金版',
    description: 'Input complex financial terms or company reports (like NVIDIA\'s CUDA architecture), and get simple explanations using only emojis and plain language, shareable as image cards.',
    why_fun: 'This contrast is perfect for social media. Turns boring finance into memes.',
    why_useful: 'Helps clarify your thinking (Feynman technique) and creates educational content for clients.',
    example: 'Input: "Short Selling" → Generates card with apple story: Borrow 🍎 → Sell for $5 → Price drops to $2 → Buy new 🍎 → Return to neighbor → 💰 Profit $3! (But if price rises to $10, you\'re done 💀)',
    tech_stack: ['Next.js', 'Vercel/OG', 'OpenAI API', 'Image Generation'],
    status: 'Coming Soon',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
];

export default function LabsPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                <span className={styles.labs}>Kirboreo</span>
                <span className={styles.emoji}>🧪</span>
                <span className={styles.labs}>Labs</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Experimental AI-Powered Tools for Modern Investors
              </p>
              <p className={styles.heroDescription}>
                Where serious finance meets playful innovation. Explore our collection of experimental projects 
                that make investment research more intuitive, engaging, and surprisingly fun.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className={styles.projectsSection}>
          <div className="container">
            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <article 
                  key={project.id} 
                  id={project.id}
                  className={styles.projectCard}
                  style={{ ['--card-gradient' as string]: project.gradient }}
                >
                  {/* Card Header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.cardEmoji}>{project.emoji}</div>
                    <div className={styles.cardTitleGroup}>
                      <h2 className={styles.cardTitle}>{project.title}</h2>
                      <p className={styles.cardSubtitle}>{project.subtitle}</p>
                    </div>
                    <span className={styles.statusBadge}>{project.status}</span>
                  </div>

                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    <p className={styles.description}>{project.description}</p>

                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>🎨 Why It's Fun</h3>
                      <p className={styles.sectionText}>{project.why_fun}</p>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>💡 Why It's Useful</h3>
                      <p className={styles.sectionText}>{project.why_useful}</p>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>📖 Example Scenario</h3>
                      <div className={styles.exampleBox}>
                        <p className={styles.exampleText}>{project.example}</p>
                      </div>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>🛠️ Tech Stack</h3>
                      <div className={styles.techStack}>
                        {project.tech_stack.map((tech) => (
                          <span key={tech} className={styles.techTag}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className={styles.cardFooter}>
                    {project.status === 'Live' ? (
                      <Link href={`/labs/${project.id}`} className={styles.liveButton}>
                        <span>🚀</span>
                        <span>Try It Now</span>
                      </Link>
                    ) : (
                      <button className={styles.notifyButton} disabled>
                        <span>🔔</span>
                        <span>Notify Me When Ready</span>
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Have an Idea for a Lab Project?</h2>
              <p className={styles.ctaText}>
                We're always looking for innovative ways to make investment research more accessible and engaging.
              </p>
              <Link href="/about#contact" className={styles.ctaButton}>
                Share Your Thoughts
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.glow3} />
      </div>
    </div>
  );
}
