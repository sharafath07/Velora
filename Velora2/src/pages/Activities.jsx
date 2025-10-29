import React, { useState, useEffect } from 'react';
import { Activity, Clock, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Activities = () => {
    const { state } = useAuth();
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/activities?page=${page}&limit=10`, {
                    headers: {
                        'Authorization': `Bearer ${state.token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setActivities(data.data);
                    setTotalPages(data.pagination.pages);
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, [state.token, page]);

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getActivityIcon = (action) => {
        switch (action) {
            case 'login':
                return <Activity className="h-4 w-4 text-green-500" />;
            case 'profile_update':
                return <Activity className="h-4 w-4 text-blue-500" />;
            case 'password_change':
                return <Activity className="h-4 w-4 text-orange-500" />;
            default:
                return <Activity className="h-4 w-4 text-gray-500" />;
        }
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
                {/* Header */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Activity Log</h1>
                                <p className="text-gray-600">Track your account activities and login history</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-500">All Activities</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activities List */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        {activities.length > 0 ? (
                            <div className="flow-root">
                                <ul className="-mb-8">
                                    {activities.map((activity, index) => (
                                        <li key={activity.id}>
                                            <div className="relative pb-8">
                                                {index !== activities.length - 1 && (
                                                    <span
                                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <div className="relative flex space-x-3">
                                                    <div>
                                                        <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                                                            {getActivityIcon(activity.action)}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1 pt-1.5">
                                                        <div className="flex justify-between space-x-4">
                                                            <div>
                                                                <p className="text-sm text-gray-900 font-medium">
                                                                    {activity.description}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Action: {activity.action}
                                                                </p>
                                                                {activity.ipAddress && (
                                                                    <p className="text-xs text-gray-500">
                                                                        IP: {activity.ipAddress}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                                <div className="flex items-center">
                                                                    <Clock className="h-3 w-3 mr-1" />
                                                                    {formatDateTime(activity.createdAt)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No activities</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Your account activities will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Page <span className="font-medium">{page}</span> of{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                                        disabled={page === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Activities;
