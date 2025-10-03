import React, { useState, useEffect } from 'react';
import { Users, Activity, TrendingUp, UserCheck } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
    const { state } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/analytics', {
                    headers: {
                        'Authorization': `Bearer ${state.token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setAnalytics(data.data);
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [state.token]);

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600">
                            System overview and user management analytics.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Users
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {analytics?.overview.totalUsers || 0}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <UserCheck className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Active Users
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {analytics?.overview.activeUsers || 0}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingUp className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            New Users (30d)
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {analytics?.overview.recentRegistrations || 0}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Activity className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Admin Users
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {analytics?.overview.adminUsers || 0}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Trend Chart */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Registration Trend (Last 7 Days)
                        </h3>
                        <div className="mt-4">
                            <div className="flex items-end space-x-2 h-32">
                                {analytics?.registrationTrend.map((day, index) => (
                                    <div key={index} className="flex flex-col items-center flex-1">
                                        <div
                                            className="bg-primary rounded-t w-full min-h-[4px]"
                                            style={{
                                                height: `${Math.max((day.count / Math.max(...analytics.registrationTrend.map(d => d.count))) * 100, 4)}%`,
                                            }}
                                        />
                                        <div className="text-xs text-gray-500 mt-2">
                                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </div>
                                        <div className="text-xs font-medium text-gray-900">
                                            {day.count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Recent System Activities
                        </h3>
                        {analytics?.recentActivities && analytics.recentActivities.length > 0 ? (
                            <div className="flow-root">
                                <ul className="-mb-8">
                                    {analytics.recentActivities.map((activity, index) => (
                                        <li key={activity.id}>
                                            <div className="relative pb-8">
                                                {index !== analytics.recentActivities.length - 1 && (
                                                    <span
                                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <div className="relative flex space-x-3">
                                                    <div>
                                                        <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center ring-8 ring-white">
                                                            <Activity className="h-4 w-4 text-white" />
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">
                                                                <span className="font-medium text-gray-900">
                                                                    {activity.User.firstName} {activity.User.lastName}
                                                                </span>{' '}
                                                                {activity.description}
                                                            </p>
                                                        </div>
                                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                            {formatDateTime(activity.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                No recent activities to display.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
