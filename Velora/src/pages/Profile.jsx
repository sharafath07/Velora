import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard as Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';

const Profile = () => {
    const { state, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        firstName: state.user?.firstName || '',
        lastName: state.user?.lastName || '',
        phone: state.user?.phone || '',
        address: state.user?.address || '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await updateProfile(formData);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            setError(error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: state.user?.firstName || '',
            lastName: state.user?.lastName || '',
            phone: state.user?.phone || '',
            address: state.user?.address || '',
        });
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

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

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                                            value={state.user?.email || ''}
                                            disabled
                                            className="pl-10 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                                </div>

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

                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            value={state.user?.role === 'admin' ? 'Administrator' : 'User'}
                                            disabled
                                            className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                                        />
                                    </div>
                                </div>

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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                    >
                                        <X size={16} className="mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                    >
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