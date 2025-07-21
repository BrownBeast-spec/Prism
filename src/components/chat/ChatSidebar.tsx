import { useState } from 'react';
import { Plus, MessageSquare, Upload, Search, Settings, ChevronLeft, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileUploadDialog } from './FileUploadDialog';

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  isPinned?: boolean;
  messageCount: number;
}

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId?: string;
}

export const ChatSidebar = ({ 
  isCollapsed, 
  onToggleCollapse, 
  onNewChat, 
  onSelectChat, 
  currentChatId 
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  
  // Mock chat sessions
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'RAG Document Analysis',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      messageCount: 5,
      isPinned: true
    },
    {
      id: '2',
      title: 'Claude.ai Interface Design',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      messageCount: 12
    },
    {
      id: '3',
      title: 'Vector Database Setup',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      messageCount: 8
    }
  ]);

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isCollapsed) {
    return (
      <div className="w-14 bg-sidebar-bg border-r border-border flex flex-col items-center py-4 space-y-4">
        <Button 
          onClick={onToggleCollapse}
          variant="ghost" 
          size="sm"
          className="w-8 h-8 claude-button"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button 
          onClick={onNewChat}
          variant="default" 
          size="sm"
          className="w-8 h-8 claude-button"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          onClick={() => setIsFileUploadOpen(true)}
          variant="ghost" 
          size="sm"
          className="w-8 h-8 claude-button"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="w-80 bg-sidebar-bg border-r border-border flex flex-col h-full sidebar-slide-in">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Prism RAG</h2>
            <Button 
              onClick={onToggleCollapse}
              variant="ghost" 
              size="sm"
              className="w-8 h-8 claude-button"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          {/* New Chat Button */}
          <Button 
            onClick={onNewChat}
            className="w-full mb-4 bg-primary hover:bg-primary/90 text-primary-foreground claude-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>

          {/* File Upload Button */}
          <Button 
            onClick={() => setIsFileUploadOpen(true)}
            variant="outline"
            className="w-full mb-4 claude-button"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectChat(session.id)}
                className={`p-3 rounded-lg cursor-pointer chat-item-hover ${
                  currentChatId === session.id ? 'bg-active-bg' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-text-primary truncate">
                      {session.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      {session.messageCount} messages • {formatTime(session.timestamp)}
                    </p>
                  </div>
                  {session.isPinned && (
                    <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start claude-button">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <FileUploadDialog 
        open={isFileUploadOpen}
        onOpenChange={setIsFileUploadOpen}
      />
    </>
  );
};