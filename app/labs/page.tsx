import ProjectCard from '@/components/ProjectCard';
import Navbar from '@/components/Navbar';
import styles from './Labs.module.css';

export const metadata = {
    title: 'Labs | Kirboreo Experimental Projects',
    description: 'Explore experimental AI-powered tools for finance and investment analysis.',
};

const projects = [
    {
        id: 'fomo-meter',
        icon: '😱',
        title: 'FOMO Meter',
        subtitle: '错失恐惧症仪表盘',
        description: 'A minimalist dashboard that analyzes trending tech news and stocks, presenting market sentiment through a visual "emotion thermometer". Instead of complex candlestick charts, it uses emojis and exaggerated animations to showcase market emotions.',
        features: [
            '🌡️ Real-time market sentiment visualization',
            '📰 AI-powered news analysis',
            '🎨 Dynamic UI that reacts to market emotions (vibrations during hype, cool tones during panic)',
            '⚖️ Acts as a contrarian indicator - reminds you to stay calm when the meter turns "red-hot"',
        ],
        techStack: ['Next.js', 'OpenAI API', 'RSS Feed', 'Vercel'],
        example: {
            input: '$TSLA',
            output: '😱 Extreme Hype (极度炒作)\n🚀 Background: Rockets flying everywhere\n💬 "Chill out, even Iron Man needs to sleep."\n\n10 latest headlines all shouting "Robotaxi will change the world!"',
        },
        status: 'coming-soon' as const,
    },
    {
        id: 'stoic-mirror',
        icon: '🪞',
        title: 'Stoic Mirror',
        subtitle: '赛博斯多葛之镜',
        description: 'An AI-driven reflection journal that combines meditation and philosophical wisdom. Share your anxieties, and AI responds in the voice of ancient philosophers like Marcus Aurelius or Wang Yangming, providing higher-dimensional perspectives.',
        features: [
            '🧘 Mindful trading psychology support',
            '📜 Ancient wisdom meets modern AI',
            '✍️ Beautiful UI with breathing text animations (zen or parchment style)',
            '💭 Helps calm trading-day anxiety with philosophical perspective',
        ],
        techStack: ['React', 'Tailwind CSS', 'Vercel AI SDK', 'Streaming Text'],
        example: {
            input: 'Today my portfolio dropped 2%, I feel anxious and like a failure.',
            output: '此心不动，随机而动。\n涨跌皆是外物，内心的焦虑源于对未知的恐惧，而非亏损本身。\n你且看那山中花开花落，何曾为了谁而改变？\n\n(This mind does not move, yet moves with circumstances.\nGains and losses are external—your anxiety stems from fear of the unknown, not the loss itself.\nObserve how mountain flowers bloom and fall—do they change for anyone?)',
        },
        status: 'coming-soon' as const,
    },
    {
        id: 'eli5-generator',
        icon: '🍎',
        title: 'ELI5 Generator',
        subtitle: '五岁小孩解释器',
        description: 'Input complex financial terms or company earnings reports (e.g., NVIDIA\'s CUDA architecture), and instantly generate an explanation using only emojis and plain language. Perfect for social media sharing as visual meme cards.',
        features: [
            '🧒 Feynman learning technique - clarify your own thinking',
            '🎨 One-click shareable image generation',
            '😂 Contrast humor (反差萌) - boring finance becomes viral memes',
            '📚 Great for investor education content',
        ],
        techStack: ['Next.js', 'Vercel OG (Image Generation)', 'OpenAI API'],
        example: {
            input: 'Short Selling (做空)',
            output: '🍎 借苹果的故事\n\n1️⃣ 你找邻居借了一个苹果 (Borrow)\n2️⃣ 你立刻把苹果卖了换 5 块钱 (Sell)\n3️⃣ 你赌苹果明天会降价\n4️⃣ 明天苹果真的只要 2 块钱了！\n5️⃣ 你买个新苹果还给邻居 (Cover)\n\n💰 你赚了 3 块钱！\n\n(但如果苹果涨到 10 块，你就完蛋了 💀)',
        },
        status: 'coming-soon' as const,
    },
];

export default function LabsPage() {
    return (
        <div className={styles.container}>
            <Navbar />

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Kirboreo <span className={styles.labsText}>Labs</span> 🧪
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Experimental AI-Powered Tools for Finance & Investment
                    </p>
                    <p className={styles.heroDescription}>
                        Where curiosity meets innovation. These are our playground projects—
                        <strong> fun, useful, and surprisingly delightful</strong>. Each experiment 
                        blends cutting-edge AI with practical financial insights, wrapped in a user experience 
                        that makes complex concepts accessible and engaging.
                    </p>
                </div>

                {/* Floating background elements */}
                <div className={styles.bgGradient1}></div>
                <div className={styles.bgGradient2}></div>
            </section>

            {/* Projects Section */}
            <section className={styles.projects}>
                <div className="container">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
            </section>

            {/* Footer CTA */}
            <section className={styles.cta}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>Have an Idea?</h2>
                    <p className={styles.ctaDescription}>
                        We're always experimenting with new concepts. If you have feedback or suggestions, 
                        we'd love to hear from you.
                    </p>
                    <a href="/about#contact" className={styles.ctaButton}>
                        💬 Share Your Thoughts
                    </a>
                </div>
            </section>
        </div>
    );
}

