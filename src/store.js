import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import calendarReducer from './features/calendar/calendarSlice';
import messagesReducer from './features/messages/messagesSlice';
import settingsReducer from './features/settings/settingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer,
    messages: messagesReducer,
    settings: settingsReducer
  },
  devTools: true
});

export default store;