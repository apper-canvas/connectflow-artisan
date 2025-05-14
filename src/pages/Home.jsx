import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchUserSettings } from '../services/settingsService';
import { fetchCalendarEvents } from '../services/calendarService';
import { fetchMessageThreads } from '../services/messageService';
import { fetchUsers } from '../services/userService';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const [settings, setSettings] = useState(null);
  const [events, setEvents] = useState([]);
  const [threads, setThreads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    settings: true,
    events: true,
    messages: true,
    users: true
  });
  const [error, setError] = useState(null);

  const CalendarIcon = getIcon('Calendar');
  const MessageSquareIcon = getIcon('MessageSquare');
  const UserIcon = getIcon('User');
  const SettingsIcon = getIcon('Settings');
  const UsersIcon = getIcon('Users');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Load user settings
        try {
          const userSettingsResponse = await fetchUserSettings(user.userId);
          if (userSettingsResponse && userSettingsResponse.length > 0) {
            setSettings(userSettingsResponse[0]);
          }
          setLoading(prev => ({ ...prev, settings: false }));
        } catch (error) {
          console.error("Error fetching user settings:", error);
          setLoading(prev => ({ ...prev, settings: false }));
        }

        // Load upcoming calendar events
        try {
          const eventsResponse = await fetchCalendarEvents();
          setEvents(eventsResponse || []);
          setLoading(prev => ({ ...prev, events: false }));
        } catch (error) {
          console.error("Error fetching calendar events:", error);
          setLoading(prev => ({ ...prev, events: false }));
        }

        // Load message threads
        try {
          const threadsResponse = await fetchMessageThreads();
          setThreads(threadsResponse || []);
          setLoading(prev => ({ ...prev, messages: false }));
        } catch (error) {
          console.error("Error fetching message threads:", error);
          setLoading(prev => ({ ...prev, messages: false }));
        }

        // Load users
        try {
          const usersResponse = await fetchUsers();
          setUsers(usersResponse || []);
          setLoading(prev => ({ ...prev, users: false }));
        } catch (error) {
          console.error("Error fetching users:", error);
          setLoading(prev => ({ ...prev, users: false }));
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        setError(error.message || "Failed to load dashboard data");
        toast.error("Error loading home data");
        setLoading({
          settings: false,
          events: false,
          messages: false,
          users: false
        });
      }
    };

    if (user?.userId) {
      loadHomeData();
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Data</h1>
          <p className="text-surface-700 dark:text-surface-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100 mb-2">
          Welcome, {user?.firstName || 'User'}!
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Here's your ConnectFlow dashboard overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <UserIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">Your Profile</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Name</p>
              <p className="font-medium text-surface-800 dark:text-surface-100">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Email</p>
              <p className="font-medium text-surface-800 dark:text-surface-100">{user?.emailAddress}</p>
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Role</p>
              <p className="font-medium text-surface-800 dark:text-surface-100">{user?.role || 'User'}</p>
            </div>
          </div>
        </motion.div>

        {/* Calendar Events Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <CalendarIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">Upcoming Events</h2>
          </div>
          {loading.events ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : events.length > 0 ? (
            <ul className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <li key={event.Id} className="border-b border-surface-200 dark:border-surface-700 pb-2">
                  <p className="font-medium text-surface-800 dark:text-surface-100">{event.title}</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    {formatDate(event.date)} · {event.duration} min · {event.type}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-surface-600 dark:text-surface-400">No upcoming events</p>
          )}
        </motion.div>

        {/* Users Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <UsersIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">Team Members</h2>
          </div>
          {loading.users ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : users.length > 0 ? (
            <ul className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <li key={user.Id} className="flex items-center border-b border-surface-200 dark:border-surface-700 pb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                    {user.firstName ? user.firstName[0] : ''}
                    {user.lastName ? user.lastName[0] : ''}
                  </div>
                  <div>
                    <p className="font-medium text-surface-800 dark:text-surface-100">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-surface-600 dark:text-surface-400">
                      {user.jobTitle || user.role || 'Team Member'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-surface-600 dark:text-surface-400">No team members</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;