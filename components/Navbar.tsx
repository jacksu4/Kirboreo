import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.kirby}>Kir</span>
                    <span className={styles.oreo}>boreo</span>
                </Link>

                <div className={styles.links}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/research" className={styles.link}>Research</Link>
                    <Link href="/analysis" className={styles.link}>Analysis</Link>
                    <Link href="/about" className={styles.link}>About</Link>
                </div>

                <Link href="/about#contact" className={styles.contactButton}>
                    <span className={styles.contactIcon}>✉️</span>
                    <span>Contact Us</span>
                </Link>
            </div>
        </nav>
    );
}
