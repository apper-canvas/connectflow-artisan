import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './features/auth/authSlice';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');

  // Auth state
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Check for user preference
  useEffect(() => {
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };
  
  // Get LogOut icon
  const LogOutIcon = getIcon('LogOut');

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100 transition-colors duration-300">
      {/* Theme toggle button */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-200 shadow-soft hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-300"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </motion.button>

      {/* Logout button (only shown when authenticated) */}
      {isAuthenticated && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="fixed top-4 right-16 z-50 p-2 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-200 shadow-soft hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-300"
          aria-label="Logout"
        >
          <LogOutIcon size={20} />
        </motion.button>
      )}
      
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={isAuthenticated ? <NotFound /> : <Login />} />
      </Routes>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-100"
      />
    </div>
  );
}

export default App;