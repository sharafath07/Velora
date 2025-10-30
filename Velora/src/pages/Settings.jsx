import React, { useState } from 'react';
import { Lock, Bell, Shield, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Layout from '../components/Layout';
import Button from '../components/Button';

const API_BASE_URL = 'https://velora-dm0l.onrender.com/api';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ error: '', success: '' });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  // Helper: reset messages
  const resetMessages = () => setMessage({ error: '', success: '' });

  // Handle input change
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    resetMessages();
  };

  // Handle password update via backend
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ error: 'New passwords do not match', success: '' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ error: 'New password must be at least 6 characters', success: '' });
      return;
    }

    setIsLoading(true);
    resetMessages();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ error: 'You must be logged in to change your password.', success: '' });
        setIsLoading(false);
        return;
      }

      // ✅ Send request to backend
      const res = await axios.put(
        `${API_BASE_URL}/auth/update-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        setMessage({ error: '', success: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ error: res.data?.message || 'Password update failed.', success: '' });
      }
    } catch (err) {
      setMessage({
        error: err.response?.data?.message || 'Failed to update password',
        success: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleNotificationChange = (type) =>
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));

  const notificationTypes = [
    { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
    { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications in your browser' },
    { key: 'sms', label: 'SMS Notifications', desc: 'Receive notifications via text message' },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 🔐 Password Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <Lock className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
            </div>

            {message.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {message.error}
              </div>
            )}
            {message.success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                {message.success}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {['current', 'new', 'confirm'].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={`${field}Password`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field === 'current'
                      ? 'Current Password'
                      : field === 'new'
                      ? 'New Password'
                      : 'Confirm New Password'}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showPasswords[field] ? 'text' : 'password'}
                      name={`${field}Password`}
                      id={`${field}Password`}
                      value={passwordData[`${field}Password`]}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility(field)}
                    >
                      {showPasswords[field] ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Lock size={16} className="mr-2" />
                  )}
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* 🔔 Notification Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <Bell className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              {notificationTypes.map((notif) => (
                <div key={notif.key} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{notif.label}</h3>
                    <p className="text-sm text-gray-500">{notif.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotificationChange(notif.key)}
                    className={`${
                      notifications[notif.key] ? 'bg-primary' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                  >
                    <span
                      className={`${
                        notifications[notif.key] ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🛡 Security Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Login Sessions</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Manage your active login sessions across devices
                </p>
                <Button variant="outline" size="sm">
                  View Sessions
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Account Deletion</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Permanently delete your account and all associated data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
