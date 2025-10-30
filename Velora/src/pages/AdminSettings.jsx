import React, { useState } from 'react';
import { Settings, Database, Mail, Shield, Server } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { getApi } from '../api/Axios';

const AdminSettings = () => {
  const { state } = useAuth(); // ✅ get token from context
  const [settings, setSettings] = useState({
    siteName: 'Velora Admin',
    siteDescription: 'Luxury Fashion E-commerce Platform',
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ✅ Handle setting change
  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSuccess('');
    setError('');
  };

  // ✅ Save settings to backend
  const handleSave = async () => {
    setIsLoading(true);
    setSuccess('');
    setError('');

    try {
      const api = getApi(state?.token);
      const response = await api.put('/admin/settings', settings);
      setSuccess(response.data.message || 'Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600">Configure system-wide settings and preferences</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success & Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* General Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <Server className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
            </div>

            <div className="space-y-4">
              {/* Site Name */}
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                  Site Description
                </label>
                <textarea
                  id="siteDescription"
                  rows={3}
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              {/* Maintenance Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                  <p className="text-sm text-gray-500">
                    Temporarily disable site access for maintenance
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleSettingChange('maintenanceMode', !settings.maintenanceMode)
                  }
                  className={`${
                    settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  <span
                    className={`${
                      settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">User Management</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">User Registration</h3>
                  <p className="text-sm text-gray-500">Allow new users to register accounts</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleSettingChange('userRegistration', !settings.userRegistration)
                  }
                  className={`${
                    settings.userRegistration ? 'bg-primary' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200`}
                >
                  <span
                    className={`${
                      settings.userRegistration ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>

              {/* Session Timeout */}
              <div>
                <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  id="sessionTimeout"
                  min="5"
                  max="1440"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    handleSettingChange('sessionTimeout', parseInt(e.target.value))
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              {/* Max Login Attempts */}
              <div>
                <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                  Maximum Login Attempts
                </label>
                <input
                  type="number"
                  id="maxLoginAttempts"
                  min="3"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) =>
                    handleSettingChange('maxLoginAttempts', parseInt(e.target.value))
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <Mail className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">Email Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Send system notifications via email</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleSettingChange('emailNotifications', !settings.emailNotifications)
                  }
                  className={`${
                    settings.emailNotifications ? 'bg-primary' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200`}
                >
                  <span
                    className={`${
                      settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <Database className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">Backup Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
                  Backup Frequency
                </label>
                <select
                  id="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline">Create Backup Now</Button>
                <Button variant="outline">View Backup History</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} size="lg">
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Settings size={16} className="mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSettings;
