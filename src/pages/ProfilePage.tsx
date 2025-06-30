/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useToast } from '../hooks/useToast';
import { signOut, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { 
  User, Settings, Bell, Shield, LogOut, 
  ChevronRight, Moon, Sun, Edit, Trash2, 
  Calendar, Mail, Lock
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    gender: 'Male',
    darkMode: true,
    notifications: true,
    emailUpdates: true,
    dataSharing: false
  });

  // Default profile pictures as Base64 
  const defaultImages = {
    Male: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDJDNi40NzcsMiwyLDYuNDc3LDIsMTJzNC40NzcsMTAsMTAsMTBzMTAtNC40NzcsMTAtMTBTMTcuNTIzLDIsMTIsMnogTTEyLDQuMjVjMS43MjUsMCwzLjI1LDEuNTI1LDMuMjUsMy4yNXMtMS41MjUsMy4yNS0zLjI1LDMuMjVzLTMuMjUtMS41MjUtMy4yNS0zLjI1UzEwLjI3NSw0LjI1LDEyLDQuMjV6IE0xMiwyMGMtMy41MjUsMC02LjI1LTIuMDEtNi4yNS00LjVjMC0xLjUsMy4yNS00LjUsNi4yNS00LjVzNi4yNSwzLDYuMjUsNC41QzE4LjI1LDE3Ljk5LDE1LjUyNSwyMCwxMiwyMHoiIGZpbGw9IiM1NTU5NkQiLz48L3N2Zz4=',
    Female: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDIgQzYuNDc3LDIgMiw2LjQ3NyAyLDEyIHM0LjQ3NywxMCwxMCwxMCBzMTAtNC40NzcsMTAtMTAgUzE3LjUyMywyLDEyLDJ6IE0xMiw0LjI1IGMxLjcyNSwwIDMuMjUsMS41MjUgMy4yNSwzLjI1IHMtMS41MjUsMy4yNS0zLjI1LDMuMjUgcy0zLjI1LTEuNTI1LTMuMjUtMy4yNSBTMTAuMjc1LDQuMjUsMTIsNC4yNXogTTEyLDIwIGMtMy41MjUsMC02LjI1LTIuMDEtNi4yNS00LjUgYzAtMS41IDMuMjUtNC41IDYuMjUtNC41IHM2LjI1LDMgNi4yNSw0LjUgQzE4LjI1LDE3Ljk5LDE1LjUyNSwyMCwxMiwyMHoiIGZpbGw9IiNGRjY2Q0MiLz48L3N2Zz4=',
    Other: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDIgQzYuNDc3LDIgMiw2LjQ3NyAyLDEyIHM0LjQ3NywxMCwxMCwxMCBzMTAtNC40NzcsMTAtMTAgUzE3LjUyMywyLDEyLDJ6IE0xMiw0LjI1IGMxLjcyNSwwIDMuMjUsMS41MjUgMy4yNSwzLjI1IHMtMS41MjUsMy4yNS0zLjI1LDMuMjUgcy0zLjI1LTEuNTI1LTMuMjUtMy4yNSBTMTAuMjc1LDQuMjUsMTIsNC4yNXogTTEyLDIwIGMtMy41MjUsMC02LjI1LTIuMDEtNi4yNS00LjUgYzAtMS41IDMuMjUtNC41IDYuMjUtNC41IHM2LjI1LDMgNi4yNSw0LjUgQzE4LjI1LDE3Ljk5LDE1LjUyNSwyMCwxMiwyMHoiIGZpbGw9IiM2RjRDNzUiLz48L3N2Zz4='
  };

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 200;
        canvas.height = 200;
        ctx.drawImage(img, 0, 0, 200, 200);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
    };
  
    // In your ProfilePage component
  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setFormData({
          name: data.Name || '',
          email: data.Email || '',
          birthDate: data.birthDate || '',
          gender: data.Gender || 'Male',
          darkMode: data.Preferences?.darkMode ?? true,
          notifications: data.Preferences?.notifications ?? true,
          emailUpdates: data.Preferences?.emailUpdates ?? true,
          dataSharing: data.Preferences?.dataSharing ?? false
        });
      } else {
        // Create basic profile if document doesn't exist
        await setDoc(docRef, {
          Name: auth.currentUser?.displayName || 'New User',
          Email: auth.currentUser?.email || '',
          Gender: 'Male',
          createdAt: new Date(),
          Preferences: {
            darkMode: true,
            notifications: true,
            emailUpdates: true,
            dataSharing: false
          }
        });
        // Fetch the newly created document
        const newDoc = await getDoc(docRef);
        if (newDoc.exists()) {
          setUserData(newDoc.data());
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, fetch their data
        fetchUserData(user.uid);
      } else {
        // User is signed out
        setUserData(null);
        setLoading(false);
        navigate('/login');
      }
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleSaveProfile = async () => {
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          Name: formData.name,
          Gender: formData.gender,
          birthDate: formData.birthDate,
          Preferences: {
            darkMode: formData.darkMode,
            notifications: formData.notifications,
            emailUpdates: formData.emailUpdates,
            dataSharing: formData.dataSharing
          }
        });

        setEditMode(false);
        showToast('Profile updated successfully!', 'success');
        // Refresh user data after update
        fetchUserData(auth.currentUser.uid);
      }
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    try {
      if (file.size > 500 * 1024) {
        showToast('Image must be smaller than 500KB', 'warning');
        return;
      }

      const compressedBase64 = await compressImage(file);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        profilePicture: compressedBase64
      });

      showToast('Profile picture updated!', 'success');
      fetchUserData(auth.currentUser.uid);
    } catch (error) {
      showToast('Failed to update picture', 'error');
    }
  };

  const handleRemoveImage = async () => {
    try {
      if (auth.currentUser) {
        const gender = formData.gender || userData?.Gender || 'Male';
        const validGender = ['Male', 'Female', 'Other'].includes(gender) ? gender : 'Male';
        
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          profilePicture: defaultImages[validGender as keyof typeof defaultImages]
        });

        showToast('Profile picture reset to default', 'success');
        // Update local state immediately
        setUserData(prev => ({
          ...prev,
          profilePicture: defaultImages[validGender as keyof typeof defaultImages]
        }));
      }
    } catch (error) {
      console.error('Error removing profile picture:', error);
      showToast('Failed to remove picture', 'error');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('isLoggedIn');
      showToast('Signed out successfully', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Failed to sign out', 'error');
    }
  };

  const handlePasswordReset = async () => {
    if (!auth.currentUser?.email) {
      showToast('No email associated with this account', 'warning');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      showToast('Password reset email sent! Check your inbox', 'success');
    } catch (error) {
      showToast('Failed to send reset email', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No User Data Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find any profile information for this account.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {editMode ? 'Edit Profile' : 'My Profile'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {editMode ? 'Update your personal information' : 'Manage Your Account Settings'}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md">
                    <img
                      src={userData.profilePicture || defaultImages[userData.Gender as keyof typeof defaultImages] || defaultImages.Male}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if the image fails to load
                        (e.target as HTMLImageElement).src = defaultImages.Male;
                      }}
                    />
                </div>
                {editMode && (
                  <div className="flex justify-center gap-2 mt-3">
                    <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition-colors">
                      <Edit size={16} className="text-gray-700 dark:text-gray-300" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={handleRemoveImage}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition-colors"
                    >
                      <Trash2 size={16} className="text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 w-full">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Birth Date</label>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{userData.Name}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{userData.Email}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                          <User size={18} className="text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {userData.Gender || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      
                      {userData.birthDate && (
                        <div className="flex items-center">
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                            <Calendar size={18} className="text-gray-600 dark:text-gray-300" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Birth Date</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {new Date(userData.birthDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-4 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Preferences Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Settings size={20} className="text-primary-600 dark:text-primary-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Preferences</h2>
              </div>
              
              <div className="space-y-4">
                {/* Dark Mode */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    {theme === 'dark' ? (
                      <Moon size={18} className="text-primary-600 dark:text-primary-400 mr-3" />
                    ) : (
                      <Sun size={18} className="text-primary-600 dark:text-primary-400 mr-3" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Dark Mode</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`${theme === 'dark' ? 'translate-x-5' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                  </button>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <Bell size={18} className="text-primary-600 dark:text-primary-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Notifications</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Enable or disable notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {/* Email Updates */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <Mail size={18} className="text-primary-600 dark:text-primary-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Email Updates</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive updates via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailUpdates"
                      checked={formData.emailUpdates}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <User size={20} className="text-primary-600 dark:text-primary-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Account Settings</h2>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={handlePasswordReset}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <Lock size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Change Password</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Update your account password</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group">
                  <div className="flex items-center">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                      <Shield size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Privacy Settings</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your data privacy</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
                
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors group"
                >
                  <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg mr-3 group-hover:bg-red-200 dark:group-hover:bg-red-800/30 transition-colors">
                    <LogOut size={18} className="" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Sign Out</p>
                    <p className="text-xs text-red-500 dark:text-red-400">Log out of your account</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>SymptoWise v1.0.0</p>
          <p className="mt-1">© {new Date().getFullYear()} SymptoWise Health Technologies</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;