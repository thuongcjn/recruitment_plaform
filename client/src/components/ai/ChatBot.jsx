import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: 'Xin chào! Tôi là trợ lý ảo Hiretify. Tôi có thể giúp gì cho bạn?' }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
        message: input,
        history: messages.slice(0, -1)
      }, { withCredentials: true });

      const aiMessage = { role: 'model', parts: [{ text: response.data.text }] };
      setMessages(prev => [...prev, aiMessage]);

      if (response.data.jobCreated) {
        // You could trigger a notification or redirect
        console.log("Job created:", response.data.jobId);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "Rất tiếc, đã có lỗi xảy ra. Bạn vui lòng thử lại sau nhé." }]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Chat Bubble Button */}
      <button className="chatbot-bubble" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-robot"></i>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="status-dot"></div>
              <span>Hiretify AI Assistant</span>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role === 'user' ? 'user' : 'ai'}`}>
                <div className="message-content">
                  {msg.parts[0].text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
