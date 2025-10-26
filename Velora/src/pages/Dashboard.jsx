import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const formatDate = (dateString, withTime = false) => {
    const options = withTime
      ? {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      : {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };

    return new Date(dateString).toLocaleString('en-US', options);
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
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your account activity and information.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Activity,
              label: 'Total Activities',
              value: stats?.totalActivities || 0,
            },
            {
              icon: Calendar,
              label: 'Member Since',
              value: stats?.memberSince ? formatDate(stats.memberSince) : 'N/A',
            },
            {
              icon: Clock,
              label: 'Last Login',
              value: stats?.lastLogin ? formatDate(stats.lastLogin, true) : 'N/A',
            },
            {
              icon: User,
              label: 'Account Status',
              value: 'Active',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <item.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.label}
                      </dt>
                      <dd
                        className={`text-lg font-medium ${
                          item.label === 'Account Status'
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {item.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activities
            </h3>
            {stats?.recentActivities?.length ? (
              <ul className="-mb-8">
                {stats.recentActivities.map((activity, index) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== stats.recentActivities.length - 1 && (
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
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                          <p className="text-sm whitespace-nowrap text-gray-500">
                            {formatDate(activity.createdAt, true)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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

export default Dashboard;
