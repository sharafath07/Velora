import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import authService from '../api/authService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ error: '', success: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

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
        setMessage({ error: 'Please log in to access your profile.', success: '' });
        window.location.href = '/login'; // ✅ redirect if not logged in
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
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 size={16} className="mr-2" />
              Edit Profile
            </Button>
          )}
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InputField
              icon={<User />}
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <InputField
              icon={<User />}
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <InputField
              icon={<Mail />}
              label="Email"
              value={user?.email}
              disabled
              note="Email cannot be changed"
            />
            <InputField
              icon={<Phone />}
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="(555) 123-4567"
            />
            <InputField
              icon={<MapPin />}
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              multiline
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                <X size={16} className="mr-2" /> Cancel
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
    </Layout>
  );
};

// ✅ Small helper component for cleaner inputs
const InputField = ({ label, icon, name, value, onChange, disabled, placeholder, multiline, note }) => (
  <div className="sm:col-span-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-3 text-gray-400">{icon}</span>}
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={3}
          placeholder={placeholder}
          className={`pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
            disabled ? 'bg-gray-50' : ''
          }`}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
            disabled ? 'bg-gray-50' : ''
          }`}
        />
      )}
    </div>
    {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
  </div>
);

export default Profile;
