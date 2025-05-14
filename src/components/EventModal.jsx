import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

function EventModal({ isOpen, onClose, onSave, event, mode, setMode, onDelete, selectedDate }) {
  const initialState = {
    title: '',
    description: '',
    date: selectedDate || new Date(),
    time: format(new Date(), 'HH:mm'),
    type: 'meeting',
    duration: 30
  };
  
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  // Icons
  const XIcon = getIcon('X');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const ClockIcon = getIcon('Clock');
  const CalendarIcon = getIcon('Calendar');
  const UserIcon = getIcon('User');
  const MessageSquareIcon = getIcon('MessageSquare');
  const TagIcon = getIcon('Tag');
  const AlertTriangleIcon = getIcon('AlertTriangle');
  
  useEffect(() => {
    if (event && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date: new Date(event.date),
        time: format(new Date(event.date), 'HH:mm'),
        type: event.type,
        duration: event.duration
      });
    } else {
      setFormData({
        ...initialState,
        date: selectedDate || new Date()
      });
    }
  }, [event, mode, selectedDate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Combine date and time
      const dateObj = new Date(formData.date);
      const [hours, minutes] = formData.time.split(':').map(Number);
      dateObj.setHours(hours, minutes, 0, 0);
      
      const eventData = {
        id: event?.id || Date.now().toString(),
        title: formData.title,
        description: formData.description,
        date: dateObj,
        type: formData.type,
        duration: parseInt(formData.duration, 10)
      };
      
      onSave(eventData);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {mode === 'create' ? 'Add Event' : mode === 'edit' ? 'Edit Event' : 'Event Details'}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                aria-label="Close"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            {mode === 'view' ? (
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{event?.title}</h3>
                    <div className="flex items-center text-surface-600 dark:text-surface-400 gap-1 mt-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-sm">
                        {format(new Date(event?.date), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center text-surface-600 dark:text-surface-400 gap-1 mt-1">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-sm">
                        {format(new Date(event?.date), 'h:mm a')} ({event?.duration} min)
                      </span>
                    </div>
                    <div className="flex items-center text-surface-600 dark:text-surface-400 gap-1 mt-1">
                      <TagIcon className="w-4 h-4" />
                      <span className="text-sm capitalize">
                        {event?.type}
                      </span>
                    </div>
                  </div>
                  
                  {event?.description && (
                    <div>
                      <h4 className="font-medium mb-1 flex items-center gap-1">
                        <MessageSquareIcon className="w-4 h-4" /> Description
                      </h4>
                      <p className="text-surface-600 dark:text-surface-400">
                        {event.description}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setMode('edit')}
                    className="btn-secondary flex items-center"
                  >
                    <EditIcon className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
                
                {deleteConfirm && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-2">
                      <AlertTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-400">Are you sure you want to delete this event?</p>
                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">This action cannot be undone.</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="px-3 py-1 text-sm bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => onDelete(event.id)}
                        className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field ${errors.title ? 'border-red-500 dark:border-red-700' : ''}`}
                    placeholder="Event title"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={format(formData.date, 'yyyy-MM-dd')}
                    onChange={(e) => {
                      const newDate = e.target.value ? new Date(e.target.value) : new Date();
                      setFormData({...formData, date: newDate});
                    }}
                    className="input-field"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="time" className="block text-sm font-medium mb-1">Time *</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`input-field ${errors.time ? 'border-red-500 dark:border-red-700' : ''}`}
                    />
                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="duration" className="block text-sm font-medium mb-1">Duration (min)</label>
                    <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1">Event Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="call">Call</option>
                    <option value="task">Task</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="input-field"
                    placeholder="Add details about the event"
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {mode === 'edit' ? 'Update Event' : 'Add Event'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default EventModal;