
import React, { useState, useRef, useEffect } from 'react';
import { streamChatResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { BotIcon, SendIcon, CloseIcon } from './IconComponents';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([{
        id: 1,
        text: "Hello! I'm the ISF AI assistant. How can I help you learn about our student club today?",
        sender: 'bot'
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessageId = Date.now() + 1;
    setMessages(prev => [...prev, { id: botMessageId, text: '', sender: 'bot', isStreaming: true }]);

    try {
        const stream = await streamChatResponse(input);
        let accumulatedText = '';

        for await (const chunk of stream) {
            accumulatedText += chunk.text;
            setMessages(prev => prev.map(msg => 
                msg.id === botMessageId ? { ...msg, text: accumulatedText } : msg
            ));
        }
        
        setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
        ));

    } catch (error) {
        setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, text: "Sorry, I'm having trouble connecting. Please try again later.", isStreaming: false } : msg
        ));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition-all duration-300 z-50 animate-float"
      >
        <BotIcon className="h-8 w-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[60vh] bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 animate-fadeIn">
          <div className="flex justify-between items-center p-4 border-b border-gray-300/50 dark:border-gray-700/50">
            <h3 className="font-orbitron font-bold text-lg">ISF AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && <BotIcon className="h-6 w-6 text-primary flex-shrink-0" />}
                <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                  {msg.isStreaming && <span className="inline-block w-2 h-2 ml-1 bg-primary rounded-full animate-ping"></span>}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-gray-300/50 dark:border-gray-700/50">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about ISF..."
                className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
                disabled={isLoading}
              />
              <button onClick={handleSend} disabled={isLoading} className="p-2 text-primary disabled:text-gray-400">
                <SendIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
