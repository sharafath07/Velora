import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, UserCheck, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { getApi } from '../api/Axios';

const AdminAnalytics = () => {
  const auth = useAuth();
  const token = auth?.token || auth?.state?.token;
  const user = auth?.user || auth?.state?.user;
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        const api = getApi(token);
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data?.data || {});
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

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
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">System performance and user analytics overview</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Users', value: overview.totalUsers, icon: Users },
            { label: 'Active Users', value: overview.activeUsers, icon: UserCheck },
            { label: 'New Users (30d)', value: overview.recentRegistrations, icon: TrendingUp },
            { label: 'Admin Users', value: overview.adminUsers, icon: Activity },
          ].map(({ label, value, icon: Icon }, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 flex items-center">
                <Icon className="h-6 w-6 text-gray-400" />
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
                  <dd className="text-lg font-medium text-gray-900">{value || 0}</dd>
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
                User Registration Trend (Last 7 Days)
              </h3>
              <div className="mt-4 flex items-end space-x-2 h-32">
                {analytics.registrationTrend.map((day, index) => {
                  const maxCount = Math.max(...analytics.registrationTrend.map((d) => d.count));
                  const height = maxCount > 0 ? (day.count / maxCount) * 100 : 4;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary-dark"
                        style={{ height: `${Math.max(height, 4)}%` }}
                        title={`${day.count} registrations`}
                      />
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

        {/* User Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role Distribution */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Role Distribution</h3>
              <div className="space-y-4">
                {[
                  { label: 'Regular Users', value: overview.regularUsers, color: 'bg-blue-600' },
                  { label: 'Administrators', value: overview.adminUsers, color: 'bg-purple-600' },
                ].map(({ label, value, color }, i) => (
                  <div key={i}>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className="text-sm text-gray-500">{value || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full`}
                        style={{
                          width: `${
                            overview.totalUsers ? (value / overview.totalUsers) * 100 : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-4">
                {[
                  {
                    label: 'Active Accounts',
                    value: overview.activeUsers,
                    color: 'bg-green-600',
                  },
                  {
                    label: 'Inactive Accounts',
                    value: (overview.totalUsers || 0) - (overview.activeUsers || 0),
                    color: 'bg-red-600',
                  },
                ].map(({ label, value, color }, i) => (
                  <div key={i}>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className="text-sm text-gray-500">{value || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full`}
                        style={{
                          width: `${
                            overview.totalUsers ? (value / overview.totalUsers) * 100 : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnalytics;
