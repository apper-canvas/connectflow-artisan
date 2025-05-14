import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import calendarReducer from './features/calendar/calendarSlice';
import messagesReducer from './features/messages/messagesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer,
import settingsReducer from './features/settings/settingsSlice';
    messages: messagesReducer,
  },
  devTools: true
});
export default store;
    messages: messagesReducer,
    settings: settingsReducer