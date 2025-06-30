import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[80vh] text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-9xl font-bold text-primary-200 dark:text-primary-900">404</div>
      <h1 className="text-3xl font-bold mt-4 mb-2 text-gray-800 dark:text-white">Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <motion.button 
          className="btn-primary flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={18} className="mr-2" />
          Go to Home
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default NotFoundPage;