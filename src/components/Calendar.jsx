import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import getIcon from '../utils/iconUtils';
import EventModal from './EventModal';
import { addEvent, updateEvent, deleteEvent, setEvents } from '../features/calendar/calendarSlice';

function Calendar() {
  const dispatch = useDispatch();
  const events = useSelector(state => state.calendar.events);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'view', or 'edit'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Icons
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const ChevronRightIcon = getIcon('ChevronRight');
  const PlusIcon = getIcon('Plus');
  const CalendarIcon = getIcon('Calendar');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const XIcon = getIcon('X');
  
  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert string dates back to Date objects
        const eventsWithDates = parsedEvents.map(event => ({
          ...event,
          date: new Date(event.date)
        }));
        dispatch(setEvents(eventsWithDates));
      } catch (error) {
        console.error('Error parsing saved events:', error);
      }
    }
  }, [dispatch]);
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-sm rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
            aria-label="Next month"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setModalMode('create');
              setModalOpen(true);
            }}
            className="ml-2 btn-primary flex items-center text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-1" /> Add Event
          </button>
        </div>
      </div>
    );
  };
  
  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {dateRange.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelectedDay = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          
          // Get events for this day
          const dayEvents = events.filter(event => 
            isSameDay(new Date(event.date), day)
          );
          
          return (
            <div 
              key={i}
              className={`min-h-[120px] p-2 rounded-lg border ${
                isCurrentMonth 
                  ? 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700' 
                  : 'bg-surface-50 dark:bg-surface-900 border-transparent text-surface-400 dark:text-surface-600'
              } ${
                isSelectedDay 
                  ? 'ring-2 ring-primary ring-opacity-50' 
                  : ''
              } ${
                isTodayDate 
                  ? 'border-primary-light dark:border-primary-dark' 
                  : ''
              }`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${
                  isTodayDate 
                    ? 'bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center' 
                    : ''
                }`}>
                  {format(day, 'd')}
                </span>
                
                {isCurrentMonth && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(day);
                      setSelectedEvent(null);
                      setModalMode('create');
                      setModalOpen(true);
                    }}
                    className="text-primary hover:text-primary-dark dark:hover:text-primary-light"
                    aria-label="Add event"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                      setModalMode('view');
                      setModalOpen(true);
                    }}
                    className={`px-2 py-1 text-xs rounded truncate cursor-pointer ${
                      event.type === 'meeting' 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                        : event.type === 'call' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                    }`}
                  >
                    {format(new Date(event.date), 'h:mm a')} - {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const handleSaveEvent = (eventData) => {
    if (modalMode === 'edit' && selectedEvent) {
      dispatch(updateEvent({ ...eventData, id: selectedEvent.id }));
      toast.success('Event updated successfully');
    } else {
      dispatch(addEvent(eventData));
      toast.success('Event added successfully');
    }
    setModalOpen(false);
  };
  
  return (
    <div className="card">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
      
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
        mode={modalMode}
        setMode={setModalMode}
        onDelete={(id) => {
          dispatch(deleteEvent(id));
          setModalOpen(false);
          toast.success('Event deleted successfully');
        }}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default Calendar;