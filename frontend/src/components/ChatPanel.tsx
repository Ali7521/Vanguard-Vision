import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import type { Message } from '../App';

interface Props {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isAnalyzing: boolean;
}

export default function ChatPanel({ messages, onSendMessage, isAnalyzing }: Props) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onSendMessage(input);
    setInput('');
    setIsTyping(true);
  };

  // Turn off typing indicator when new assistant message arrives
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      setIsTyping(false);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 sticky top-0">
        <div>
            <h2 className="font-bold text-slate-800 tracking-tight">Analysis Assistant</h2>
            <p className="text-xs text-slate-500 mt-0.5">Ask questions in natural language</p>
        </div>
        <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Ready
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>
              {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>
            
            <div className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-[14px] shadow-sm border ${msg.role === 'user' ? 'bg-blue-600 border-blue-600 text-white rounded-tr-sm' : 'bg-white border-slate-200 text-slate-700 rounded-tl-sm'}`}>
              <p className="leading-relaxed">{msg.content}</p>
              
              {((msg.boxes && msg.boxes.length > 0) || (msg.polygons && msg.polygons.length > 0)) && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detected Regions</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.boxes?.map((box, i) => (
                      <span key={`box-${i}`} className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded border border-red-100 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm"></span>
                        {box.label} {(box.confidence * 100).toFixed(0)}%
                      </span>
                    ))}
                    {msg.polygons?.map((poly, i) => (
                      <span key={`poly-${i}`} className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-100 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ backgroundColor: poly.color.replace(/[\d.]+\)$/, '1)') }}></span>
                        {poly.label} {(poly.confidence * 100).toFixed(0)}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {(isTyping || isAnalyzing) && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bot size={15} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center">
              <div className="flex gap-1.5 items-center justify-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      
      <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all shadow-inner"
            disabled={isTyping || isAnalyzing}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping || isAnalyzing}
            className="absolute right-2 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="mt-3 text-center">
          <p className="text-[11px] text-slate-400 font-medium">Try: "How many buildings are here?"</p>
        </div>
      </div>
    </div>
  );
}
