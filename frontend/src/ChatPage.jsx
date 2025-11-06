import React, { useState, useRef, useEffect } from "react";
import API_BASE_URL from "./apiConfig";
import { useNavigate } from "react-router-dom";
import "./ChatPage.css";

const ChatPage = () => {
  const [chats, setChats] = useState([
    { 
      id: 1, 
      name: "Welcome Chat", 
      messages: [
        { 
          sender: "ai", 
          text: "Hello! I'm Cura AI. How can I assist you today?",
          timestamp: new Date()
        }
      ],
      createdAt: new Date()
    }
  ]);
  const [activeChat, setActiveChat] = useState(1);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("patient");
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        setCurrentUser(null);
      }
    }
  }, []);

  // Load conversation history for logged-in user
  useEffect(() => {
    const loadHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const resp = await fetch(`${API_BASE_URL}/api/ask/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        if (!resp.ok) {
          console.warn("Failed to load history", resp.status);
          return;
        }
        const payload = await resp.json();
        const convs = payload.conversations || [];

        if (convs.length === 0) return;

        // map conversations to chat structure used by ChatPage
        const mapped = convs.map((c, idx) => ({
          id: c._id || `${Date.now()}-${idx}`,
          name: new Date(c.createdAt).toLocaleString(),
          messages: [
            { sender: "user", text: c.question, timestamp: new Date(c.createdAt) },
            { sender: "ai", text: c.answer, timestamp: new Date(c.createdAt) }
          ],
          createdAt: new Date(c.createdAt)
        }));

        setChats(mapped);
        setActiveChat(mapped[0].id);
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };

    loadHistory();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chats, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input; // capture before clearing
    const newMessage = { 
      sender: "user", 
      text: userText,
      timestamp: new Date()
    };
    
    // add user's message
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    // optimistic UI: clear input and add thinking message
    setInput("");
    const thinkingMessage = { sender: "ai", text: "Cura is thinking...", timestamp: new Date() };
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, thinkingMessage] }
          : chat
      )
    );

    setIsTyping(true);

    // call backend model
    (async () => {
      // Prefer explicit apiConfig (your ngrok Flask URL). Fallbacks kept for dev.
      const API_BASE = API_BASE_URL || process.env.REACT_APP_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("token");
      try {
        const resp = await fetch(`${API_BASE}/ask`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ question: userText, mode })
        });

        let aiText;
        if (!resp.ok) {
          // server returned error -> try to get message or fallback
          const errData = await resp.json().catch(() => ({}));
          aiText = errData?.message || `Error: server returned ${resp.status}`;
        } else {
          const data = await resp.json().catch(() => ({}));
          aiText = data?.answer || data?.reply || null;
        }

        // fallback to local generator if no backend reply
        if (!aiText) {
          aiText = generateAIResponse(userText, mode);
        }

        // replace the last thinking message with real reply
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChat
              ? {
                  ...chat,
                  messages: chat.messages.map((m, idx) =>
                    idx === chat.messages.length - 1 && m.text === "Cura is thinking..."
                      ? { sender: "ai", text: aiText, timestamp: new Date() }
                      : m
                  ),
                }
              : chat
          )
        );
      } catch (err) {
        console.error("Chat request failed", err);
        const fallback = generateAIResponse(userText, mode);
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChat
              ? {
                  ...chat,
                  messages: chat.messages.map((m, idx) =>
                    idx === chat.messages.length - 1 && m.text === "Cura is thinking..."
                      ? { sender: "ai", text: `Error: unable to reach server. ${fallback}`, timestamp: new Date() }
                      : m
                  ),
                }
              : chat
          )
        );
      } finally {
        setIsTyping(false);
      }
    })();
  };

  const generateAIResponse = (userInput, currentMode) => {
    const lowerInput = userInput.toLowerCase();
    
    if (currentMode === "doctor") {
      if (lowerInput.includes("diagnosis") || lowerInput.includes("symptoms")) {
        return "Based on the patient's symptoms and medical history, I'm analyzing potential conditions. The preliminary assessment suggests further tests may be needed for accurate diagnosis.";
      }
      if (lowerInput.includes("treatment") || lowerInput.includes("medication")) {
        return "I recommend reviewing the latest clinical guidelines for this condition. Consider starting with conservative treatment options before progressing to more advanced therapies.";
      }
      if (lowerInput.includes("research") || lowerInput.includes("study")) {
        return "I found several recent studies relevant to your query. The 2024 clinical trial published in The Lancet shows promising results for the new treatment approach.";
      }
      return "As a medical professional assistant, I can help you analyze patient data, review treatment options, or research medical literature. What specific aspect would you like to explore?";
    } else {
      // Patient mode responses
      if (lowerInput.includes("symptom") || lowerInput.includes("pain") || lowerInput.includes("hurt")) {
        return "I understand you're experiencing discomfort. While I can provide general information, it's important to consult with a healthcare professional for proper medical advice specific to your situation.";
      }
      if (lowerInput.includes("appointment") || lowerInput.includes("doctor")) {
        return "I can help you prepare for your doctor's appointment. Make sure to note down your symptoms, current medications, and any questions you have for your healthcare provider.";
      }
      if (lowerInput.includes("medication") || lowerInput.includes("pill")) {
        return "For medication-related questions, it's crucial to consult with your pharmacist or prescribing doctor. They can provide personalized advice based on your specific health profile.";
      }
      return "Thank you for sharing. I'm here to provide general health information and support. Remember, for personalized medical advice, please consult with qualified healthcare professionals.";
    }
  };

  const handleNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      name: `Chat ${chats.length + 1}`,
      messages: [
        { 
          sender: "ai", 
          text: "Hello! I'm Cura AI. How can I assist you today?",
          timestamp: new Date()
        }
      ],
      createdAt: new Date()
    };
    setChats([...chats, newChat]);
    setActiveChat(newChatId);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    if (chats.length === 1) {
      // Don't delete the last chat
      return;
    }
    
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    if (activeChat === chatId) {
      setActiveChat(updatedChats[0].id);
    }
  };

  const handleRenameChat = (chatId, newName) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    );
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file processing
      const fileMessage = {
        sender: "user",
        text: `📎 Attached file: ${file.name}`,
        timestamp: new Date(),
        isFile: true
      };
      
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, fileMessage] }
            : chat
        )
      );
      
      // Simulate AI analyzing the file
      setIsTyping(true);
      setTimeout(() => {
        const analysisMessage = {
          sender: "ai",
          text: `I've received your file "${file.name}". ${mode === 'doctor' ? 'I can help analyze this medical document.' : 'I can review this health-related document.'}`,
          timestamp: new Date()
        };
        
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChat
              ? { ...chat, messages: [...chat.messages, analysisMessage] }
              : chat
          )
        );
        setIsTyping(false);
      }, 1500);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => msg.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeMessages = chats.find((chat) => chat.id === activeChat)?.messages || [];

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };


// Inside your component
const navigate = useNavigate();

// Logout function: clear stored auth and go to /explore
const handleLogout = () => {
  // remove stored authentication
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // close profile dropdown if applicable
  setShowProfile(false);

  // notify user
  alert("Successfully logged out.");

  // navigate to explore page
  navigate("/");
};

// In your JSX:
<div className="menu-actions">
  <button
    className="menu-btn"
    onClick={() => navigate("/privacy")}
  >
    Privacy Settings
  </button>

  <button
    className="menu-btn"
    onClick={() => navigate("/terms")}
  >
    Terms of Use
  </button>

  <button
    className="menu-btn"
    onClick={() => navigate("/help")}
  >
    Help & Support
  </button>

  <button
    className="menu-btn logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>


  return (
    <div className={`chat-container ${theme}`}>
      {/* Enhanced Sidebar */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h2 className="logo">
            <span className="logo-icon">⚕️</span>
            CURA AI
          </h2>
          <button className="new-chat-btn" onClick={handleNewChat}>
            <span className="plus-icon">+</span>
            New Chat
          </button>
        </div>

        {/* Enhanced Mode Toggle */}
        <div className="mode-section">
          <h3 className="section-title">Assistant Mode</h3>
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === "patient" ? "active" : ""}`}
              onClick={() => setMode("patient")}
            >
              👤 Patient
            </button>
            <button
              className={`mode-btn ${mode === "doctor" ? "active" : ""}`}
              onClick={() => setMode("doctor")}
            >
              🩺 Doctor
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Chat History */}
        <div className="chat-history-section">
          <h3 className="section-title">Recent Chats</h3>
          <div className="chat-history">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${chat.id === activeChat ? "active" : ""}`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className="chat-item-content">
                  <span className="chat-icon">💬</span>
                  <div className="chat-info">
                    <span className="chat-name">{chat.name}</span>
                    <span className="chat-preview">
                      {chat.messages[chat.messages.length - 1]?.text.slice(0, 30)}...
                    </span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button
                    className="chat-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newName = prompt("Rename chat:", chat.name);
                      if (newName) handleRenameChat(chat.id, newName);
                    }}
                  >
                    ✏️
                  </button>
                  {chats.length > 1 && (
                    <button
                      className="chat-action-btn delete"
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="bottom-section">
          <div className="user-profile">
            <div className="profile-header">
              <div className="avatar">
                {/* show initial if user exists, otherwise fallback icon */}
                {currentUser?.username
                  ? currentUser.username.charAt(0).toUpperCase()
                  : "👤"}
              </div>
              <div className="profile-info">
                <span className="profile-name">
                  {/* show username or fallback */}
                  {currentUser?.username || "Guest User"}
                </span>
                <span className="profile-role">
                  {/* show email if available, otherwise role based on mode */}
                  {currentUser?.email || (mode === 'doctor' ? 'Medical Professional' : 'Patient')}
                </span>
              </div>
            </div>
            
            <div className="profile-actions">
  <div
    className="dropdown"
    onMouseEnter={() => setShowSettings(true)}
    onMouseLeave={() => setShowSettings(false)}
  >
    <button className="settings-btn">
      <span>⚙️</span>
      Settings
    </button>
    {showSettings && (
      <div className="dropdown-menu settings-menu">
        <div className="theme-section">
          <p><strong>Theme Preferences</strong></p>
          <div className="theme-options">
            <button 
              className={`theme-option ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
            >
              🌙 Dark
            </button>
            <button 
              className={`theme-option ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
            >
              ☀️ Light
            </button>
          </div>
        </div>
        <div className="menu-actions">
  <button 
    className="menu-btn"
    onClick={() => window.location.href = '/privacy'}
  >
    Privacy Settings
  </button>
  <button 
    className="menu-btn"
    onClick={() => window.location.href = 'terms'}
  >
    Terms of Use
  </button>
  <button 
    className="menu-btn"
    onClick={() => window.location.href = '/help '}
  >
    Help & Support
  </button>
  <button
    className="menu-btn logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
      </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Enhanced Main Chat Window */}
      <main className="chat-main">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-title">
            <h3>{chats.find(chat => chat.id === activeChat)?.name || "Chat"}</h3>
            <span className="mode-badge">{mode === 'doctor' ? '🩺 Doctor Mode' : '👤 Patient Mode'}</span>
          </div>
          <div className="chat-actions">
            <button className="header-btn" onClick={handleFileUpload}>
              📎 Attach
            </button>
            <button className="header-btn" onClick={() => window.print()}>
              🖨️ Print
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages">
          {activeMessages.length === 1 ? (
            <div className="welcome-message">
              <div className="welcome-icon">⚕️</div>
              <h2>Welcome to Cura AI</h2>
              <p>I'm your AI healthcare assistant. How can I help you today?</p>
              <div className="quick-actions">
                <button 
                  className="quick-btn"
                  onClick={() => setInput("What are common symptoms of...")}
                >
                  💡 Symptom Information
                </button>
                <button 
                  className="quick-btn"
                  onClick={() => setInput("How do I prepare for a doctor's appointment?")}
                >
                  📋 Appointment Prep
                </button>
                <button 
                  className="quick-btn"
                  onClick={() => setInput("Explain my medication...")}
                >
                  💊 Medication Guide
                </button>
              </div>
            </div>
          ) : (
            activeMessages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">
                      {msg.sender === 'ai' ? 'Cura AI' : 'You'}
                    </span>
                    <span className="message-time">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <div className={`bubble ${msg.isFile ? 'file-bubble' : ''}`}>
                    {msg.text}
                    {msg.isFile && <span className="file-indicator"> 📎</span>}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="message ai">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="input-area">
          <div className="input-tools">
            <button 
              className="tool-btn"
              onClick={handleFileUpload}
              title="Attach file"
            >
              📎
            </button>
            <button 
              className="tool-btn"
              title="Send voice message"
            >
              🎤
            </button>
          </div>
          <input
            type="text"
            placeholder={`Ask Cura AI as a ${mode}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="message-input"
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim()}
            className="send-btn"
          >
            <span className="send-icon">↑</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
        />
      </main>
    </div>
  );
};

export default ChatPage;