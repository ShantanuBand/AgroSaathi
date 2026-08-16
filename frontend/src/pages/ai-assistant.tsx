import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useListAiConversations, useSendAiMessage } from '@workspace/api-client-react';
import { Bot, Send, User, Sparkles, Loader2, ArrowRight, Plus } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function AiAssistantPage() {
  const { language } = useLanguage();
  const isMarathi = language === 'mr';

  const [message, setMessage] = React.useState('');
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  
  const { data: conversations } = useListAiConversations({ query: { queryKey: ['ai-conversations'] } });
  
  const [chatHistory, setChatHistory] = React.useState<{id: string, role: 'user'|'assistant', content: string, suggestions: string[]|null}[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: isMarathi 
        ? 'राम राम! मी तुमचा ॲग्रोसाथी AI कृषी मित्र आहे. मला पिकांवरील रोग, खते, बाजारभाव किंवा शासकीय योजनांबद्दल काहीही विचारा.' 
        : 'Ram Ram! I am your AgroSaathi AI Assistant. Ask me anything about crop diseases, market trends, farming techniques, or government schemes.',
      suggestions: isMarathi 
        ? ['गव्हाचा चालू बाजारभाव काय आहे?', 'टोमॅटोच्या पानांवर पिवळे डाग पडले तर काय करावे?', 'पीएम-किसान योजनेबद्दल माहिती सांगा'] 
        : ['What is the current price of Wheat?', 'How to treat yellow leaves on tomato plants?', 'Tell me about PM-Kisan scheme']
    }
  ]);

  React.useEffect(() => {
    if (chatHistory.length === 1 && chatHistory[0].id === 'welcome') {
      setChatHistory([
        {
          id: 'welcome',
          role: 'assistant',
          content: isMarathi 
            ? 'राम राम! मी तुमचा ॲग्रोसाथी AI कृषी मित्र आहे. मला पिकांवरील रोग, खते, बाजारभाव किंवा शासकीय योजनांबद्दल काहीही विचारा.' 
            : 'Ram Ram! I am your AgroSaathi AI Assistant. Ask me anything about crop diseases, market trends, farming techniques, or government schemes.',
          suggestions: isMarathi 
            ? ['गव्हाचा चालू बाजारभाव काय आहे?', 'टोमॅटोच्या पानांवर पिवळे डाग पडले तर काय करावे?', 'पीएम-किसान योजनेबद्दल माहिती सांगा'] 
            : ['What is the current price of Wheat?', 'How to treat yellow leaves on tomato plants?', 'Tell me about PM-Kisan scheme']
        }
      ]);
    }
  }, [language, isMarathi]);

  const sendMessage = useSendAiMessage();
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, sendMessage.isPending]);

  const handleSend = (text: string) => {
    if (!text.trim() || sendMessage.isPending) return;
    
    const newMsg = { id: Date.now().toString(), role: 'user' as const, content: text, suggestions: null };
    setChatHistory(prev => [...prev, newMsg]);
    setMessage('');
    
    sendMessage.mutate(
      { data: { message: text, conversationId, language } as any },
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
            content: isMarathi 
              ? 'माफ करा, शंका निवारण करण्यात अडचण येत आहे. कृपया पुन्हा प्रयत्न करा.' 
              : 'Sorry, I am having trouble connecting right now. Please try again.',
            suggestions: null
          }]);
        }
      }
    );
  };

  return (
    <AppLayout>
      <PageHeader 
        title={isMarathi ? 'AI कृषी मित्र' : 'AI Kisan Mitra'} 
        description={isMarathi ? 'तुमचा २४/७ AI कृषी सल्लागार. मराठी किंवा इंग्रजीत प्रश्न विचारा.' : 'Your 24/7 AI agricultural expert. Ask in English, Hindi, or Marathi.'}
        accentColor="border-cyan-500"
      />

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-[calc(100vh-260px)] min-h-[460px] sm:min-h-[550px]">
        <div className="hidden md:flex flex-col w-64 shrink-0 bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-800/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-cyan-200/60 dark:border-cyan-800/60 bg-cyan-100/40 dark:bg-cyan-900/30">
            <button 
              onClick={() => {
                setConversationId(null);
                setChatHistory([chatHistory[0]]);
              }}
              className="w-full flex items-center justify-center gap-2 bg-background border border-cyan-300 dark:border-cyan-700 hover:bg-muted py-2 rounded-xl text-sm font-semibold text-cyan-900 dark:text-cyan-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-cyan-600" /> {isMarathi ? 'नवीन संवाद' : 'New Chat'}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {Array.isArray(conversations) && conversations.map(conv => (
              <button 
                key={conv.id}
                onClick={() => setConversationId(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm truncate font-medium ${
                  conversationId === conv.id ? 'bg-cyan-500/20 text-cyan-950 dark:text-cyan-100 font-semibold' : 'text-cyan-900/80 dark:text-cyan-200/80 hover:bg-cyan-100/50'
                }`}
              >
                {conv.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-800/60 rounded-2xl overflow-hidden shadow-sm relative">
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
                  <span className="text-sm text-muted-foreground font-medium">
                    {isMarathi ? 'विचार करत आहे...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-background border-t border-border">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(message); }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isMarathi ? 'पिके, हवामान, शासकीय योजनांबद्दल विचारा...' : 'Ask about crops, weather, schemes...'}
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
              <Sparkles className="w-3 h-3 text-amber-500" /> {isMarathi ? 'AI कडून चुका होऊ शकतात. महत्त्वाची माहिती पडताळून पहा.' : 'AI can make mistakes. Verify important information.'}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
