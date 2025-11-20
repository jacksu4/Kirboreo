'use client';

import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function StoicMirrorPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [textInput, setTextInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const [status, setStatus] = useState('');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!textInput.trim() || isLoading) return;

        const userMessage = { role: 'user', content: textInput, id: Date.now().toString() };
        setMessages(prev => [...prev, userMessage]);
        setTextInput('');
        setIsLoading(true);
        setStatus('Sending request...');
        console.log('Sending message:', userMessage);

        try {
            const response = await fetch('/api/stoic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) {
                setStatus(`Error: ${response.status} ${response.statusText}`);
                console.error('Response not ok:', response.status, response.statusText);
                throw new Error('Network response was not ok');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                setStatus('Error: No reader available');
                console.error('No reader available');
                return;
            }

            setStatus('Stream started');
            const assistantMessage = { role: 'assistant', content: '', id: (Date.now() + 1).toString() };
            setMessages(prev => [...prev, assistantMessage]);
            console.log('Created assistant message placeholder');

            let accumulatedContent = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedContent += chunk;
                setStatus(`Received chunk: ${chunk.length} chars`);
                // console.log('Received chunk:', chunk);

                setMessages(prev => prev.map(m => m.id === assistantMessage.id ? { ...m, content: accumulatedContent } : m));
            }
            setStatus('Stream finished');
            console.log('Stream finished');
        } catch (error: any) {
            setStatus(`Exception: ${error.message}`);
            console.error('Error in handleFormSubmit:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I am having trouble connecting to the ether. Please try again.', id: Date.now().toString() }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F0E6] text-[#4A4036] font-serif relative overflow-hidden selection:bg-[#D4C5A9] selection:text-[#2C241B]">
            {/* Debug Status */}
            <div className="fixed top-0 left-0 bg-black/50 text-white p-2 z-50 text-xs font-mono">
                Status: {status}
            </div>
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

            {/* Header */}
            <header className="relative z-10 p-6 flex items-center justify-between border-b border-[#D4C5A9]">
                <Link href="/labs" className="flex items-center gap-2 text-[#8C7B66] hover:text-[#4A4036] transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-sans text-sm tracking-widest uppercase">Back to Labs</span>
                </Link>
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-[#2C241B]">The Digital Stoic Mirror</h1>
                    <p className="text-sm text-[#8C7B66] italic mt-1">Reflect on your inner self</p>
                </div>
                <div className="w-[100px]" />
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto max-w-3xl p-6 flex flex-col h-[calc(100vh-120px)]">

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto space-y-8 p-4 scrollbar-thin scrollbar-thumb-[#D4C5A9] scrollbar-track-transparent">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-80">
                            <div className="w-24 h-24 rounded-full border-2 border-[#D4C5A9] flex items-center justify-center bg-[#EBE5D9]">
                                <span className="text-4xl">🪞</span>
                            </div>
                            <div className="max-w-md space-y-2">
                                <h2 className="text-xl font-medium text-[#2C241B]">Gaze into the mirror</h2>
                                <p className="text-[#8C7B66] leading-relaxed">
                                    "The happiness of your life depends upon the quality of your thoughts."
                                </p>
                                <p className="text-sm text-[#8C7B66] mt-4">
                                    Share your anxieties, fears, or troubles. Receive wisdom from the ancients.
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map((m: any) => (
                        <div
                            key={m.id}
                            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-[85%] p-6 rounded-sm shadow-sm relative ${m.role === 'user'
                                ? 'bg-[#EBE5D9] text-[#2C241B] border-l-4 border-[#8C7B66]'
                                : 'bg-white text-[#2C241B] border-l-4 border-[#4A4036]'
                                }`}>
                                {/* Decorative Quote Mark */}
                                <span className="absolute -top-3 -left-2 text-4xl text-[#D4C5A9] opacity-50 font-serif">"</span>

                                <div className="prose prose-stone prose-lg max-w-none font-serif leading-relaxed">
                                    {m.content}
                                </div>

                                <div className="mt-2 text-xs text-[#8C7B66] font-sans uppercase tracking-widest text-right">
                                    {m.role === 'user' ? 'You' : 'The Sage'}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center justify-center space-x-2 py-4">
                            <div className="w-2 h-2 bg-[#8C7B66] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-[#8C7B66] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-[#8C7B66] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="mt-6 relative">
                    <form onSubmit={handleFormSubmit} className="relative">
                        <input
                            data-testid="chat-input"
                            className="w-full bg-white border-2 border-[#D4C5A9] text-[#2C241B] px-6 py-4 pr-16 rounded-sm focus:outline-none focus:border-[#8C7B66] placeholder-[#B0A390] font-serif text-lg shadow-sm transition-colors"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Write your thoughts here..."
                        />
                        <button
                            data-testid="send-button"
                            type="submit"
                            disabled={isLoading || !textInput.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#8C7B66] hover:text-[#4A4036] disabled:opacity-50 transition-colors z-50 cursor-pointer"
                        >
                            <Send size={24} />
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-xs text-[#B0A390] font-sans">Wisdom from Marcus Aurelius & Wang Yangming</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
