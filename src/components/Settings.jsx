import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { 
  updateProfile, 
  updateAppearance, 
  updateNotifications, 
  updateSecurity 
} from '../features/settings/settingsSlice';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const settings = useSelector(state => state.settings);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  // Icons
  const UserIcon = getIcon('User');
  const PaletteIcon = getIcon('Palette');
  const BellIcon = getIcon('Bell');
  const ShieldIcon = getIcon('Shield');
  const CheckIcon = getIcon('Check');
  const SaveIcon = getIcon('Save');
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');

  // Form state
  const [profileForm, setProfileForm] = useState({
    ...settings.profile,
    firstName: user?.firstName || settings.profile.firstName,
    lastName: user?.lastName || settings.profile.lastName,
    email: user?.email || settings.profile.email
  });
  const [appearanceForm, setAppearanceForm] = useState(settings.appearance);
  const [notificationsForm, setNotificationsForm] = useState(settings.notifications);
  const [securityForm, setSecurityForm] = useState(settings.security);

  // Form handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAppearanceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppearanceForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleNotificationsChange = (e) => {
    const { name, checked } = e.target;
    setNotificationsForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurityForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Submit handlers
  const saveProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileForm));
    toast.success('Profile settings saved successfully');
  };

  const saveAppearance = (e) => {
    e.preventDefault();
    dispatch(updateAppearance(appearanceForm));
    toast.success('Appearance settings saved successfully');
  };

  const saveNotifications = (e) => {
    e.preventDefault();
    dispatch(updateNotifications(notificationsForm));
    toast.success('Notification preferences updated');
  };

  const saveSecurity = (e) => {
    e.preventDefault();
    // Set password last changed date to now
    const updatedSecurity = {
      ...securityForm,
      passwordLastChanged: new Date().toISOString()
    };
    dispatch(updateSecurity(updatedSecurity));
    toast.success('Security settings updated successfully');
  };

  // Toggle theme directly
  const toggleTheme = () => {
    const newTheme = appearanceForm.theme === 'light' ? 'dark' : 'light';
    setAppearanceForm(prev => ({ ...prev, theme: newTheme }));
    dispatch(updateAppearance({ theme: newTheme }));
    toast.info(`Theme switched to ${newTheme} mode`);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'appearance', label: 'Appearance', icon: PaletteIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
  ];

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Settings Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-surface-200 dark:border-surface-700">
          <nav className="p-4">
            <h2 className="font-semibold text-lg mb-4">Settings</h2>
            <div className="space-y-1">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-primary bg-opacity-10 text-primary dark:text-primary-light'
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300'
                  }`}
                >
                  <section.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6">
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Profile Settings</h2>
              <p className="text-surface-600 dark:text-surface-400">
                Update your personal information and preferences
              </p>

              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={profileForm.jobTitle}
                      onChange={handleProfileChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={profileForm.department}
                      onChange={handleProfileChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn-primary flex items-center">
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Appearance</h2>
              <p className="text-surface-600 dark:text-surface-400">
                Customize the look and feel of your interface
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Theme</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    {appearanceForm.theme === 'dark' ? (
                      <SunIcon className="w-5 h-5 mr-2" />
                    ) : (
                      <MoonIcon className="w-5 h-5 mr-2" />
                    )}
                    {appearanceForm.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                </div>
              </div>

              <form onSubmit={saveAppearance} className="space-y-4">
                <div>
                  <label htmlFor="colorScheme" className="block text-sm font-medium mb-1">
                    Color Scheme
                  </label>
                  <select
                    id="colorScheme"
                    name="colorScheme"
                    value={appearanceForm.colorScheme}
                    onChange={handleAppearanceChange}
                    className="input-field"
                  >
                    <option value="blue">Blue (Default)</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="density" className="block text-sm font-medium mb-1">
                    Density
                  </label>
                  <select
                    id="density"
                    name="density"
                    value={appearanceForm.density}
                    onChange={handleAppearanceChange}
                    className="input-field"
                  >
                    <option value="comfortable">Comfortable (Default)</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="sidebarCollapsed"
                    name="sidebarCollapsed"
                    checked={appearanceForm.sidebarCollapsed}
                    onChange={handleAppearanceChange}
                    className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="sidebarCollapsed" className="ml-2 block text-sm">
                    Collapse sidebar by default
                  </label>
                </div>

                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn-primary flex items-center">
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Notification Preferences</h2>
              <p className="text-surface-600 dark:text-surface-400">
                Control how and when you receive notifications
              </p>

              <form onSubmit={saveNotifications}>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'email', label: 'Email Notifications' },
                      { id: 'push', label: 'Push Notifications' },
                      { id: 'sms', label: 'SMS Notifications' },
                      { id: 'inApp', label: 'In-App Notifications' }
                    ].map(item => (
                      <div key={item.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={item.id}
                          name={item.id}
                          checked={notificationsForm[item.id]}
                          onChange={handleNotificationsChange}
                          className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={item.id} className="ml-2 block text-sm font-medium">
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-medium mt-6">Notification Types</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'newCustomer', label: 'New Customer Alerts' },
                      { id: 'taskReminders', label: 'Task Reminders' },
                      { id: 'systemUpdates', label: 'System Updates' },
                      { id: 'marketingEmails', label: 'Marketing Emails' }
                    ].map(item => (
                      <div key={item.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={item.id}
                          name={item.id}
                          checked={notificationsForm[item.id]}
                          onChange={handleNotificationsChange}
                          className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={item.id} className="ml-2 block text-sm font-medium">
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn-primary flex items-center">
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Save Preferences
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Security Settings</h2>
              <p className="text-surface-600 dark:text-surface-400">
                Manage your account security and authentication methods
              </p>

              <form onSubmit={saveSecurity} className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    name="twoFactorAuth"
                    checked={securityForm.twoFactorAuth}
                    onChange={handleSecurityChange}
                    className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="twoFactorAuth" className="ml-2 block text-sm font-medium">
                    Enable Two-Factor Authentication
                  </label>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium mb-1">
                    Session Timeout (minutes)
                  </label>
                  <select
                    id="sessionTimeout"
                    name="sessionTimeout"
                    value={securityForm.sessionTimeout}
                    onChange={handleSecurityChange}
                    className="input-field"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="240">4 hours</option>
                  </select>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn-primary flex items-center">
                    <ShieldIcon className="w-4 h-4 mr-2" />
                    Update Security Settings
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;