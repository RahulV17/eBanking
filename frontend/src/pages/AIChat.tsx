import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  RiRobot2Line, 
  RiSparklingFill, 
  RiSendPlane2Fill, 
  RiUser3Line, 
  RiDeleteBinLine, 
  RiShieldCheckFill, 
  RiAlertLine,
  RiArrowRightLine, 
  RiRefreshLine,
  RiFileCopyLine,
  RiCheckLine,
  RiInformationLine
} from 'react-icons/ri';
import { useAIChat, useConsent } from '../hooks';
import { useAuthStore } from '../stores/authStore';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

const suggestedPrompts = [
  'What is my account balance?',
  'Show my recent transactions',
  'How do I create a savings account?',
  'What is my IFSC and branch name?',
  'How do I transfer funds via UPI?',
  'Are my deposits insured by RBI/DICGC?',
];

function parseInline(text: string) {
  const cleanText = text.replace(/\*{3,}(\d+)/g, '••••$1');
  const parts = cleanText.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-surface-muted border border-border text-xs font-mono text-[#CF9CCD]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#9067A7] shrink-0" />
              <span>{parseInline(trimmed.substring(2))}</span>
            </div>
          );
        }
        return <p key={idx}>{parseInline(line)}</p>;
      })}
    </div>
  );
}

export default function AIChat() {
  const { user } = useAuthStore();
  const { sendMessage } = useAIChat();
  const { getConsent, updateConsent } = useConsent();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content:
        'Hello! I am your eBanking AI assistant powered by Spring AI. How can I help you today? You can ask me about your balances, transactions, account status, or transfer instructions.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnablingConsent, setIsEnablingConsent] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideText) setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage.content);
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLastFailedQuery(null);
    } catch (err: any) {
      setLastFailedQuery(userMessage.content);
      const isTimeout =
        err?.message?.toLowerCase().includes('timeout') ||
        err?.message?.toLowerCase().includes('timed out');
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: isTimeout
          ? 'The AI model took longer than expected to generate a response. Please retry or ask a shorter question.'
          : (err?.message && err.message !== 'Failed to send message'
            ? err.message
            : 'Sorry, I am having trouble connecting right now. Please ensure the backend service is running and try again.'),
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (prompt: string) => {
    handleSend(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEnableConsent = async () => {
    if (!user?.email) {
      toast.error('User email not found. Please log in again.');
      return;
    }
    setIsEnablingConsent(true);
    try {
      const current = await getConsent(user.email);
      await updateConsent(user.email, {
        ...(current || {}),
        dataSharingConsent: true,
      });
      toast.success('AI data sharing enabled successfully');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content:
            'AI Assistant data sharing is now active. Feel free to re-ask your banking query.',
          timestamp: new Date(),
        },
      ]);
    } catch {
      toast.error('Could not auto-enable. Please toggle Data Sharing in your Profile.');
    } finally {
      setIsEnablingConsent(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content:
          'Chat history cleared. How can I assist you with your banking today?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto w-full">
      {/* Top Copilot Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9067A7] to-[#5F3A76] flex items-center justify-center text-white shadow-md border border-white/20">
            <RiRobot2Line className="text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-text-primary tracking-tight">AI Banking Copilot</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Model
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
              Context-aware financial advisor powered by Spring AI
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          title="Reset Conversation"
          className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer border border-transparent hover:border-border"
        >
          <RiDeleteBinLine className="text-lg" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isConsentPrompt =
              msg.role === 'assistant' &&
              (msg.content.includes("enable 'Data Sharing with Third Parties'") ||
                msg.content.includes('Profile privacy settings'));

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-surface-elevated border border-[#9067A7]/30 flex items-center justify-center shrink-0 mt-0.5 shadow-xs text-[#CF9CCD]">
                    <RiSparklingFill className="text-base" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3.5 shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#9067A7] to-[#7A4F94] text-white rounded-br-xs'
                      : msg.isError
                      ? 'bg-rose-500/10 border border-rose-500/25 text-rose-300 rounded-bl-xs'
                      : 'bg-surface-elevated border border-border/80 text-text-primary rounded-bl-xs'
                  }`}
                >
                  <FormattedMessage content={msg.content} />

                  {/* Retry Action */}
                  {msg.isError && lastFailedQuery && (
                    <button
                      onClick={() => handleSend(lastFailedQuery)}
                      disabled={isLoading}
                      className="mt-3 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RiRefreshLine className="text-xs" />
                      <span>Retry Query</span>
                    </button>
                  )}

                  {/* Privacy Consent Card */}
                  {isConsentPrompt && (
                    <div className="mt-3.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200">
                      <div className="flex items-center gap-2 mb-1 font-semibold text-amber-300 text-xs">
                        <RiAlertLine className="text-base shrink-0" />
                        <span>Privacy Authorization Required</span>
                      </div>
                      <p className="text-xs text-amber-200/80 mb-3 leading-relaxed">
                        To protect your financial security, third-party AI processing must be explicitly authorized.
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={handleEnableConsent}
                          disabled={isEnablingConsent}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {isEnablingConsent ? (
                            <>
                              <RiRefreshLine className="animate-spin text-xs" /> Enabling...
                            </>
                          ) : (
                            'Enable AI Data Sharing'
                          )}
                        </button>
                        <Link
                          to="/profile"
                          className="px-3 py-1.5 bg-surface-muted hover:bg-surface-elevated border border-border text-xs rounded-lg transition-colors text-text-secondary flex items-center gap-1"
                        >
                          <span>Open Profile</span>
                          <RiArrowRightLine className="text-xs" />
                        </Link>
                      </div>
                    </div>
                  )}

                  <p
                    className={`text-[10px] mt-1.5 text-right ${
                      msg.role === 'user' ? 'text-white/70' : 'text-text-tertiary'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-surface-muted border border-border flex items-center justify-center shrink-0 mt-0.5 text-text-secondary">
                    <RiUser3Line className="text-base" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Bubble */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-start"
          >
            <div className="w-8 h-8 rounded-xl bg-surface-elevated border border-[#9067A7]/30 flex items-center justify-center shrink-0 text-[#CF9CCD] shadow-xs">
              <RiSparklingFill className="text-base" />
            </div>
            <div className="bg-surface-elevated border border-border/80 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#9067A7] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[#9067A7] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[#9067A7] rounded-full animate-bounce [animation-delay:300ms]" />
                <span className="text-xs text-text-tertiary ml-2">Analyzing financial data...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Inquiries */}
      {messages.length <= 2 && !isLoading && (
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">
            Suggested Queries
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(prompt)}
                className="px-3 py-1.5 text-xs bg-surface-elevated hover:bg-surface-muted hover:border-[#9067A7]/50 border border-border/80 rounded-xl transition-all text-text-secondary hover:text-text-primary text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="relative flex items-center gap-2 bg-surface-elevated p-2 rounded-2xl border border-border/80 focus-within:border-[#9067A7]/60 shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about accounts, transactions, transfers, or banking rules..."
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none disabled:opacity-60"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="btn-primary h-10 px-4 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isLoading ? (
            <RiRefreshLine className="animate-spin text-lg text-white" />
          ) : (
            <RiSendPlane2Fill className="text-base text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
