import { useState } from 'react';
import { Brain, Send, Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
  'How should I adjust today\'s workout based on my readiness score?',
  'What high-protein meal should I eat post-workout?',
  'Am I recovering properly from my current training load?',
  'I only have 30 minutes today — how should I modify my session?',
];

export default function AICoach() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      content: {
        message: 'Hello! I am your KINETIQ Intelligence Coach. I am connected directly to your Readiness Score, Training Load, and Nutrition Adherence metrics. How can I help you optimize your athletic performance today?',
        actionItems: ['Review your Readiness Score on the Dashboard', 'Ensure 150g target protein is logged today'],
      },
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (questionText) => {
    const query = questionText || input;
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/coach', { history: newMessages });
      setMessages((prev) => [...prev, { sender: 'ai', content: res.data.response }]);
    } catch (err) {
      toast.error('AI Coach request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-120px)]">
      {/* Header Banner */}
      <div className="card-surface p-4 flex items-center justify-between border border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center">
            <Brain className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
              KINETIQ AI Intelligence Coach
            </h1>
            <p className="text-xs text-text-muted">Live Context Connected • Engine 1 & Engine 2 Active</p>
          </div>
        </div>
        <Badge variant="success">Online</Badge>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xl p-4 rounded-[var(--radius-lg)] text-sm space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-accent text-white rounded-br-none'
                  : 'bg-bg-surface border border-border text-text-primary rounded-bl-none'
              }`}
            >
              {typeof msg.content === 'string' ? (
                <p className="leading-relaxed">{msg.content}</p>
              ) : (
                <div className="space-y-3">
                  <p className="leading-relaxed">{msg.content.message}</p>
                  {msg.content.actionItems?.length > 0 && (
                    <div className="pt-2 border-t border-border/40 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">Recommended Actions</span>
                      {msg.content.actionItems.map((act, aIdx) => (
                        <p key={aIdx} className="text-xs flex items-center gap-1.5 text-text-secondary">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                          {act}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-4 bg-bg-surface border border-border rounded-[var(--radius-lg)] text-xs text-text-muted flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent animate-spin" />
              KINETIQ AI is analyzing your live performance metrics...
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-bg-surface border border-border text-xs text-text-secondary hover:text-text-primary hover:bg-bg-surface-alt transition-colors shrink-0 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your coach anything..."
          className="flex-1 bg-bg-surface border border-border rounded-[var(--radius-md)] px-4 py-3 text-sm text-text-primary outline-none focus:border-accent"
        />
        <Button type="submit" loading={loading}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
