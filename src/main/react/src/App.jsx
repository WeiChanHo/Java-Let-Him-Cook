import React, { useState, useEffect, useRef } from 'react';
import LoginModal from './components/LoginModal';
import ChatContainer from './components/ChatContainer';
import PopupOverlay from './components/PopupOverlay';

// Helper function (can be moved to a utils.js file)
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

function App() {
    const [messages, setMessages] = useState([]);
    const [isAIResponding, setIsAIResponding] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // { username: 'demo' }
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [popupRecipeData, setPopupRecipeData] = useState(null);

    // Simulated user data and chat history (replace with actual backend calls)
    const [users, setUsers] = useState(() => {
        // Load from localStorage or initialize
        const savedUsers = localStorage.getItem('chatAppUsers');
        return savedUsers ? JSON.parse(savedUsers) : { 'demo': { username: 'demo', password: 'demo123' } };
    });

    const [chatHistory, setChatHistory] = useState(() => {
        const savedHistory = localStorage.getItem('chatAppHistory');
        return savedHistory ? JSON.parse(savedHistory) : {};
    });

    useEffect(() => {
        localStorage.setItem('chatAppUsers', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('chatAppHistory', JSON.stringify(chatHistory));
    }, [chatHistory]);

    // Load user's chat history when currentUser changes
    useEffect(() => {
        if (currentUser && chatHistory[currentUser.username]) {
            setMessages(chatHistory[currentUser.username]);
        } else if (currentUser) {
            setMessages([]); // Start with empty messages for new user history
        }
    }, [currentUser, chatHistory]);

    const saveCurrentChatHistory = (updatedMessages) => {
        if (currentUser) {
            setChatHistory(prevHistory => ({
                ...prevHistory,
                [currentUser.username]: updatedMessages
            }));
        }
    };
    
    const handleLogin = (username, password) => {
        if (users[username] && users[username].password === password) {
            setCurrentUser(users[username]);
            return { success: true };
        }
        return { success: false, message: '用戶名或密碼錯誤' };
    };

    const handleRegister = (username, password) => {
        if (users[username]) {
            return { success: false, message: '用戶名已存在' };
        }
        setUsers(prevUsers => ({ ...prevUsers, [username]: { username, password } }));
        setChatHistory(prevHistory => ({ ...prevHistory, [username]: [] }));
        return { success: true, message: '註冊成功！請登入' };
    };

    const handleLogout = () => {
        saveCurrentChatHistory(messages); // Save before logging out
        setCurrentUser(null);
        setMessages([]);
    };

    const addMessage = (content, sender, recipeData = null) => {
        const newMessage = {
            id: Date.now() + Math.random(), // Unique ID for key prop
            content: escapeHtml(content),
            sender,
            timestamp: new Date(),
            recipeData
        };
        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages, newMessage];
            saveCurrentChatHistory(updatedMessages);
            return updatedMessages;
        });

    };

    const simulateAIResponse = (userMessage) => {
        setIsAIResponding(true);
        // Simulate AI processing time
        setTimeout(() => {
            const aiResponseData = generateAIResponse(userMessage);
            addMessage(aiResponseData.text, 'ai', aiResponseData.recipe);
            setIsAIResponding(false);
        }, Math.random() * 2000 + 1000); // 1-3 seconds delay
    };

    const generateAIResponse = (userMessage) => {
        // Fixed reply content, actual AI reply will be done on the backend
        return {
            text: `收到您的訊息: "${userMessage}". 這是一個罐頭回覆。`,
            recipe: {
                title: "測試食譜",
                image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop",
                description: "這是一個AI生成的美味食譜範例，點擊查看詳細做法。",
                prepTime: "15 分鐘",
                cookTime: "30 分鐘",
                servings: "4 人份",
                ingredients: [
                    "1 磅 雞胸肉, 切塊",
                    "1 顆 洋蔥, 切碎",
                    "2 瓣 大蒜, 切末",
                    "1 罐 (14.5盎司) 番茄丁",
                    "1 杯 雞高湯",
                    "1 茶匙 辣椒粉",
                    "鹽和胡椒粉 適量",
                    "2 湯匙 橄欖油"
                ],
                instructions: [
                    "在鍋中加熱橄欖油，加入雞肉煎至金黃。",
                    "加入洋蔥和大蒜，炒香。",
                    "倒入番茄丁和雞高湯，加入辣椒粉、鹽和胡椒粉調味。",
                    "煮沸後轉小火，蓋上鍋蓋燉煮20分鐘，或直到雞肉熟透。",
                    "即可享用！"
                ]
            }
        };
    };
    
    const handleSendMessage = (messageText) => {
        if (!messageText.trim() || isAIResponding) return;
        addMessage(messageText, 'user');
        simulateAIResponse(messageText);
    };

    const handleShowRecipePopup = (recipe) => {
        setPopupRecipeData(recipe);
        setShowPopup(true);
        document.body.style.overflow = 'hidden';
    };

    const handleHidePopup = () => {
        setShowPopup(false);
        setPopupRecipeData(null);
        document.body.style.overflow = 'auto';
    };

    useEffect(() => {
        const handleEsc = (event) => {
           if (event.key === 'Escape') {
            handleHidePopup();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
           window.removeEventListener('keydown', handleEsc);
        };
    }, []);


    if (!currentUser) {
        return (
            <LoginModal
                onLogin={handleLogin}
                onRegister={handleRegister}
                isLoginMode={isLoginMode}
                setIsLoginMode={setIsLoginMode}
            />
        );
    }

    return (
        <>
            <ChatContainer
                currentUser={currentUser}
                onLogout={handleLogout}
                messages={messages}
                onSendMessage={handleSendMessage}
                isAIResponding={isAIResponding}
                onShowRecipe={handleShowRecipePopup}
            />
            {showPopup && popupRecipeData && (
                <PopupOverlay recipeData={popupRecipeData} onClose={handleHidePopup} />
            )}
        </>
    );
}

export default App;