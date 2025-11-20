'use client';

import { ArrowLeft, Sparkles, Copy, Check, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import CardPreview, { CardTemplate } from '@/components/CardPreview';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const MAX_INPUT_LENGTH = 2000;

const EXAMPLE_INPUTS = [
    {
        label: 'Short Selling',
        emoji: '📉',
        text: 'Short selling is when you borrow shares of a stock, sell them immediately, and hope the price drops so you can buy them back cheaper and return them to the lender, keeping the profit.',
    },
    {
        label: 'NVIDIA CUDA',
        emoji: '🎮',
        text: 'CUDA is NVIDIA\'s parallel computing platform that allows developers to use GPU cores for general purpose processing, not just graphics rendering.',
    },
    {
        label: 'Compound Interest',
        emoji: '📈',
        text: 'Compound interest is interest calculated on the initial principal and also on the accumulated interest from previous periods.',
    },
];

export default function ELI5GeneratorPage() {
    const [inputText, setInputText] = useState('');
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>('gradient');

    const explanationRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to explanation when it starts generating
    useEffect(() => {
        if (explanation && !isLoading) {
            explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [explanation, isLoading]);

    const handleGenerate = async () => {
        if (!inputText.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setExplanation('');

        try {
            const response = await fetch('/api/eli5', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate explanation');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response stream available');
            }

            let accumulatedText = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;
                setExplanation(accumulatedText);
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
            console.error('ELI5 Generation Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!explanation) return;

        try {
            await navigator.clipboard.writeText(explanation);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleExampleClick = (text: string) => {
        setInputText(text);
        setExplanation('');
        setError(null);
    };

    const characterCount = inputText.length;
    const isOverLimit = characterCount > MAX_INPUT_LENGTH;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
            {/* Background Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/labs"
                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="font-medium text-sm tracking-wide">BACK TO LABS</span>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        <span className="text-xs font-medium text-purple-300 tracking-wide uppercase">Beta v1.0</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-6 py-12 max-w-5xl">
                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5 shadow-2xl shadow-purple-500/10">
                        <span className="text-5xl filter drop-shadow-lg">🍎</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
                            Explain Like I'm 5
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Turn complex financial jargon into simple, emoji-rich stories.
                        <br />
                        <span className="text-purple-400/80 text-sm font-mono mt-2 block">Powered by GPT-4o & Kirboreo Intelligence</span>
                    </p>
                </motion.div>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative group"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur" />
                    <div className="relative bg-[#13131a] border border-white/10 rounded-xl p-1 overflow-hidden">
                        <div className="p-6 md:p-10">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                                    Input Text
                                </label>
                                <div className="flex gap-2">
                                    {EXAMPLE_INPUTS.map((example) => (
                                        <button
                                            key={example.label}
                                            onClick={() => handleExampleClick(example.text)}
                                            className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full text-gray-400 hover:text-white transition-all"
                                        >
                                            {example.emoji} {example.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste complex financial terms, company reports, or technical jargon here..."
                                className="w-full h-48 bg-black/20 border border-white/5 rounded-lg p-5 text-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none transition-all"
                                maxLength={MAX_INPUT_LENGTH + 100}
                            />

                            <div className="flex items-center justify-between mt-4">
                                <span className={cn("text-xs font-mono", isOverLimit ? "text-red-400" : "text-gray-500")}>
                                    {characterCount} / {MAX_INPUT_LENGTH} chars
                                </span>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!inputText.trim() || isLoading || isOverLimit}
                                    className="relative overflow-hidden px-8 py-3 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={18} className="text-purple-600" />
                                            <span>Simplifiy It</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Error Display */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-200"
                        >
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Section */}
                <AnimatePresence>
                    {explanation && (
                        <motion.div
                            ref={explanationRef}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mt-16 grid md:grid-cols-2 gap-8"
                        >
                            {/* Explanation Column */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                                        The Simple Version
                                    </h2>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                                    </button>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" />
                                    <div className="prose prose-invert prose-lg max-w-none">
                                        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">
                                            {explanation}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Preview Column */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">
                                        Shareable Card
                                    </h2>
                                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                                        {(['gradient', 'minimal', 'meme'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setSelectedTemplate(t)}
                                                className={cn(
                                                    "px-3 py-1 rounded-md text-xs font-medium transition-all capitalize",
                                                    selectedTemplate === t
                                                        ? "bg-white/10 text-white shadow-sm"
                                                        : "text-gray-500 hover:text-gray-300"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#13131a] border border-white/10 rounded-xl p-4 flex flex-col items-center gap-6">
                                    <CardPreview
                                        title="ELI5 Explanation"
                                        explanation={explanation}
                                        template={selectedTemplate}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
