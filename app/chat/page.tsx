'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Bot, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from './chat.module.css';

export default function ChatPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
    } as any) as any;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={styles.pageContainer}>
            {/* Background Effects */}
            <div className={styles.backgroundEffects}>
                <div className={`${styles.blob} ${styles.blobCyan}`} />
                <div className={`${styles.blob} ${styles.blobPurple}`} />
                <div className={styles.gridBackground} />
            </div>

            {/* Header */}
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    <span className={styles.backText}>BACK TO HOME</span>
                </Link>
                <div className={styles.headerCenter}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logoInner}>
                            <Bot className="text-cyan-400" size={24} color="#22d3ee" />
                        </div>
                    </div>
                    <h1 className={styles.title}>
                        KIRBOREO AI
                    </h1>
                    <p className={styles.subtitle}>Advanced Neural Interface</p>
                </div>
                <div style={{ width: '100px' }} /> {/* Spacer for centering */}
            </header>

            {/* Chat Container */}
            <main className={styles.main}>
                <div className={styles.messagesContainer}>
                    {messages.length === 0 && (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <Bot size={40} color="#22d3ee" />
                            </div>
                            <h2 className={styles.emptyTitle}>
                                Ask me anything about <span className={styles.highlight}>Kirboreo</span>
                            </h2>
                            <p className={styles.emptyDesc}>
                                I can answer questions about investment strategies, tech analysis, and market insights based on our research.
                            </p>
                        </div>
                    )}

                    {messages.map((m: any) => (
                        <div
                            key={m.id}
                            className={`${styles.messageRow} ${m.role === 'user' ? styles.messageRowUser : ''}`}
                        >
                            <div className={`${styles.avatar} ${m.role === 'user' ? styles.avatarUser : styles.avatarBot}`}>
                                {m.role === 'user' ? <User size={16} color="#fff" /> : <Bot size={16} color="#fff" />}
                            </div>

                            <div className={`${styles.messageBubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                                <div>
                                    {m.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className={styles.messageRow}>
                            <div className={`${styles.avatar} ${styles.avatarBot}`}>
                                <Bot size={16} color="#fff" />
                            </div>
                            <div className={styles.loadingDots}>
                                <div className={styles.dot} style={{ animationDelay: '0ms' }} />
                                <div className={styles.dot} style={{ animationDelay: '150ms' }} />
                                <div className={styles.dot} style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={styles.inputArea}>
                    <form onSubmit={handleSubmit} className={styles.inputWrapper}>
                        <div className={styles.inputGlow}></div>
                        <div className={styles.inputContainer}>
                            <input
                                className={styles.input}
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type your message..."
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input?.trim()}
                                className={styles.sendButton}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
