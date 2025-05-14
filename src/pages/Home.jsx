import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import Calendar from '../components/Calendar';
import Messages from '../components/Messages';
import Settings from '../components/Settings';
import HelpSupport from '../components/HelpSupport';

function Home() {
  const { user } = useSelector(state => state.user);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Icon declarations
  const MenuIcon = getIcon('Menu');
  const XIcon = getIcon('X');
  const UsersIcon = getIcon('Users');
  const CalendarIcon = getIcon('Calendar');
  const LineChartIcon = getIcon('LineChart');
  const MessageSquareIcon = getIcon('MessageSquare');
  const SettingsIcon = getIcon('Settings');
  const HelpCircleIcon = getIcon('HelpCircle');
  const BellIcon = getIcon('Bell');
  const PlusCircleIcon = getIcon('PlusCircle');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LineChartIcon },
    { id: 'customers', label: 'Customers', icon: UsersIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'messages', label: 'Messages', icon: MessageSquareIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'help', label: 'Help & Support', icon: HelpCircleIcon },
  ];

  // Example notification count
  const notificationCount = 3;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    if (tabId !== 'dashboard' && tabId !== 'customers' && tabId !== 'calendar') {
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 bg-white dark:bg-surface-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        initial={false}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
            <h1 className="text-xl font-bold text-primary">
              <span className="text-accent">Connect</span>Flow
            </h1>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-primary bg-opacity-10 text-primary dark:text-primary-light'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-surface-200 dark:border-surface-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-sm">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : 'JD'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : 'John Doe'}</p>
                <p className="text-xs text-surface-500">{user?.role || 'User'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-surface-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden rounded-md p-2 text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700 focus:outline-none"
            >
              {sidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>

            <div className="flex items-center space-x-3">
              <button className="relative p-2 rounded-full text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700">
                <BellIcon className="h-6 w-6" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-accent rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button className="p-2 rounded-full text-primary-dark bg-primary-light bg-opacity-20 hover:bg-opacity-30 flex items-center">
                <PlusCircleIcon className="h-5 w-5 mr-1" />
                <span className="text-xs font-medium hidden sm:inline">New</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-surface-50 dark:bg-surface-900">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user?.firstName || 'User'}</h1>
                  <p className="text-surface-600 dark:text-surface-400 mt-1">Here's what's happening with your customer relationships today.</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary text-sm">
                    <CalendarIcon className="w-4 h-4 inline mr-1" /> Today
                  </button>
                  <button className="btn-primary text-sm">
                    <PlusCircleIcon className="w-4 h-4 inline mr-1" /> Add Customer
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Customers", value: "287", change: "+12%", color: "bg-blue-500" },
                  { label: "Active Deals", value: "54", change: "+7%", color: "bg-green-500" },
                  { label: "Follow-ups Today", value: "12", change: "-3%", color: "bg-purple-500" },
                  { label: "Overdue Tasks", value: "7", change: "+2%", color: "bg-red-500" }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-15 flex items-center justify-center mb-3`}>
                      <div className={`w-6 h-6 ${stat.color} rounded-md`}></div>
                    </div>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-surface-500 text-sm">{stat.label}</p>
                      <span className={`text-xs font-medium ${stat.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Feature (Customer Management) */}
              <MainFeature />
            </div>
          )}

          {activeTab === 'customers' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6">Customer Directory</h1>
              <MainFeature />
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6">Calendar</h1>
              <p className="text-surface-600 dark:text-surface-400 mb-6">Manage your appointments, meetings, and follow-ups.</p>
              <Calendar />
            </div>
          )}
          {activeTab === 'messages' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6">Messages</h1>
              <p className="text-surface-600 dark:text-surface-400 mb-6">Communicate with your customers and track conversations.</p>
              <Messages />
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6">Settings</h1>
              <p className="text-surface-600 dark:text-surface-400 mb-6">Manage your account preferences and application settings.</p>
              <Settings />
            </div>
          )}
          
          {activeTab === 'help' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6">Help & Support</h1>
              <p className="text-surface-600 dark:text-surface-400 mb-6">Get help, browse documentation, and contact our support team.</p>
              <HelpSupport />
            </div>
          )}

          {!['dashboard', 'customers', 'calendar', 'messages', 'settings'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold mb-2">Coming Soon!</h2>
              <p className="text-surface-600 dark:text-surface-400 text-center max-w-md">
                We're working hard on the {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} feature.
                It will be available in the next update.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;