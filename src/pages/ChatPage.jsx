import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ChatPage.css'; // Add CSS for styling

const ChatPage = ({ fromUserId, toUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/chats/get', {
          params: { fromUserId, toUserId },
        });
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [fromUserId, toUserId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await axios.post('http://localhost:3001/chats/create', {
          fromUserId,
          toUserId,
          message: newMessage,
        });
        setMessages([...messages, { message: newMessage, fromUserId }]);
        setNewMessage('');
      } catch (err) {
        setError('Failed to send message');
      }
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h3>Chat with User {toUserId}</h3>
      </div>
      {loading ? (
        <div>Loading messages...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.fromUserId === fromUserId ? 'sent' : 'received'}`}
            >
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
      )}
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
