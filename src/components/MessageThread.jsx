import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import { useSelector } from 'react-redux';

function MessageThread({ thread, customerName, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useSelector(state => state.auth);
  
  // Icons
  const SendIcon = getIcon('Send');
  const CheckIcon = getIcon('Check');
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread.messages]);
  
  // Format timestamp
  const formatMessageTime = (timestamp) => {
    return format(new Date(timestamp), 'MMM d, h:mm a');
  };
  
  // Handle sending a message
  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(thread.id, newMessage);
      setNewMessage('');
    }
  };
  
  // Message bubble component
  const MessageBubble = ({ message, isLast }) => {
    const isCustomer = message.senderId !== 'system';
    
    return (
      <motion.div 
        className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} mb-4`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`max-w-[80%]`}>
          <div 
            className={`p-3 rounded-lg break-words ${
              isCustomer 
                ? 'bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-surface-100 rounded-tl-none' 
                : 'bg-primary text-white rounded-tr-none'
            }`}
          >
            {message.text}
          </div>
          <div className={`flex items-center mt-1 text-xs text-surface-500 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
            <span>{formatMessageTime(message.timestamp)}</span>
            {!isCustomer && isLast && (
              <span className="flex items-center ml-1">
                {message.isRead ? (
                  <CheckIcon className="w-3 h-3 text-green-500" />
                ) : (
                  <CheckIcon className="w-3 h-3" />
                )}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <>
      {/* Thread Header */}
      <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">{customerName}</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400">{thread.subject}</p>
        </div>
      </div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 bg-surface-50 dark:bg-surface-900">
        {thread.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-surface-500 dark:text-surface-400">No messages yet</p>
          </div>
        ) : (
          <>
            {/* Date separator */}
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1 bg-surface-200 dark:bg-surface-700 rounded-full text-xs text-surface-600 dark:text-surface-300">
                {format(new Date(thread.messages[0].timestamp), 'MMMM d, yyyy')}
              </span>
            </div>
            
            {/* Messages */}
            {thread.messages.map((message, index) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isLast={index === thread.messages.length - 1}
              />
            ))}
            
            {/* This element is used to auto-scroll to the bottom */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Compose Area */}
      <div className="p-4 border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
        <form onSubmit={handleSend} className="flex items-end">
          <div className="flex-1 mr-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type your message..."
              className="input-field min-h-[80px] resize-none"
              required
            />
            <div className="text-xs text-surface-500 mt-1">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`btn-primary p-3 ${!newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </>
  );
}

export default MessageThread;