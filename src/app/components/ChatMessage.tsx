import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
  children?: React.ReactNode;
}

export function ChatMessage({ message, sender, timestamp, children }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${sender === 'user' ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        sender === 'bot' 
          ? 'bg-gradient-to-br from-primary to-accent text-white' 
          : 'bg-secondary text-white'
      }`}>
        {sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>
      
      <div className={`flex-1 max-w-[75%] ${sender === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          sender === 'bot'
            ? 'bg-card border border-border shadow-sm'
            : 'bg-gradient-to-r from-primary to-accent text-white'
        }`}>
          <p className="whitespace-pre-wrap">{message}</p>
          {children}
        </div>
        {timestamp && (
          <p className="text-xs text-muted-foreground mt-1 px-2">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
