import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Chat from './components/Chat/Chat';

const App: React.FC = () => {
    return (
        <ChatProvider>
            <Chat />
        </ChatProvider>
    );
};

export default App;