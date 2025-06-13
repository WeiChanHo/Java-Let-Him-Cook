import React, { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import MessageList from './MessageList';
import './Chat.css';

const Chat: React.FC = () => {
    const { messages, addMessage } = useContext(ChatContext);

    const handleSendMessage = (content: string) => {
        addMessage(content, 'user');
    };

    return (
        <div className="chat-container">
            <MessageList messages={messages} />
            <input
                type="text"
                placeholder="Type a message..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                        handleSendMessage(e.currentTarget.value);
                        e.currentTarget.value = '';
                    }
                }}
            />
        </div>
    );
};

export default Chat;