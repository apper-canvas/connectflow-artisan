import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

const AuthLayout = ({ children, title, subtitle }) => {
  const ArrowLeft = getIcon('ArrowLeft');

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-100 dark:bg-surface-800 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full bg-white dark:bg-surface-900 rounded-xl shadow-card p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-6">
          <Link to="/" className="inline-block text-surface-600 hover:text-primary mb-4">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary">
            <span className="text-accent">Connect</span>Flow
          </h1>
          <h2 className="text-xl font-bold mt-4 mb-1">{title}</h2>
          <p className="text-surface-500 dark:text-surface-400">{subtitle}</p>
        </div>
        
        <div className="space-y-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;