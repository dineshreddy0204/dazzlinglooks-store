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
  Check,
} from 'lucide-react';
import { Product, AI_SUGGESTED_QUESTIONS, INITIAL_PRODUCTS } from '../data/sampleData';
import { useStore } from '../context/StoreContext';
import { LuxuryReveal } from './LuxuryMotion';

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

// Shared in-memory session storage so conversation context persists across pages
let sessionMessagesCache: AIChatMessage[] = [INITIAL_ASSISTANT_MESSAGE];
let unreadReplyFlag = false;
const listeners = new Set<() => void>();

function updateSharedMessages(next: AIChatMessage[], markUnread = false) {
  sessionMessagesCache = next;
  if (markUnread) unreadReplyFlag = true;
  listeners.forEach((fn) => fn());
}

function clearUnreadFlag() {
  if (unreadReplyFlag) {
    unreadReplyFlag = false;
    listeners.forEach((fn) => fn());
  }
}

function useSharedAIChat() {
  const [messages, setMessages] = useState<AIChatMessage[]>(sessionMessagesCache);
  const [hasUnread, setHasUnread] = useState<boolean>(unreadReplyFlag);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const listener = () => {
      setMessages([...sessionMessagesCache]);
      setHasUnread(unreadReplyFlag);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const currentProductSlug = location.pathname.startsWith('/product/')
    ? location.pathname.replace('/product/', '').split('/')[0]
    : undefined;

  const sendMessage = async (rawQuestion: string, isFromFloatingOpen = true) => {
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
    updateSharedMessages(updatedWithUser, false);
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

      updateSharedMessages([...updatedWithUser, assistantMsg], !isFromFloatingOpen);
    } catch (err: any) {
      setError(err?.message || 'Unable to connect right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setError(null);
    clearUnreadFlag();
    updateSharedMessages([INITIAL_ASSISTANT_MESSAGE], false);
  };

  return {
    messages,
    hasUnread,
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
  const [addedProdId, setAddedProdId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input, true);
    setInput('');
  };

  const handleAddInlineProduct = (prod: Product) => {
    addToCart(prod.id, prod.defaultSize, 1);
    setAddedProdId(prod.id);
    window.setTimeout(() => {
      setAddedProdId((prev) => (prev === prod.id ? null : prev));
    }, 1100);
  };

  return (
    <LuxuryReveal className="max-w-[1380px] mx-auto px-3 sm:px-6 py-8 sm:py-10">
      <section
        id="dazzling-beauty-ai"
        className="relative rounded-2xl border border-[#E5D7C3] bg-gradient-to-br from-[#FFFDF9] via-[#FAF5ED] to-[#FCE8EE]/45 shadow-[0_12px_36px_rgba(20,17,16,0.06)] overflow-hidden"
      >
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
                Your personal beauty shopping assistant — Powered by Gemini &amp; verified Dazzlinglooks.in catalog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={resetChat}
              className="lux-btn inline-flex items-center gap-1.5 text-xs text-[#E5D7C3] hover:text-white border border-[#C59B5F]/40 hover:border-[#C59B5F] rounded-full px-3.5 py-1.5 cursor-pointer"
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
                <Sparkles className="w-3.5 h-3.5 text-[#E91E63]" /> Ask About Products, Routines &amp; Store
              </p>
              <p className="text-xs text-[#5E524B] mb-4 leading-relaxed">
                Click any prompt below or type your own question to get instant recommendations grounded in real prices, ingredients, and Rajahmundry store stock:
              </p>

              <div className="flex flex-wrap lg:flex-col gap-2">
                {AI_SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q, true)}
                    disabled={isLoading}
                    className="lux-btn text-left text-xs font-medium px-3.5 py-2 rounded-xl bg-white hover:bg-[#FCE8EE] text-[#231F1E] hover:text-[#B9124B] border border-[#E5D7C3] hover:border-[#E91E63]/50 flex items-center justify-between gap-2 group disabled:opacity-50 cursor-pointer"
                  >
                    <span>{q}</span>
                    <span className="text-[#C59B5F] group-hover:text-[#E91E63] group-hover:translate-x-0.5 transition-transform shrink-0">
                      →
                    </span>
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
                  className={`lux-msg-enter flex flex-col ${
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
                        {msg.recommendedProducts.map((prod) => {
                          const isAdded = addedProdId === prod.id;
                          return (
                            <div
                              key={`${msg.id}-${prod.id}`}
                              className="lux-card bg-white rounded-xl border border-[#E5D7C3] p-3 flex gap-3 items-center shadow-xs hover:border-[#C59B5F]"
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
                                    className="lux-btn inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#D8C7B4] text-[#231F1E] hover:bg-[#FAF6F0]"
                                  >
                                    <Eye className="w-3 h-3" /> View Product
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => handleAddInlineProduct(prod)}
                                    className={`lux-btn inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md text-white cursor-pointer ${
                                      isAdded
                                        ? 'bg-[#16A34A]'
                                        : 'bg-[#141110] hover:bg-[#E91E63]'
                                    }`}
                                  >
                                    {isAdded ? (
                                      <>
                                        <Check className="w-3 h-3" /> Added
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingCart className="w-3 h-3" /> Add to Cart
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                            className="lux-btn inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-[#FCE8EE] text-[#C2185B] hover:bg-[#E91E63] hover:text-white"
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
                <div className="lux-msg-enter flex items-center gap-2.5 text-xs text-[#6E5F55] bg-[#FAF6F0] border border-[#E5D7C3] rounded-2xl px-4 py-3 w-fit">
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
                <div className="lux-msg-enter flex items-center gap-2 text-xs text-[#B9124B] bg-[#FCE8EE] border border-[#E91E63]/30 rounded-xl px-4 py-2.5">
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
                className="flex-1 bg-white border border-[#D8C7B4] focus:border-[#E91E63] rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#141110] placeholder-[#8C7B70] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="lux-btn inline-flex items-center gap-1.5 bg-[#E91E63] hover:bg-[#C2185B] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-xs cursor-pointer"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </LuxuryReveal>
  );
};

export const DazzlingBeautyFloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, hasUnread, isLoading, error, sendMessage, currentProductSlug } =
    useSharedAIChat();
  const { addToCart } = useStore();
  const [input, setInput] = useState('');
  const [addedProdId, setAddedProdId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      clearUnreadFlag();
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messages, isLoading, isOpen]);

  // Keyboard Escape support for accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input, true);
    setInput('');
  };

  const handleQuickAdd = (prod: Product) => {
    addToCart(prod.id, prod.defaultSize, 1);
    setAddedProdId(prod.id);
    window.setTimeout(() => {
      setAddedProdId((prev) => (prev === prod.id ? null : prev));
    }, 1100);
  };

  // Genuine contextual notification badge when viewing a product page or unread reply exists
  const showGenuineNotification = Boolean(hasUnread || currentProductSlug);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-3.5 sm:right-6 z-40">
      {isOpen ? (
        <div
          role="dialog"
          aria-label="Dazzling Beauty AI Shopping Assistant"
          className="lux-modal-enter w-[335px] sm:w-[395px] h-[490px] max-h-[calc(100vh-115px)] rounded-2xl bg-[#FFFDF9] border border-[#C59B5F] shadow-[0_20px_50px_rgba(20,17,16,0.28)] flex flex-col overflow-hidden"
        >
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
              className="text-[#E5D7C3] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C59B5F]"
              aria-label="Close AI Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Banner when viewing a specific product */}
          {currentProductSlug && (
            <div className="bg-[#FCE8EE] px-3.5 py-1.5 text-[11px] text-[#B9124B] font-medium border-b border-[#E91E63]/20 flex items-center justify-between">
              <span className="truncate">
                Viewing: {currentProductSlug.replace(/-/g, ' ')}
              </span>
              <button
                type="button"
                onClick={() => sendMessage('What are the ingredients in this product?', true)}
                className="underline font-semibold shrink-0 ml-2 cursor-pointer"
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
                className={`lux-msg-enter flex flex-col ${
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
                      {msg.recommendedProducts.slice(0, 2).map((prod) => {
                        const isAdded = addedProdId === prod.id;
                        return (
                          <div
                            key={`float-${msg.id}-${prod.id}`}
                            className="lux-card bg-white rounded-xl border border-[#E5D7C3] p-2.5 flex items-center gap-2.5 shadow-2xs"
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
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded border border-[#D8C7B4] text-[#231F1E] hover:bg-[#FAF6F0]"
                                >
                                  View Product
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdd(prod)}
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white transition cursor-pointer ${
                                    isAdded ? 'bg-[#16A34A]' : 'bg-[#141110] hover:bg-[#E91E63]'
                                  }`}
                                >
                                  {isAdded ? 'Added ✓' : 'Add to Cart'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}

            {isLoading && (
              <div className="lux-msg-enter text-xs text-[#6E5F55] bg-white border border-[#E5D7C3] rounded-xl px-3 py-2 w-fit flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E91E63] animate-ping" />
                <span>Checking verified catalog...</span>
              </div>
            )}

            {error && (
              <div className="lux-msg-enter text-[11px] text-[#B9124B] bg-[#FCE8EE] rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Quick question pills */}
            <div className="pt-1 flex flex-wrap gap-1.5">
              {AI_SUGGESTED_QUESTIONS.slice(0, 5).map((q) => (
                <button
                  key={`chip-${q}`}
                  type="button"
                  onClick={() => sendMessage(q, true)}
                  disabled={isLoading}
                  className="lux-btn text-[11px] bg-white hover:bg-[#FCE8EE] text-[#231F1E] hover:text-[#B9124B] border border-[#E5D7C3] rounded-full px-2.5 py-1 cursor-pointer"
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
              ref={inputRef}
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
              className="lux-btn w-8 h-8 rounded-full bg-[#E91E63] hover:bg-[#C2185B] disabled:opacity-50 text-white flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="relative inline-block">
          {/* Occasional soft champagne-pink halo (pulses gently once every 8.5s) */}
          <span
            aria-hidden="true"
            className="lux-ai-halo absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#C59B5F]/45 via-[#E91E63]/35 to-[#C59B5F]/45 blur-md"
          />

          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              clearUnreadFlag();
            }}
            aria-label="Open Dazzling Beauty AI Shopping Assistant"
            className="lux-ai-launcher-idle lux-btn relative group flex items-center gap-2.5 bg-[#141110] hover:bg-[#241E1C] text-white pl-2.5 pr-4 py-2 rounded-full shadow-[0_10px_28px_rgba(20,17,16,0.28)] border border-[#C59B5F] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E91E63]"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#C59B5F] bg-[#FAF7F2] shrink-0">
              <img
                src="/assets/aistudio/file_0000000063108211bead702fb91a015a_ccc1a723.png"
                alt="Dazzling Beauty AI"
                className="w-full h-full object-cover scale-[1.06]"
              />
              {showGenuineNotification && (
                <span
                  title="Product insights available"
                  className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#E91E63] ring-2 ring-[#141110]"
                />
              )}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight flex items-center gap-1">
                <span>Dazzling Beauty AI</span>
                <Sparkles className="w-3 h-3 text-[#F3D19C]" />
              </div>
              <div className="text-[10px] text-[#E5D7C3] group-hover:text-white/95 flex items-center gap-1">
                <MessageCircle className="w-2.5 h-2.5 text-[#E91E63]" />
                <span>{currentProductSlug ? 'Ask about this product' : 'Beauty Assistant'}</span>
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
