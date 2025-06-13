import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

function ChatContainer({ currentUser, onLogout, messages, onSendMessage, isAIResponding, onShowRecipe }) {
    return (
        <div className="chat-container">
            <ChatHeader
                username={currentUser.username}
                onLogout={onLogout}
            />
            <ChatMessages
                messages={messages}
                currentUser={currentUser}
                isAIResponding={isAIResponding}
                onShowRecipe={onShowRecipe}
            />
            <ChatInput
                onSendMessage={onSendMessage}
                isAIResponding={isAIResponding}
            />
        </div>
    );
}

export default ChatContainer;