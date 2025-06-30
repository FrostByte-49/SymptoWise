import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Bell, LogOut, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: number;
  text: string;
  read: boolean;
  timestamp: Date;
}

interface HeaderProps {
  toggleSidebar: () => void;
}

// Notification service that can be imported from elsewhere
class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private subscribers: ((notifications: Notification[]) => void)[] = [];

  private constructor() {
    // Welcome Notification
    this.addNotification('Welcome to SymptoWise! Your intelligent health companion. We\'re here to help you understand and manage your symptoms better!');
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public addNotification(text: string): void {
    const newNotification: Notification = {
      id: Date.now(),
      text,
      read: false,
      timestamp: new Date(),
    };
    this.notifications = [newNotification, ...this.notifications];
    this.notifySubscribers();
  }

  public markAsRead(id: number): void {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notifySubscribers();
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.notifySubscribers();
  }

  public clearNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifySubscribers();
  }

  public subscribe(callback: (notifications: Notification[]) => void): void {
    this.subscribers.push(callback);
    callback(this.notifications); 
  }

  public unsubscribe(callback: (notifications: Notification[]) => void): void {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback([...this.notifications]));
  }
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    const handleNotificationsUpdate = (updatedNotifications: Notification[]) => {
      setNotifications(updatedNotifications);
    };

    notificationService.subscribe(handleNotificationsUpdate);

    return () => {
      notificationService.unsubscribe(handleNotificationsUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      NotificationService.getInstance().markAllAsRead();
    }
  };

  const markAsRead = (id: number) => {
    NotificationService.getInstance().markAsRead(id);
  };

  const clearNotification = (id: number) => {
    NotificationService.getInstance().clearNotification(id);
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-4 md:px-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      {/* Sidebar toggle for mobile */}
      <button 
        className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Logo */}
      <div className="font-serif text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center">
        {/* <img src="/assets/images/Picture_4.webp" alt="Icon" className="h-10 w-auto -my-2 pb-0"/> */}
      </div>

      {/* Right-side controls */}
      <div className="flex items-center space-x-4 relative">
        {/* Notification */}
        <div className="relative">
          <button 
            className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative"
            onClick={toggleNotifications}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
              >
                <div className="py-1">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span>Notifications</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={() => NotificationService.getInstance().markAllAsRead()}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  {notifications.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(notification => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`px-4 py-3 text-sm border-b border-gray-100 dark:border-gray-700 flex justify-between items-start ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-700'}`}
                          onMouseEnter={() => !notification.read && markAsRead(notification.id)}
                        >
                          <div>
                            <div>{notification.text}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <motion.button 
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
export { NotificationService }; 