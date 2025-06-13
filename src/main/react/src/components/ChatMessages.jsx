import React, { useEffect, useRef } from 'react';

function Message({ message, onShowRecipe }) {
    const { content, sender, recipeData } = message;
    const isUser = sender === 'user';

    const handleContentClick = () => {
        if (sender === 'ai' && recipeData) {
            onShowRecipe(recipeData);
        }
    };

    return (
        <div className={`message ${sender}`}>
            <div className="message-avatar">
                <span>{isUser ? 'You' : 'AI'}</span>
            </div>
            <div
                className="message-content"
                data-has-recipe={sender === 'ai' && !!recipeData}
                onClick={handleContentClick}
                dangerouslySetInnerHTML={{ __html: content }} // Assuming content is pre-escaped HTML
            >
            </div>
        </div>
    );
}

function ChatMessages({ messages, currentUser, isAIResponding, onShowRecipe }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAIResponding]); // Scroll when new messages or typing indicator changes

    return (
        <div className="chat-messages">
            {messages.length === 0 && !isAIResponding && (
                <div className="empty-state">
                    <div className="empty-state-icon">🍳</div>
                    <p>
                        {currentUser ? `歡迎回來, ${currentUser.username}!` : "哈囉!我是你的AI廚神~"}
                        <br />
                        告訴我你有什麼食材，我會給你推薦食譜
                    </p>
                </div>
            )}
            {messages.map((msg) => (
                <Message key={msg.id} message={msg} onShowRecipe={onShowRecipe} />
            ))}
            {isAIResponding && (
                <div className="typing-indicator" style={{ display: 'flex' }}>
                    <div className="message-avatar">
                        <span>AI</span>
                    </div>
                    <div>
                        <span>AI is typing</span>
                        <div className="typing-dots">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default ChatMessages;