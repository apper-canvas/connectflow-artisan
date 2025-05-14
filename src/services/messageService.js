import { getApperClient, getDefaultFetchParams, createWhereCondition, formatError } from '../utils/apperClient';

const THREAD_TABLE = 'message_thread';
const MESSAGE_TABLE = 'message';

/**
 * Fetch all message threads with optional filtering
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} List of message threads
 */
export const fetchMessageThreads = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      ...getDefaultFetchParams(),
      orderBy: [
        {
          field: "lastUpdated",
          direction: "DESC"
        }
      ]
    };
    
    // Build where conditions based on filters
    if (Object.keys(filters).length > 0) {
      params.where = Object.entries(filters).map(([key, value]) => 
        createWhereCondition(key, value)
      );
    }
    
    const response = await apperClient.fetchRecords(THREAD_TABLE, params);
    
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching message threads:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Fetch a single message thread by ID
 * @param {Number} threadId - Thread ID
 * @returns {Promise<Object>} Message thread
 */
export const fetchThreadById = async (threadId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      ...getDefaultFetchParams(),
      where: [
        createWhereCondition("Id", threadId)
      ]
    };
    
    const response = await apperClient.fetchRecords(THREAD_TABLE, params);
    
    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching thread by ID:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Fetch messages for a specific thread
 * @param {Number|String} threadId - Thread ID
 * @returns {Promise<Array>} List of messages
 */
export const fetchMessagesByThreadId = async (threadId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      ...getDefaultFetchParams(),
      where: [
        createWhereCondition("threadId", threadId)
      ],
      orderBy: [
        {
          field: "timestamp",
          direction: "ASC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(MESSAGE_TABLE, params);
    
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching messages by thread ID:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Create a new message thread
 * @param {Object} threadData - Thread data
 * @returns {Promise<Object>} Created thread
 */
export const createMessageThread = async (threadData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        customerId: threadData.customerId,
        subject: threadData.subject,
        unreadCount: threadData.unreadCount || 0,
        lastUpdated: new Date().toISOString()
      }]
    };
    
    const response = await apperClient.createRecord(THREAD_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create message thread");
  } catch (error) {
    console.error("Error creating message thread:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Create a new message in a thread
 * @param {Object} messageData - Message data
 * @returns {Promise<Object>} Created message
 */
export const createMessage = async (messageData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        threadId: messageData.threadId,
        senderId: messageData.senderId,
        text: messageData.text,
        timestamp: new Date().toISOString(),
        isRead: messageData.isRead || false
      }]
    };
    
    const response = await apperClient.createRecord(MESSAGE_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      // Update thread's lastUpdated and unreadCount if message is not read
      await updateMessageThread(messageData.threadId, {
        lastUpdated: new Date().toISOString(),
        unreadCount: messageData.isRead ? 0 : 1 // Increment unread count if message is not read
      });
      
      return response.results[0].data;
    }
    
    throw new Error("Failed to create message");
  } catch (error) {
    console.error("Error creating message:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Update a message thread
 * @param {Number} threadId - Thread ID
 * @param {Object} threadData - Updated thread data
 * @returns {Promise<Object>} Updated thread
 */
export const updateMessageThread = async (threadId, threadData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Id: threadId,
        ...threadData
      }]
    };
    
    const response = await apperClient.updateRecord(THREAD_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to update message thread");
  } catch (error) {
    console.error("Error updating message thread:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Mark messages as read
 * @param {Array} messageIds - Array of message IDs to mark as read
 * @returns {Promise<Boolean>} Success status
 */
export const markMessagesAsRead = async (messageIds) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: messageIds.map(id => ({
        Id: id,
        isRead: true
      }))
    };
    
    const response = await apperClient.updateRecord(MESSAGE_TABLE, params);
    
    return response && response.success;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw new Error(formatError(error));
  }
};

export default {
  fetchMessageThreads,
  fetchThreadById,
  fetchMessagesByThreadId,
  createMessageThread,
  createMessage,
  updateMessageThread,
  markMessagesAsRead
};