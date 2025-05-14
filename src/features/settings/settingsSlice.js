import { createSlice } from '@reduxjs/toolkit';

// Load initial settings from localStorage if available
const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
  }
  
  // Default settings if nothing is stored
  return {
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      department: '',
      timeZone: 'UTC',
      language: 'English'
    },
    appearance: {
      theme: localStorage.theme || 'light',
      colorScheme: 'blue',
      density: 'comfortable',
      sidebarCollapsed: false
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      inApp: true,
      newCustomer: true,
      taskReminders: true,
      systemUpdates: true,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordLastChanged: null
    }
  };
};

const initialState = loadSettings();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    updateAppearance: (state, action) => {
      state.appearance = { ...state.appearance, ...action.payload };
      
      // If theme is updated, also update localStorage.theme and document class
      if (action.payload.theme) {
        localStorage.theme = action.payload.theme;
        if (action.payload.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    updateNotifications: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    updateSecurity: (state, action) => {
      state.security = { ...state.security, ...action.payload };
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    resetSettings: (state) => {
      return loadSettings();
    }
  }
});

export const { 
  updateProfile, updateAppearance, updateNotifications, updateSecurity, resetSettings 
} = settingsSlice.actions;

export default settingsSlice.reducer;