import { getApperClient, getDefaultFetchParams, createWhereCondition, formatError } from '../utils/apperClient';

const TABLE_NAME = 'User1'; // From the provided schema

/**
 * Fetch user by ID
 * @param {Number} userId - User ID
 * @returns {Promise<Object>} User data
 */
export const fetchUserById = async (userId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      ...getDefaultFetchParams(),
      where: [
        createWhereCondition("Id", userId)
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Fetch users with optional filtering
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} List of users
 */
export const fetchUsers = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      ...getDefaultFetchParams()
    };
    
    // Build where conditions based on filters
    if (Object.keys(filters).length > 0) {
      params.where = Object.entries(filters).map(([key, value]) => 
        createWhereCondition(key, value)
      );
    }
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || null,
        jobTitle: userData.jobTitle || null,
        department: userData.department || null,
        role: userData.role || 'User',
        timeZone: userData.timeZone || 'UTC',
        language: userData.language || 'English',
        twoFactorAuth: userData.twoFactorAuth || false
      }]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create user");
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Update an existing user
 * @param {Number} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (userId, userData) => {
  try {
    const apperClient = getApperClient();
    
    // Ensure ID is included and correct type
    const params = {
      records: [{
        Id: userId,
        ...userData
      }]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to update user");
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Delete a user
 * @param {Number} userId - User ID
 * @returns {Promise<Boolean>} Success status
 */
export const deleteUser = async (userId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [userId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    return response && response.success;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error(formatError(error));
  }
};

export default {
  fetchUserById,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
};