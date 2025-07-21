import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { ContextPanel } from './ContextPanel';

export const ChatLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isContextPanelVisible, setIsContextPanelVisible] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string>('1');

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    // TODO: Initialize new chat in your state management
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // TODO: Load chat messages for selected chat
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 bg-background border-b border-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          {isSidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="claude-button"
              aria-label="Open sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-text-primary">Prism RAG</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsContextPanelVisible(!isContextPanelVisible)}
            className="claude-button hidden md:flex"
            aria-label="Toggle context panel"
          >
            Context
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          currentChatId={currentChatId}
        />

        {/* Chat Area */}
        <ChatArea currentChatId={currentChatId} />

        {/* Context Panel */}
        <ContextPanel isVisible={isContextPanelVisible} />
      </div>
    </div>
  );
};