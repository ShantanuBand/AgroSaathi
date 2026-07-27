import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useListAiConversations, useSendAiMessage } from '@workspace/api-client-react';
import { Bot, Send, User, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { formatDateTime } from '@/lib/format';

export default function AiAssistantPage() {
  const [message, setMessage] = React.useState('');
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  
  const { data: conversations } = useListAiConversations({ query: { queryKey: ['ai-conversations'] } });
  
  // Local state for chat history to make it feel instant while API responds
  const [chatHistory, setChatHistory] = React.useState<{id: string, role: 'user'|'assistant', content: string, suggestions: string[]|null}[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Ram Ram! I am your AgroSaathi AI Assistant. Ask me anything about crop diseases, market trends, farming techniques, or government schemes.',
      suggestions: ['What is the current price of Wheat?', 'How to treat yellow leaves on tomato plants?', 'Tell me about PM-Kisan scheme']
    }
  ]);

  const sendMessage = useSendAiMessage();
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, sendMessage.isPending]);

  const handleSend = (text: string) => {
    if (!text.trim() || sendMessage.isPending) return;
    
    // Add user message to UI immediately
    const newMsg = { id: Date.now().toString(), role: 'user' as const, content: text, suggestions: null };
    setChatHistory(prev => [...prev, newMsg]);
    setMessage('');
    
    sendMessage.mutate(
      { data: { message: text, conversationId } },
      {
        onSuccess: (response) => {
          if (!conversationId && response.conversationId) {
            setConversationId(response.conversationId);
          }
          setChatHistory(prev => [...prev, {
            id: response.id,
            role: response.role,
            content: response.content,
            suggestions: response.suggestions
          }]);
        },
        onError: () => {
          setChatHistory(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Sorry, I am having trouble connecting right now. Please try again.',
            suggestions: null
          }]);
        }
      }
    );
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Krishi Mitra AI" 
        description="24/7 expert advice for your farming queries."
      />

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        {/* Sidebar History - Hidden on mobile unless toggled (simplified for now) */}
        <div className="hidden md:flex flex-col w-64 shrink-0 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <button 
              onClick={() => {
                setConversationId(null);
                setChatHistory([chatHistory[0]]);
              }}
              className="w-full flex items-center justify-center gap-2 bg-background border border-input hover:bg-muted py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations?.map(conv => (
              <button 
                key={conv.id}
                onClick={() => setConversationId(conv.id)}
                className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-colors ${
                  conversationId === conv.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                }`}
              >
                <div className="truncate mb-1">{conv.title}</div>
                <div className="text-xs text-muted-foreground">{formatDateTime(conv.createdAt)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'assistant' 
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                
                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted/50 text-foreground border border-border rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(suggestion)}
                          className="text-xs font-medium px-3 py-1.5 bg-background border border-primary/20 text-primary rounded-full hover:bg-primary/10 hover:border-primary transition-colors flex items-center gap-1"
                        >
                          {suggestion} <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {sendMessage.isPending && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-1 shadow-sm shadow-primary/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-muted/50 border border-border rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background border-t border-border">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(message); }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about crops, weather, schemes..."
                className="w-full bg-card border border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-full py-3.5 pl-5 pr-14 outline-none transition-all shadow-sm"
                disabled={sendMessage.isPending}
              />
              <button
                type="submit"
                disabled={!message.trim() || sendMessage.isPending}
                className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors shadow-sm"
              >
                <Send className="w-4 h-4 translate-x-px" />
              </button>
            </form>
            <div className="text-center mt-2 text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> AI can make mistakes. Verify important information.
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Need to import Plus locally for this file
import { Plus } from 'lucide-react';
