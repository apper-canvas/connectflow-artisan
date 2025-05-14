import { getApperClient, getDefaultFetchParams, createWhereCondition, formatError } from '../utils/apperClient';

const TABLE_NAME = 'user_settings';

/**
 * Fetch user settings by user ID
 * @param {String} userId - User ID
 * @returns {Promise<Array>} User settings
 */
export const fetchUserSettings = async (userId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      ...getDefaultFetchParams(),
      where: [
        createWhereCondition("userId", userId)
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Create user settings
 * @param {Object} settingsData - Settings data
 * @returns {Promise<Object>} Created settings
 */
export const createUserSettings = async (settingsData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        userId: settingsData.userId,
        theme: settingsData.theme || 'light',
        colorScheme: settingsData.colorScheme || 'blue',
        density: settingsData.density || 'comfortable',
        sidebarCollapsed: settingsData.sidebarCollapsed || false,
        emailNotifications: settingsData.emailNotifications !== undefined ? settingsData.emailNotifications : true,
        pushNotifications: settingsData.pushNotifications !== undefined ? settingsData.pushNotifications : true,
        smsNotifications: settingsData.smsNotifications !== undefined ? settingsData.smsNotifications : false,
        inAppNotifications: settingsData.inAppNotifications !== undefined ? settingsData.inAppNotifications : true,
        newCustomerNotifications: settingsData.newCustomerNotifications !== undefined ? settingsData.newCustomerNotifications : true,
        taskReminderNotifications: settingsData.taskReminderNotifications !== undefined ? settingsData.taskReminderNotifications : true,
        systemUpdateNotifications: settingsData.systemUpdateNotifications !== undefined ? settingsData.systemUpdateNotifications : true,
        marketingEmailNotifications: settingsData.marketingEmailNotifications !== undefined ? settingsData.marketingEmailNotifications : false,
        sessionTimeout: settingsData.sessionTimeout || 30
      }]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create user settings");
  } catch (error) {
    console.error("Error creating user settings:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Update user settings
 * @param {Number} settingsId - Settings ID
 * @param {Object} settingsData - Updated settings data
 * @returns {Promise<Object>} Updated settings
 */
export const updateUserSettings = async (settingsId, settingsData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Id: settingsId,
        ...settingsData
      }]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to update user settings");
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Get or create user settings
 * First tries to fetch existing settings, if none exist creates default settings
 * @param {String} userId - User ID
 * @param {Object} defaultSettings - Default settings to use if none exist
 * @returns {Promise<Object>} User settings
 */
export const getOrCreateUserSettings = async (userId, defaultSettings = {}) => {
  try {
    // Try to fetch existing settings
    const existingSettings = await fetchUserSettings(userId);
    
    if (existingSettings && existingSettings.length > 0) {
      return existingSettings[0];
    }
    
    // If no settings exist, create default ones
    return await createUserSettings({
      userId,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      ...defaultSettings
    });
  } catch (error) {
    console.error("Error in getOrCreateUserSettings:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Apply theme from settings
 * @param {Object} settings - User settings
 */
export const applyThemeFromSettings = (settings) => {
  if (!settings || !settings.theme) return;
  
  if (settings.theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
};

export default {
  fetchUserSettings,
  createUserSettings,
  updateUserSettings,
  getOrCreateUserSettings,
  applyThemeFromSettings
};