// src/pages/AdminActivities.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Search, Filter, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { getApi } from '../api/Axios';

const AdminActivities = () => {
  // supports both shapes: { state } or direct { user, token }
  const auth = useAuth();
  const token = auth?.token || auth?.state?.token || null;
  const user = auth?.user || auth?.state?.user || null;

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  // stable fetch function so we can call on retry
  const fetchActivities = useCallback(
    async (p = page) => {
      if (!token) {
        setError('No auth token found. Please login again.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const api = getApi(token);
        const res = await api.get('/admin/activities', {
          params: { page: p, limit: 20 },
        });

        const payload = res.data || {};
        setActivities(payload.data || []);
        setTotalPages(payload.pagination?.pages || 1);
      } catch (err) {
        console.error('Error fetching admin activities:', err);
        setError(err.message || 'Failed to load activities.');
      } finally {
        setIsLoading(false);
      }
    },
    [token, page]
  );

  // initial + page effect
  useEffect(() => {
    if (token) fetchActivities(page);
    else {
      setIsLoading(false);
      setError('Not authenticated');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page]);

  // debounce searchTerm -> debouncedSearch (300ms)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // safe formatting of datetime
  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getActivityIcon = (action) => {
    const colors = {
      login: 'text-green-500',
      logout: 'text-red-500',
      profile_update: 'text-blue-500',
      password_change: 'text-orange-500',
      admin_view_users: 'text-purple-500',
      admin_view_analytics: 'text-indigo-500',
    };
    return <Activity className={`h-4 w-4 ${colors[action] || 'text-gray-500'}`} />;
  };

  const getActionBadgeColor = (action) => {
    const colors = {
      login: 'bg-green-100 text-green-800',
      logout: 'bg-red-100 text-red-800',
      profile_update: 'bg-blue-100 text-blue-800',
      password_change: 'bg-orange-100 text-orange-800',
      admin_create_user: 'bg-emerald-100 text-emerald-800',
      admin_delete_user: 'bg-rose-100 text-rose-800',
      admin_update_product: 'bg-yellow-100 text-yellow-800',
      admin_view_users: 'bg-purple-100 text-purple-800',
      admin_view_analytics: 'bg-indigo-100 text-indigo-800',
      admin_view_activities: 'bg-slate-100 text-slate-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  // filter activities using debouncedSearch
  const filteredActivities = activities.filter((activity) =>
    [
      activity.User?.firstName || '',
      activity.User?.lastName || '',
      activity.User?.email || '',
      activity.action || '',
      activity.description || '',
      activity.ipAddress || '',
    ]
      .join(' ')
      .toLowerCase()
      .includes((debouncedSearch || '').toLowerCase())
  );

  // retry handler
  const handleRetry = () => {
    setError(null);
    fetchActivities(page);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">System Activities</h1>
              <p className="text-gray-600">Monitor all user activities and system events</p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Real-time monitoring</span>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities, users, or actions..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // reset page when searching
                }}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <button
              onClick={() => {
                // placeholder for advanced filters modal
                // you can implement filter modal or calls here
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-700">Error</h3>
                <p className="mt-2 text-sm text-gray-600">{error}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRetry}
                  className="px-3 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activities List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {filteredActivities.length > 0 ? (
              <ul className="-mb-8">
                {filteredActivities.map((activity, index) => (
                  <li key={activity.id || activity._id || index}>
                    <div className="relative pb-8">
                      {index !== filteredActivities.length - 1 && (
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
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.User?.firstName || activity.User?.name || '—'}{' '}
                                  {activity.User?.lastName || ''}
                                </p>
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeColor(
                                    activity.action
                                  )}`}
                                >
                                  {(activity.action || '').replace(/_/g, ' ')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">{activity.description}</p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                                <span>{activity.User?.email || ''}</span>
                                {activity.ipAddress && <span>IP: {activity.ipAddress}</span>}
                              </div>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {formatDateTime(activity.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {debouncedSearch ? 'Try adjusting your search criteria.' : 'System activities will appear here.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                </span>
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminActivities;
