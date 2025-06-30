import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { 
  Home,
  Stethoscope,
  Calendar,
  Smile,
  User,
  X,
  Dumbbell, 
  SparkleIcon,
  Cross,
  Utensils,
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navItems: NavItem[] = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Symptom Checker', path: '/symptom-checker', icon: <Stethoscope size={20} /> },
    { name: 'Routine Generator', path: '/routine-generator', icon: <Calendar size={20} /> },
    { name: 'Skincare', path: '/skincare', icon: <SparkleIcon size={20} /> },
    { name: 'Consult Doctor', path: '/consult-doctor', icon: <Cross size={20} /> },
    { name: 'Exercises', path: '/exercises', icon: <Dumbbell size={20} /> },
    { name: 'Nutrition Plans', path: '/diet-page', icon: <Utensils size={20} /> },
    { name: 'Fun Zone', path: '/fun-zone', icon: <Smile size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];
  
  return (
    <div className="flex flex-col h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo and close button (for mobile) */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="mt-0.5 mb-0.5 pt-0.5 pb-0.5 font-serif text-xl font-bold text-primary-600 dark:text-primary-400 flex items-center">
          <img src="/assets/images/Picture_4.webp" alt="Icon" className="h-10 w-auto -my-2 pb-0"/>
          <span className="text-accent-600 dark:text-accent-400"> &nbsp; Sympto</span>Wise
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      {/* Navigation links */}
      <nav className="flex-1 pt-3 pb-2 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
                onClick={onClose}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="mr-3"
                >
                  {item.icon}
                </motion.div>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Bottom section */}
      <div className="p-3.5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary-50 dark:bg-gray-700">       
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-200 dark:bg-primary-900 flex items-center justify-center">
            <User size={16} className="text-primary-700 dark:text-primary-300" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              User Account
            </p>

            <Link to="/profile" className="flex items-center gap-1">
              <motion.p
                className="text-xs text-gray-500 dark:text-gray-400 truncate hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                Manage your profile
              </motion.p>
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Sidebar;