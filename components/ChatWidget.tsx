'use client';

import { useChat } from '@ai-sdk/react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat() as any;
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] h-[500px] bg-black/90 border border-cyan-500/30 rounded-xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md">
                    {/* Header */}
                    <div className="p-4 bg-cyan-950/30 border-b border-cyan-500/20 flex justify-between items-center">
                        <h3 className="text-cyan-400 font-bold">Kirboreo AI</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-cyan-400/70 hover:text-cyan-400 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-cyan-400/50 mt-10 text-sm">
                                Ask me anything about Kirboreo!
                            </div>
                        )}
                        {messages.map((m: any) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user'
                                        ? 'bg-cyan-600 text-white rounded-br-none'
                                        : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                                        }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none border border-gray-700">
                                    <span className="animate-pulse text-cyan-400">...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 bg-black/50 border-t border-cyan-500/20">
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-gray-900/50 border border-cyan-500/30 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600"
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
}
