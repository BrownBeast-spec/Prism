import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatAreaProps {
  currentChatId?: string;
}

export const ChatArea = ({ currentChatId }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your RAG assistant. I can help you analyze uploaded documents and answer questions based on their content. Upload some files to get started!',
      role: 'assistant',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call with streaming response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Simulate streaming response
      const responseText = `I understand you're asking about "${userMessage.content}". Based on the uploaded documents in the vector database, I can help you find relevant information. However, I notice you haven't uploaded any documents yet. Please use the "Upload Files" button in the sidebar to add documents that I can analyze and reference in my responses.`;
      
      let currentText = '';
      const words = responseText.split(' ');
      
      words.forEach((word, index) => {
        setTimeout(() => {
          currentText += (index > 0 ? ' ' : '') + word;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: currentText, isStreaming: index < words.length - 1 }
              : msg
          ));
          
          if (index === words.length - 1) {
            setIsLoading(false);
          }
        }, index * 50);
      });
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 bg-chat-bg flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-border p-4 bg-background">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              P
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Prism RAG Assistant</h2>
            <p className="text-xs text-text-muted">Powered by DataStax Vector Store & Llama-3</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 message-enter ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className={`text-sm ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {message.role === 'user' ? 'U' : 'AI'}
                </AvatarFallback>
              </Avatar>

              <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  message.role === 'user' 
                    ? 'user-message' 
                    : 'assistant-message'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                    {message.isStreaming && (
                      <span className="typewriter ml-1">|</span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-text-muted mt-1 px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {isLoading && !messages.some(m => m.isStreaming) && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="assistant-message px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Ask me anything about your uploaded documents..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] max-h-[200px] pr-12 resize-none border-input focus:border-primary"
              disabled={isLoading}
            />
            
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="h-8 w-8 p-0 claude-button"
              >
                {isLoading ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{inputValue.length}/4000</span>
          </div>
        </div>
      </div>
    </div>
  );
};