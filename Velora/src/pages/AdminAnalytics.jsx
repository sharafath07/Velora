import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, UserCheck, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

// interface Analytics {
//   overview: {
//     totalUsers: number;
//     activeUsers: number;
//     adminUsers: number;
//     regularUsers: number;
//     recentRegistrations: number;
//   };
//   registrationTrend: { date: string; count: number }[];
// }

const AdminAnalytics = () => {
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">System performance and user analytics</p>
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
              User Registration Trend (Last 7 Days)
            </h3>
            <div className="mt-4">
              <div className="flex items-end space-x-2 h-32">
                {analytics?.registrationTrend.map((day, index) => {
                  const maxCount = Math.max(...analytics.registrationTrend.map(d => d.count));
                  const height = maxCount > 0 ? (day.count / maxCount) * 100 : 4;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-primary rounded-t w-full min-h-[4px] transition-all duration-300 hover:bg-primary-dark"
                        style={{ height: `${Math.max(height, 4)}%` }}
                        title={`${day.count} registrations`}
                      />
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-xs font-medium text-gray-900">
                        {day.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                User Role Distribution
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Regular Users</span>
                  <span className="text-sm text-gray-500">
                    {analytics?.overview.regularUsers || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        analytics?.overview.totalUsers
                          ? (analytics.overview.regularUsers / analytics.overview.totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Administrators</span>
                  <span className="text-sm text-gray-500">
                    {analytics?.overview.adminUsers || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${
                        analytics?.overview.totalUsers
                          ? (analytics.overview.adminUsers / analytics.overview.totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Active Accounts</span>
                  <span className="text-sm text-gray-500">
                    {analytics?.overview.activeUsers || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        analytics?.overview.totalUsers
                          ? (analytics.overview.activeUsers / analytics.overview.totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Inactive Accounts</span>
                  <span className="text-sm text-gray-500">
                    {analytics?.overview.totalUsers && analytics?.overview.activeUsers
                      ? analytics.overview.totalUsers - analytics.overview.activeUsers
                      : 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${
                        analytics?.overview.totalUsers
                          ? ((analytics.overview.totalUsers - analytics.overview.activeUsers) / analytics.overview.totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnalytics;