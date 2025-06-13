// src/types/index.ts

export interface Message {
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    recipeData?: any; // Adjust the type as needed
}

export interface ChatContextType {
    messages: Message[];
    addMessage: (content: string, sender: 'user' | 'ai', recipeData?: any) => void;
    saveChatHistory: () => void;
    loadChatHistory: () => void;
}