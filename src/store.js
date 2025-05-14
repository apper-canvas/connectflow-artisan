import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import calendarReducer from './features/calendar/calendarSlice';
import messagesReducer from './features/messages/messagesSlice';
import settingsReducer from './features/settings/settingsSlice';
import userReducer from './store/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer,
    messages: messagesReducer,
    settings: settingsReducer,
    user: userReducer
  },
  devTools: true
});

export default store;