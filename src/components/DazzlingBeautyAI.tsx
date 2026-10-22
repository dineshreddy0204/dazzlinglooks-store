import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Send,
  ShoppingCart,
  Eye,
  Compass,
  X,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Product, AI_SUGGESTED_QUESTIONS, INITIAL_PRODUCTS } from '../data/sampleData';
import { useStore } from '../context/StoreContext';

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  recommendedProducts?: Product[];
  suggestedCategories?: string[];
  followUpQuestions?: string[];
  timestamp: string;
}

const INITIAL_ASSISTANT_MESSAGE: AIChatMessage = {
  id: 'msg-welcome',
  role: 'assistant',
  text: 'Namaste & welcome to **Dazzlinglooks.in**! I am **Dazzling Beauty AI**, your personal beauty shopping assistant. Ask me about skincare for your skin type, product ingredients, stock availability, routines, products under ₹1,000, or our Thadithota, Rajahmundry retail store.',
  recommendedProducts: INITIAL_PRODUCTS.slice(0, 3),
  suggestedCategories: ['Skincare', 'Makeup', 'Combo Offers'],
  followUpQuestions: [
    'Which skincare products are available?',
    'Recommend a moisturiser for my skin type.',
    'Show products under ₹1,000.',
  ],
  timestamp: 'Just now',
};

// Shared in-memory session storage so conversation context persists across pages & between homepage section and floating widget
let sessionMessagesCache: AIChatMessage[] = [INITIAL_ASSISTANT_MESSAGE];
const listeners = new Set<() => void>();

function updateSharedMessages(next: AIChatMessage[]) {
  sessionMessagesCache = next;
  listeners.forEach((fn) => fn());
}

function useSharedAIChat() {
  const [messages, setMessages] = useState<AIChatMessage[]>(sessionMessagesCache);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const listener = () => setMessages([...sessionMessagesCache]);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Detect if user is currently on a product detail page (/product/:slug)
  const currentProductSlug = location.pathname.startsWith('/product/')
    ? location.pathname.replace('/product/', '').split('/')[0]
    : undefined;

  const sendMessage = async (rawQuestion: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedWithUser = [...sessionMessagesCache, userMsg];
    updateSharedMessages(updatedWithUser);
    setIsLoading(true);

    try {
      const historyPayload = updatedWithUser.slice(-8).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          currentProductSlug,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not reach Dazzling Beauty AI. Please try again.');
      }

      const assistantMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Here are our verified recommendations from Dazzlinglooks.in.',
        recommendedProducts: Array.isArray(data.recommendedProducts) ? data.recommendedProducts : [],
        suggestedCategories: Array.isArray(data.suggestedCategories) ? data.suggestedCategories : [],
        followUpQuestions: Array.isArray(data.followUpQuestions) ? data.followUpQuestions : [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      updateSharedMessages([...updatedWithUser, assistantMsg]);
    } catch (err: any) {
      setError(err?.message || 'Unable to connect right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setError(null);
    updateSharedMessages([INITIAL_ASSISTANT_MESSAGE]);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
    currentProductSlug,
  };
}

function getCategorySlug(catName: string): string {
  const map: Record<string, string> = {
    Skincare: 'skincare',
    Makeup: 'makeup',
    Haircare: 'haircare',
    Fragrances: 'fragrances',
    'Salon Tools': 'salon-tools',
    'Personal Care': 'personal-care',
    'Combo Offers': 'combo-offers',
  };
  return map[catName] || 'skincare';
}

function formatFormattedText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={idx} className={line.trim() === '' ? 'h-2' : 'mb-1.5 last:mb-0 leading-relaxed'}>
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-[#141110]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={pIdx}>{part}</span>;
        })}
      </p>
    );
  });
}

export const DazzlingBeautyAISection: React.FC = () => {
  const { messages, isLoading, error, sendMessage, resetChat } = useSharedAIChat();
  const { addToCart } = useStore();
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <section
      id="dazzling-beauty-ai"
      className="max-w-[1380px] mx-auto px-3 sm:px-6 py-8 sm:py-10"
    >
      <div className="rounded-2xl border border-[#E5D7C3] bg-gradient-to-br from-[#FFFDF9] via-[#FAF5ED] to-[#FCE8EE]/45 shadow-[0_12px_36px_rgba(20,17,16,0.06)] overflow-hidden">
        {/* Top Luxury Header Banner */}
        <div className="bg-[#141110] text-white px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#C59B5F]/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C59B5F] shrink-0 shadow-md bg-[#FAF7F2]">
              <img
                src="/assets/aistudio/file_0000000063108211bead702fb91a015a_ccc1a723.png"
                alt="Dazzlinglooks.in Logo"
                className="w-full h-full object-cover scale-[1.06]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold tracking-wide text-white">
                  Dazzling Beauty AI
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-[#E91E63] text-white">
                  <CheckCircle2 className="w-3 h-3" /> Verified Store Data
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#E5D7C3]">
                Your personal beauty shopping assistant — Powered by Gemini & verified Dazzlinglooks.in catalog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={resetChat}
              className="inline-flex items-center gap-1.5 text-xs text-[#E5D7C3] hover:text-white border border-[#C59B5F]/40 hover:border-[#C59B5F] rounded-full px-3 py-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Chat
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Suggested Questions & Grounding Info */}
          <div className="lg:col-span-4 p-4 sm:p-6 bg-[#FAF6EE] border-b lg:border-b-0 lg:border-r border-[#E6DAC8] flex flex-col justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#9A7442] mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E91E63]" /> Ask About Products, Routines & Store
              </p>
              <p className="text-xs text-[#5E524B] mb-4 leading-relaxed">
                Click any prompt below or type your own question to get instant recommendations grounded in real prices, ingredients, and Rajahmundry store stock:
              </p>

              <div className="flex flex-wrap lg:flex-col gap-2">
                {AI_SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    disabled={isLoading}
                    className="text-left text-xs font-medium px-3.5 py-2 rounded-xl bg-white hover:bg-[#FCE8EE] text-[#231F1E] hover:text-[#B9124B] border border-[#E5D7C3] hover:border-[#E91E63]/50 transition flex items-center justify-between gap-2 group disabled:opacity-50"
                  >
                    <span>{q}</span>
                    <span className="text-[#C59B5F] group-hover:text-[#E91E63] shrink-0">→</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white/90 border border-[#E5D7C3] p-3.5 text-[11px] text-[#5E524B] space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#141110]">
                <ShieldCheck className="w-4 h-4 text-[#C59B5F]" /> 100% Grounded Beauty Advice
              </div>
              <p>
                Answers strictly use verified Dazzlinglooks.in inventory, ingredients, and store policies. Cosmetic tips are not a substitute for professional dermatological care.
              </p>
            </div>
          </div>

          {/* Right Column: Live Chat Conversation & Product Cards */}
          <div className="lg:col-span-8 flex flex-col h-[560px] sm:h-[600px] bg-white/75">
            {/* Scrollable Messages Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-semibold text-[#6F6259]">
                      {msg.role === 'user' ? 'You' : 'Dazzling Beauty AI'}
                    </span>
                    <span className="text-[10px] text-[#9E9085]">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#141110] text-white rounded-br-xs shadow-xs'
                        : 'bg-[#FAF6F0] text-[#231F1E] border border-[#E5D7C3] rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.role === 'user' ? <p>{msg.text}</p> : formatFormattedText(msg.text)}
                  </div>

                  {/* Recommended Product Cards inside Assistant Message */}
                  {msg.role === 'assistant' &&
                    msg.recommendedProducts &&
                    msg.recommendedProducts.length > 0 && (
                      <div className="mt-3 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[95%]">
                        {msg.recommendedProducts.map((prod) => (
                          <div
                            key={`${msg.id}-${prod.id}`}
                            className="bg-white rounded-xl border border-[#E5D7C3] p-3 flex gap-3 items-center shadow-xs hover:border-[#C59B5F] transition"
                          >
                            <Link
                              to={`/product/${prod.slug}`}
                              className="w-16 h-16 rounded-lg bg-[#FAF7F2] border border-[#EFE6D8] p-1 shrink-0 flex items-center justify-center overflow-hidden"
                            >
                              <img
                                src={prod.imageUrl}
                                alt={prod.shortTitle}
                                className="w-full h-full object-contain"
                              />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${prod.slug}`}
                                className="text-xs font-bold text-[#141110] hover:text-[#E91E63] line-clamp-1"
                              >
                                {prod.shortTitle}
                              </Link>
                              <p className="text-[11px] text-[#7A6B61]">{prod.brand}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs font-bold text-[#141110]">
                                  ₹{prod.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-[#9A8B7E] line-through">
                                  ₹{prod.originalPrice.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#FCE8EE] text-[#E91E63]">
                                  {prod.discountPercent}% OFF
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-2">
                                <Link
                                  to={`/product/${prod.slug}`}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#D8C7B4] text-[#231F1E] hover:bg-[#FAF6F0] transition"
                                >
                                  <Eye className="w-3 h-3" /> View Product
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => addToCart(prod.id, prod.defaultSize, 1)}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#141110] hover:bg-[#E91E63] text-white transition"
                                >
                                  <ShoppingCart className="w-3 h-3" /> Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Explore Category Pills */}
                  {msg.role === 'assistant' &&
                    msg.suggestedCategories &&
                    msg.suggestedCategories.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {msg.suggestedCategories.map((cat) => (
                          <Link
                            key={`${msg.id}-cat-${cat}`}
                            to={
                              cat === 'Combo Offers'
                                ? '/offers'
                                : `/category/${getCategorySlug(cat)}`
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-[#FCE8EE] text-[#C2185B] hover:bg-[#E91E63] hover:text-white transition"
                          >
                            <Compass className="w-3 h-3" /> Explore {cat}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2.5 text-xs text-[#6E5F55] bg-[#FAF6F0] border border-[#E5D7C3] rounded-2xl px-4 py-3 w-fit">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#E91E63] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#C59B5F] animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-[#141110] animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span>Dazzling Beauty AI is checking verified store data...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-center gap-2 text-xs text-[#B9124B] bg-[#FCE8EE] border border-[#E91E63]/30 rounded-xl px-4 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Bottom Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="p-3.5 sm:p-4 bg-[#FAF6EE] border-t border-[#E5D7C3] flex items-center gap-2.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skincare, moisturisers, ingredients, products under ₹1,000, or store location..."
                disabled={isLoading}
                className="flex-1 bg-white border border-[#D8C7B4] focus:border-[#E91E63] rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#141110] placeholder-[#8C7B70] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center gap-1.5 bg-[#E91E63] hover:bg-[#C2185B] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition shadow-xs cursor-pointer"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export const DazzlingBeautyFloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, error, sendMessage, currentProductSlug } = useSharedAIChat();
  const { addToCart } = useStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50">
      {isOpen ? (
        <div className="w-[340px] sm:w-[400px] h-[520px] rounded-2xl bg-[#FFFDF9] border border-[#C59B5F] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#141110] text-white px-4 py-3 flex items-center justify-between border-b border-[#C59B5F]/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C59B5F] shrink-0 bg-[#FAF7F2]">
                <img
                  src="/assets/aistudio/file_0000000063108211bead702fb91a015a_ccc1a723.png"
                  alt="Dazzlinglooks.in"
                  className="w-full h-full object-cover scale-[1.06]"
                />
              </div>
              <div>
                <h3 className="font-serif-editorial text-base font-bold leading-tight">
                  Dazzling Beauty AI
                </h3>
                <p className="text-[10px] text-[#E5D7C3]">
                  Your personal beauty shopping assistant
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#E5D7C3] hover:text-white p-1"
              aria-label="Close AI Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Banner when viewing a specific product */}
          {currentProductSlug && (
            <div className="bg-[#FCE8EE] px-3.5 py-1.5 text-[11px] text-[#B9124B] font-medium border-b border-[#E91E63]/20 flex items-center justify-between">
              <span className="truncate">Viewing product: {currentProductSlug.replace(/-/g, ' ')}</span>
              <button
                type="button"
                onClick={() => sendMessage('What are the ingredients in this product?')}
                className="underline font-semibold shrink-0 ml-2"
              >
                Ingredients?
              </button>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-[#FAF7F2]">
            {messages.map((msg) => (
              <div
                key={`float-${msg.id}`}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    msg.role === 'user'
                      ? 'bg-[#141110] text-white rounded-br-xs'
                      : 'bg-white text-[#231F1E] border border-[#E5D7C3] rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.role === 'user' ? <p>{msg.text}</p> : formatFormattedText(msg.text)}
                </div>

                {msg.role === 'assistant' &&
                  msg.recommendedProducts &&
                  msg.recommendedProducts.length > 0 && (
                    <div className="mt-2 w-full space-y-2">
                      {msg.recommendedProducts.slice(0, 2).map((prod) => (
                        <div
                          key={`float-${msg.id}-${prod.id}`}
                          className="bg-white rounded-xl border border-[#E5D7C3] p-2.5 flex items-center gap-2.5 shadow-2xs"
                        >
                          <img
                            src={prod.imageUrl}
                            alt={prod.shortTitle}
                            className="w-12 h-12 object-contain rounded bg-[#FAF7F2] p-0.5 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${prod.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="text-xs font-bold text-[#141110] hover:text-[#E91E63] line-clamp-1"
                            >
                              {prod.shortTitle}
                            </Link>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-bold text-[#141110]">
                                ₹{prod.price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-[#E91E63] font-semibold">
                                {prod.discountPercent}% OFF
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Link
                                to={`/product/${prod.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded border border-[#D8C7B4] text-[#231F1E]"
                              >
                                View Product
                              </Link>
                              <button
                                type="button"
                                onClick={() => addToCart(prod.id, prod.defaultSize, 1)}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#141110] text-white hover:bg-[#E91E63]"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {isLoading && (
              <div className="text-xs text-[#6E5F55] bg-white border border-[#E5D7C3] rounded-xl px-3 py-2 w-fit flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E91E63] animate-ping" />
                <span>Checking verified catalog...</span>
              </div>
            )}

            {error && (
              <div className="text-[11px] text-[#B9124B] bg-[#FCE8EE] rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Quick question pills */}
            <div className="pt-1 flex flex-wrap gap-1.5">
              {AI_SUGGESTED_QUESTIONS.slice(0, 5).map((q) => (
                <button
                  key={`chip-${q}`}
                  type="button"
                  onClick={() => sendMessage(q)}
                  disabled={isLoading}
                  className="text-[11px] bg-white hover:bg-[#FCE8EE] text-[#231F1E] hover:text-[#B9124B] border border-[#E5D7C3] rounded-full px-2.5 py-1 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-2.5 bg-white border-t border-[#E5D7C3] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Dazzling Beauty AI..."
              disabled={isLoading}
              className="flex-1 text-xs bg-[#FAF7F2] border border-[#D8C7B4] rounded-full px-3.5 py-2 focus:outline-none focus:border-[#E91E63]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-8 h-8 rounded-full bg-[#E91E63] hover:bg-[#C2185B] disabled:opacity-50 text-white flex items-center justify-center shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-[#141110] hover:bg-[#E91E63] text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-[0_8px_28px_rgba(20,17,16,0.3)] border border-[#C59B5F] transition-all cursor-pointer"
        >
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E91E63] to-[#C59B5F] flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </span>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>Dazzling Beauty AI</span>
              <Sparkles className="w-3 h-3 text-[#F3D19C]" />
            </div>
            <div className="text-[10px] text-[#E5D7C3] group-hover:text-white/90">
              Ask our Beauty Assistant
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
