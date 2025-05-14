import { createSlice } from '@reduxjs/toolkit';

// Load messages from localStorage if available
const loadMessages = () => {
  try {
    const storedMessages = localStorage.getItem('crm-messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  } catch (error) {
    console.error('Error loading messages from localStorage', error);
    return [];
  }
};

// Sample messages for first-time users
const sampleMessages = [
  {
    id: '1',
    customerId: '1',
    subject: 'Marketing Campaign Discussion',
    messages: [
      {
        id: 'm1',
        senderId: 'system',
        text: 'Hello Alex, I wanted to discuss the upcoming marketing campaign for Q3. Do you have some time this week?',
        timestamp: new Date('2023-07-20T10:30:00').toISOString(),
        isRead: true,
      },
      {
        id: 'm2',
        senderId: '1',
        text: 'Hi there! Yes, I would be happy to discuss. How about Thursday afternoon?',
        timestamp: new Date('2023-07-20T11:45:00').toISOString(),
        isRead: true,
      }
    ],
    lastUpdated: new Date('2023-07-20T11:45:00').toISOString(),
    unreadCount: 0,
  },
  {
    id: '2',
    customerId: '2',
    subject: 'Demo Request',
    messages: [
      {
        id: 'm3',
        senderId: '2',
        text: 'Hello, I am interested in seeing a demo of your product. Is there a time we could schedule that?',
        timestamp: new Date('2023-07-21T09:15:00').toISOString(),
        isRead: false,
      }
    ],
    lastUpdated: new Date('2023-07-21T09:15:00').toISOString(),
    unreadCount: 1,
  }
];

const initialState = {
  threads: loadMessages().length > 0 ? loadMessages() : sampleMessages,
  selectedThreadId: null,
  loading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    selectThread: (state, action) => {
      state.selectedThreadId = action.payload;
      // Mark messages as read when thread is selected
      const thread = state.threads.find(t => t.id === action.payload);
      if (thread) {
        thread.messages.forEach(msg => {
          if (msg.senderId !== 'system' && !msg.isRead) {
            msg.isRead = true;
          }
        });
        thread.unreadCount = 0;
        // Save to localStorage
        localStorage.setItem('crm-messages', JSON.stringify(state.threads));
      }
    },
    sendMessage: (state, action) => {
      const { threadId, message } = action.payload;
      const thread = state.threads.find(t => t.id === threadId);
      
      if (thread) {
        // Add message to existing thread
        thread.messages.push({
          id: `m${Date.now()}`,
          senderId: 'system',
          text: message,
          timestamp: new Date().toISOString(),
          isRead: true,
        });
        thread.lastUpdated = new Date().toISOString();
      }
      
      // Sort threads by lastUpdated
      state.threads.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      
      // Save to localStorage
      localStorage.setItem('crm-messages', JSON.stringify(state.threads));
    },
    createThread: (state, action) => {
      const { customerId, subject, message } = action.payload;
      const newThread = {
        id: `thread_${Date.now()}`,
        customerId,
        subject,
        messages: [{
          id: `m${Date.now()}`,
          senderId: 'system',
          text: message,
          timestamp: new Date().toISOString(),
          isRead: true,
        }],
        lastUpdated: new Date().toISOString(),
        unreadCount: 0,
      };
      
      state.threads.unshift(newThread);
      state.selectedThreadId = newThread.id;
      
      // Save to localStorage
      localStorage.setItem('crm-messages', JSON.stringify(state.threads));
    }
  }
});

export const { selectThread, sendMessage, createThread } = messagesSlice.actions;
export default messagesSlice.reducer;