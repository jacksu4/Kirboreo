'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isLabsOpen, setIsLabsOpen] = useState(false);

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
                    
                    {/* Labs Dropdown */}
                    <div 
                        className={styles.dropdown}
                        onMouseEnter={() => setIsLabsOpen(true)}
                        onMouseLeave={() => setIsLabsOpen(false)}
                    >
                        <Link href="/labs" className={styles.link}>
                            Labs 🧪
                        </Link>
                        
                        {isLabsOpen && (
                            <div className={styles.dropdownMenu}>
                                <Link href="/labs#fomo-meter" className={styles.dropdownItem}>
                                    <span className={styles.dropdownIcon}>😱</span>
                                    <div>
                                        <div className={styles.dropdownTitle}>FOMO Meter</div>
                                        <div className={styles.dropdownDesc}>Market sentiment visualizer</div>
                                    </div>
                                </Link>
                                
                                <Link href="/labs#stoic-mirror" className={styles.dropdownItem}>
                                    <span className={styles.dropdownIcon}>🪞</span>
                                    <div>
                                        <div className={styles.dropdownTitle}>Stoic Mirror</div>
                                        <div className={styles.dropdownDesc}>AI-powered reflection companion</div>
                                    </div>
                                </Link>
                                
                                <Link href="/labs#eli5-generator" className={styles.dropdownItem}>
                                    <span className={styles.dropdownIcon}>🍎</span>
                                    <div>
                                        <div className={styles.dropdownTitle}>ELI5 Generator</div>
                                        <div className={styles.dropdownDesc}>Complex finance made simple</div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                    
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
