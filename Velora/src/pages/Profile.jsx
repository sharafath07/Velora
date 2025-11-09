import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import authService from '../api/authService';

const Profile = () => {
  const [user, setUser] = useState(null); // ✅ user fetched dynamically
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ error: '', success: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

  // ✅ Fetch user profile once component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
        setFormData({
          firstName: profile?.firstName || '',
          lastName: profile?.lastName || '',
          phone: profile?.phone || '',
          address: profile?.address || '',
        });
      } catch (error) {
        console.error('Failed to load user profile:', error);
        setMessage({ error: 'Failed to load profile.', success: '' });
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ error: '', success: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ error: '', success: '' });

    try {
      // ❌ Old: const updateProfile = authService.updateProfile(user); 
      // that executes immediately instead of defining a function
      // ✅ Correct:
      const updatedUser = await authService.updateProfile(formData);

      setUser(updatedUser);
      setMessage({ error: '', success: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage({ error: err.message || 'Failed to update profile', success: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    setIsEditing(false);
    setMessage({ error: '', success: '' });
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center"
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* ✅ Display success and error messages */}
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

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
                        !isEditing ? 'bg-gray-50' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
                        !isEditing ? 'bg-gray-50' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={user?.email}
                      disabled
                      className="pl-10 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
                        !isEditing ? 'bg-gray-50' : ''
                      }`}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={user?.role === 'admin' ? 'Administrator' : 'User'}
                      disabled
                      className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1 relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      name="address"
                      id="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
                        !isEditing ? 'bg-gray-50' : ''
                      }`}
                      placeholder="123 Main St, City, State 12345"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <Save size={16} className="mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;