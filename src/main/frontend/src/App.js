import React, { useState, useEffect } from 'react';

function LoginModal({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username || !password) {
      setError('請填寫所有欄位');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (isLogin) {
      if (users[username] && users[username].password === password) {
        onLogin(username);
      } else {
        setError('用戶名或密碼錯誤');
      }
    } else {
      if (users[username]) {
        setError('用戶名已存在');
      } else {
        users[username] = { password };
        localStorage.setItem('users', JSON.stringify(users));
        setSuccess('註冊成功！請登入');
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="login-modal">
      <div className="login-form">
        <h2 id="formTitle">{isLogin ? '登入' : '註冊'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用戶名稱</label>
            <input id="username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">密碼</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="login-button">{isLogin ? '登入' : '註冊'}</button>
          {error && <div className="error-message" style={{display:'block'}}>{error}</div>}
          {success && <div className="success-message" style={{display:'block'}}>{success}</div>}
          <a href="#" className="switch-mode" onClick={e => { e.preventDefault(); setIsLogin(!isLogin); }}>{isLogin ? '還沒有帳號？註冊' : '已有帳號？登入'}</a>
        </form>
      </div>
    </div>
  );
}

function Message({ msg, onSelectRecipe }) {
  return (
    <div className={`message ${msg.sender}`}> 
      <div className="message-avatar"><span>{msg.sender === 'user' ? 'You' : 'AI'}</span></div>
      <div className="message-content" onClick={() => msg.recipe && onSelectRecipe(msg.recipe)}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="message-avatar"><span>AI</span></div>
      <div>
        <span>AI is typing</span>
        <div className="typing-dots">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );
}

function Popup({ recipe, onClose }) {
  if (!recipe) return null;
  return (
    <div className="popup-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-title">
            <div className="ai-icon">AI</div>
            AI Response
          </div>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="popup-message">
          <div className="recipe-container">
            {recipe.image && <img src={recipe.image} alt={recipe.title} className="recipe-image" />}
            <div className="recipe-title">{recipe.title}</div>
            <div className="recipe-description">{recipe.description}</div>
            <div className="recipe-meta">
              <div className="recipe-meta-item"><span>⏱️</span><span><strong>Prep:</strong> {recipe.prepTime}</span></div>
              <div className="recipe-meta-item"><span>🍳</span><span><strong>Cook:</strong> {recipe.cookTime}</span></div>
              <div className="recipe-meta-item"><span>👥</span><span><strong>Serves:</strong> {recipe.servings}</span></div>
            </div>
            {recipe.ingredients && (
              <div className="recipe-section">
                <h3>📋 Ingredients</h3>
                <ul>{recipe.ingredients.map((i,idx) => <li key={idx}>{i}</li>)}</ul>
              </div>
            )}
            {recipe.instructions && (
              <div className="recipe-section">
                <h3>👨‍🍳 Instructions</h3>
                <ul className="recipe-steps">{recipe.instructions.map((s,idx) => <li key={idx}>{s}</li>)}</ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupRecipe, setPopupRecipe] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('currentUser');
    if (storedName) {
      setUsername(storedName);
      setLoggedIn(true);
      const history = JSON.parse(localStorage.getItem('chat_' + storedName) || '[]');
      setMessages(history);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem('chat_' + username, JSON.stringify(messages));
    }
  }, [messages, loggedIn, username]);

  const handleLogin = (name) => {
    setUsername(name);
    setLoggedIn(true);
    localStorage.setItem('currentUser', name);
    const history = JSON.parse(localStorage.getItem('chat_' + name) || '[]');
    setMessages(history);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setMessages(m => [...m, { sender: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/recipe_agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text })
      });
      const resText = await res.text();
      let data;
      try { data = JSON.parse(resText); } catch { data = { text: resText }; }
      const aiMsg = {
        sender: 'ai',
        content: data.text || resText,
        recipe: data.recipes ? data.recipes[0] : null
      };
      setMessages(m => [...m, aiMsg]);
    } catch (err) {
      setMessages(m => [...m, { sender: 'ai', content: 'Error: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      {!loggedIn && <LoginModal onLogin={handleLogin} />}
      <div className="chat-container" style={{display: loggedIn ? 'flex' : 'none'}}>
        <div className="chat-header">
          <div className="user-info">
            <span>👋 <span id="userDisplayName">{username}</span></span>
            <button className="logout-button" onClick={handleLogout}>登出</button>
          </div>
          <h1>AI Master Chef</h1>
          <p>AI 廚神</p>
          <div className="status-dot"></div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍳</div>
              <p>哈囉!我是你的AI廚神~<br/>告訴我你有什麼食材，我會給你推薦食譜</p>
            </div>
          ) : (
            messages.map((m,i) => <Message key={i} msg={m} onSelectRecipe={setPopupRecipe} />)
          )}
        </div>

        {loading && <TypingIndicator />}

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              className="chat-input"
              placeholder="Type your message here..."
              rows={1}
              maxLength={1000}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="send-button" onClick={sendMessage} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {popupRecipe && <Popup recipe={popupRecipe} onClose={() => setPopupRecipe(null)} />}
    </div>
  );
}
