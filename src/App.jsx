import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { setUser, clearUser } from './store/userSlice';
import getIcon from './utils/iconUtils';

// Pages 
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const LogOutIcon = getIcon('LogOut');

  // Check for user preference
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
		let redirectPath = new URLSearchParams(window.location.search).get('redirect');
		const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
				'/callback') || currentPath.includes('/error');
		if (user) {
			// User is authenticated
			if (redirectPath) {
				navigate(redirectPath);
			} else if (!isAuthPage) {
				if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
					navigate(currentPath);
				} else {
					navigate('/');
				}
			} else {
				navigate('/');
			}
			// Store user information in Redux
			dispatch(setUser(JSON.parse(JSON.stringify(user))));
		} else {
			// User is not authenticated
			if (!isAuthPage) {
				navigate(
					currentPath.includes('/signup')
					 ? `/signup?redirect=${currentPath}`
					 : currentPath.includes('/login')
					 ? `/login?redirect=${currentPath}`
					 : '/login');
			} else if (redirectPath) {
				if (
					![
						'error',
						'signup',
						'login',
						'callback'
					].some((path) => currentPath.includes(path)))
					navigate(`/login?redirect=${redirectPath}`);
				else {
					navigate(currentPath);
				}
			} else if (isAuthPage) {
				navigate(currentPath);
			} else {
				navigate('/login');
			}
			dispatch(clearUser());
		}
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed: " + (error.message || "Unknown error"));
        navigate('/error?message=' + encodeURIComponent(error.message || "Authentication failed"));
      }
    });
    
    setIsInitialized(true);
  }, [dispatch, navigate]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.success('Logged out successfully');
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed: " + (error.message || "Unknown error"));
      }
    }
  };
  
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
    // Use the proper logout method defined in authMethods
    authMethods.logout();
    // Toast is already handled in the logout method
  };
  
  // Get LogOut icon

  return (
    <>
      {!isInitialized ? (
        <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-900">
          <div className="text-surface-800 dark:text-surface-100">Initializing application...</div>
        </div>
      ) : (
        <AuthContext.Provider value={authMethods}>
          <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100 transition-colors duration-300">
            {/* Theme toggle button */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="fixed top-4 right-4 z-50 p-2 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-200 shadow-lg hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-300"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </motion.button>

            {/* Logout button (only shown when authenticated) */}
            {isAuthenticated && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="fixed top-4 right-16 z-50 p-2 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-200 shadow-lg hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-300"
                aria-label="Logout"
              >
                <LogOutIcon size={20} />
              </motion.button>
            )}
            
            <Routes>
              <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/dashboard" element={isAuthenticated ? <Home /> : <Login />} />
              <Route path="*" element={<NotFound />} />
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
            <div id="authentication" className="hidden"></div>
          </div>
        </AuthContext.Provider>
      )}
    </>
  );
}

export default App;