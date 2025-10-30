import React, { useState, useEffect } from 'react';
import { Users, Activity, TrendingUp, UserCheck } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { getApi } from '../api/Axios'; // ✅ import the correct function

const AdminDashboard = () => {
  const { state } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const api = getApi(state.token); // ✅ create axios instance with token
        const response = await api.get('/admin/analytics');
        setAnalytics(response.data.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.message || 'Failed to load analytics.');
      } finally {
        setIsLoading(false);
      }
    };

    if (state?.token) fetchAnalytics();
  }, [state.token]);

  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  const overview = analytics?.overview || {};

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">System overview and user management analytics.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Total Users', icon: Users, value: overview.totalUsers || 0 },
            { title: 'Active Users', icon: UserCheck, value: overview.activeUsers || 0 },
            { title: 'New Users (30d)', icon: TrendingUp, value: overview.recentRegistrations || 0 },
            { title: 'Admin Users', icon: Activity, value: overview.adminUsers || 0 },
          ].map(({ title, icon: Icon, value }) => (
            <div key={title} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 flex items-center">
                <Icon className="h-6 w-6 text-gray-400" />
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">{title}</p>
                  <p className="text-lg font-medium text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Registration Trend Chart */}
        {analytics?.registrationTrend && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Registration Trend (Last 7 Days)
              </h3>
              <div className="flex items-end space-x-2 h-32">
                {analytics.registrationTrend.map((day, index) => {
                  const maxCount = Math.max(...analytics.registrationTrend.map((d) => d.count));
                  const height = Math.max((day.count / maxCount) * 100, 4);
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary-dark"
                        style={{ height: `${height}%` }}
                        title={`${day.count} registrations`}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-xs font-medium text-gray-900">{day.count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent System Activities</h3>
            {analytics?.recentActivities?.length > 0 ? (
              <ul className="flow-root -mb-8">
                {analytics.recentActivities.map((activity, index) => (
                  <li key={activity.id} className="relative pb-8">
                    {index !== analytics.recentActivities.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                    )}
                    <div className="relative flex space-x-3">
                      <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center ring-8 ring-white">
                        <Activity className="h-4 w-4 text-white" />
                      </span>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            {activity.User.firstName} {activity.User.lastName}
                          </span>{' '}
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDateTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activities to display.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
