'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openChat: (initialMessage?: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = useCallback((initialMessage?: string) => {
    setIsOpen(true);
    // Logic to handle initial message could be added here if we move message state here
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, setIsOpen, openChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
