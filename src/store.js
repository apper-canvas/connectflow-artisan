import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import calendarReducer from './features/calendar/calendarSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer
  },
  devTools: true
});
export default store;