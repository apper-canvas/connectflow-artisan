import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchUserSettings } from '../services/settingsService';
import { fetchCalendarEvents } from '../services/calendarService';
import { fetchMessageThreads } from '../services/messageService';
import getIcon from '../utils/iconUtils';

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const [settings, setSettings] = useState(null);
  const [events, setEvents] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState({
    settings: true,
    events: true,
    messages: true
  });

  const CalendarIcon = getIcon('Calendar');
  const MessageSquareIcon = getIcon('MessageSquare');
  const UserIcon = getIcon('User');
  const SettingsIcon = getIcon('Settings');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load user settings
        const userSettingsResponse = await fetchUserSettings(user.userId);
        if (userSettingsResponse && userSettingsResponse.length > 0) {
          setSettings(userSettingsResponse[0]);
        }
        setLoading(prev => ({ ...prev, settings: false }));

        // Load upcoming calendar events
        const eventsResponse = await fetchCalendarEvents();
        setEvents(eventsResponse || []);
        setLoading(prev => ({ ...prev, events: false }));

        // Load message threads
        const threadsResponse = await fetchMessageThreads();
        setThreads(threadsResponse || []);
        setLoading(prev => ({ ...prev, messages: false }));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Error loading dashboard data");
        setLoading({
          settings: false,
          events: false,
          messages: false
        });
      }
    };

    if (user?.userId) {
      loadDashboardData();
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

        {/* User Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <SettingsIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">Settings</h2>
          </div>
          {loading.settings ? (
            <p className="text-surface-600 dark:text-surface-400">Loading settings...</p>
          ) : settings ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Theme</p>
                <p className="font-medium text-surface-800 dark:text-surface-100 capitalize">
                  {settings.theme || 'Light'}
                </p>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Color Scheme</p>
                <p className="font-medium text-surface-800 dark:text-surface-100 capitalize">
                  {settings.colorScheme || 'Blue'}
                </p>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Email Notifications</p>
                <p className="font-medium text-surface-800 dark:text-surface-100">
                  {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-surface-600 dark:text-surface-400">No settings configured</p>
          )}
        </motion.div>

        {/* Calendar Events Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <CalendarIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">Upcoming Events</h2>
          </div>
          {loading.events ? (
            <p className="text-surface-600 dark:text-surface-400">Loading events...</p>
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

        {/* Recent Messages Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="md:col-span-2 lg:col-span-3 bg-white dark:bg-surface-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <MessageSquareIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">Recent Messages</h2>
          </div>
          {loading.messages ? (
            <p className="text-surface-600 dark:text-surface-400">Loading messages...</p>
          ) : threads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead>
                  <tr>
                    <th className="py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Subject</th>
                    <th className="py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Customer ID</th>
                    <th className="py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Last Updated</th>
                    <th className="py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Unread</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                  {threads.map((thread) => (
                    <tr key={thread.Id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                      <td className="py-3 text-sm font-medium text-surface-800 dark:text-surface-100">{thread.subject}</td>
                      <td className="py-3 text-sm text-surface-600 dark:text-surface-400">{thread.customerId}</td>
                      <td className="py-3 text-sm text-surface-600 dark:text-surface-400">{formatDate(thread.lastUpdated)}</td>
                      <td className="py-3 text-sm text-surface-600 dark:text-surface-400">
                        {thread.unreadCount > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-white">
                            {thread.unreadCount}
                          </span>
                        ) : (
                          "0"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-surface-600 dark:text-surface-400">No message threads</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;