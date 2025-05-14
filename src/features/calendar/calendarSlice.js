import { createSlice } from '@reduxjs/toolkit';

// Generate some initial demo events
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const initialState = {
  events: [
    {
      id: '1',
      title: 'Client Meeting',
      description: 'Discuss project requirements and timeline',
      date: today,
      type: 'meeting',
      duration: 60
    },
    {
      id: '2',
      title: 'Follow-up Call',
      description: 'Check progress on last week\'s action items',
      date: tomorrow,
      type: 'call',
      duration: 30
    }
  ]
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    }
  }
});

export const { setEvents, addEvent, updateEvent, deleteEvent } = calendarSlice.actions;

export default calendarSlice.reducer;