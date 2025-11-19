'use client';

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: ''
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          aiResponse += chunk;
          
          // 更新 assistant 消息
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content = aiResponse;
            }
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        .chat-page {
          min-height: 100vh;
          background-color: #0a0f1e;
          color: white;
        }
        .chat-header {
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background-color: rgba(10, 15, 30, 0.9);
          padding: 1rem 2rem;
        }
        .chat-header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #22d3ee;
          text-decoration: none;
          font-size: 0.875rem;
        }
        .back-link:hover {
          color: #67e8f9;
        }
        .header-title {
          text-align: center;
        }
        .header-title h1 {
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(to right, #22d3ee, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.25rem 0;
        }
        .header-title p {
          font-size: 0.75rem;
          color: #9ca3af;
          margin: 0;
        }
        .chat-main {
          padding: 2rem;
          min-height: calc(100vh - 100px);
        }
        .chat-container {
          max-width: 1000px;
          margin: 0 auto;
          height: calc(100vh - 150px);
          display: flex;
          flex-direction: column;
          background-color: rgba(0,0,0,0.4);
          border: 1px solid rgba(34, 211, 238, 0.3);
          border-radius: 1rem;
          overflow: hidden;
          position: relative;
        }
        .chat-interface-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(34, 211, 238, 0.2);
          background-color: rgba(6, 182, 212, 0.05);
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .interface-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee, #9333ea);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          position: relative;
          z-index: 1;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          gap: 1rem;
        }
        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: rgba(34, 211, 238, 0.1);
          border: 1px solid rgba(34, 211, 238, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .message-row {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          align-items: flex-start;
        }
        .message-row.user {
          flex-direction: row-reverse;
        }
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .message-avatar.user {
          background-color: #0891b2;
        }
        .message-avatar.bot {
          background-color: #7c3aed;
        }
        .message-bubble {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .message-bubble.user {
          background-color: rgba(8, 145, 178, 0.2);
          border: 1px solid rgba(8, 145, 178, 0.4);
          border-top-right-radius: 0.25rem;
        }
        .message-bubble.bot {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top-left-radius: 0.25rem;
        }
        .input-area {
          position: relative;
          z-index: 50;
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(34, 211, 238, 0.2);
          background-color: rgba(0, 0, 0, 0.6);
        }
        .input-form {
          display: flex;
          gap: 0.75rem;
        }
        .input-field {
          flex: 1;
          padding: 0.75rem 1rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
        }
        .input-field:focus {
          border-color: #22d3ee;
          background-color: rgba(255, 255, 255, 0.08);
        }
        .input-field::placeholder {
          color: #6b7280;
        }
        .input-field:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .send-button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #0891b2, #7c3aed);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .send-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(34, 211, 238, 0.4);
        }
        .send-button:active:not(:disabled) {
          transform: scale(0.98);
        }
        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .loading-dots {
          display: flex;
          gap: 0.25rem;
        }
        .loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #22d3ee;
          animation: bounce 1.4s infinite ease-in-out;
        }
        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }
        .loading-dot:nth-child(3) { animation-delay: 0s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="chat-page">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <Link href="/" className="back-link">
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>
            <div className="header-title">
              <h1>Kirboreo AI</h1>
              <p>ADVANCED PERSONAL ASSISTANT</p>
            </div>
            <div style={{ width: '100px' }}></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="chat-main">
          <div className="chat-container">
            {/* Chat Interface Header */}
            <div className="chat-interface-header">
              <div className="interface-avatar">
                <Bot size={20} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Neural Interface</h2>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Powered by GPT-4o & Pinecone RAG</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="messages-area">
              {/* Empty State */}
              {messages.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Bot size={40} color="#22d3ee" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
                    Start a conversation with Kirboreo AI
                  </h3>
                  <p style={{ color: '#9ca3af', maxWidth: '500px', margin: 0 }}>
                    Ask me about investment strategies, tech analysis, market trends, or anything related to our research.
                  </p>
                </div>
              )}

              {/* Messages */}
              {messages.map((message) => (
                <div key={message.id} className={`message-row ${message.role === 'user' ? 'user' : ''}`}>
                  <div className={`message-avatar ${message.role === 'user' ? 'user' : 'bot'}`}>
                    {message.role === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
                  </div>
                  <div className={`message-bubble ${message.role === 'user' ? 'user' : 'bot'}`}>
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="message-row">
                  <div className="message-avatar bot">
                    <Bot size={16} color="white" />
                  </div>
                  <div className="message-bubble bot">
                    <div className="loading-dots">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
              <form onSubmit={handleSubmit} className="input-form">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="input-field"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="send-button"
                >
                  <Send size={18} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
