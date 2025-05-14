import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import calendarReducer from './features/calendar/calendarSlice';
import messagesReducer from './features/messages/messagesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer
    messages: messagesReducer,
  },
  devTools: true
});
export default store;