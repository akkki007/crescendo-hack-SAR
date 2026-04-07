import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { auditService } from '../services/api';

const AuditLogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    actionCategory: searchParams.get('actionCategory') || '',
    entityType: searchParams.get('entityType') || ''
  });

  useEffect(() => {
    fetchLogs();
  }, [searchParams]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const response = await auditService.getAll(params);
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const categoryColors = {
    Authentication: 'bg-blue-100 text-blue-800',
    Alert: 'bg-orange-100 text-orange-800',
    SAR: 'bg-purple-100 text-purple-800',
    Customer: 'bg-green-100 text-green-800',
    System: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-500">System activity and compliance audit trail</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.actionCategory}
              onChange={(e) => handleFilterChange('actionCategory', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              <option value="Authentication">Authentication</option>
              <option value="Alert">Alert</option>
              <option value="SAR">SAR</option>
              <option value="Customer">Customer</option>
              <option value="System">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
            <select
              value={filters.entityType}
              onChange={(e) => handleFilterChange('entityType', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Types</option>
              <option value="User">User</option>
              <option value="Alert">Alert</option>
              <option value="SAR">SAR</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No audit logs found
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action.replace(/_/g, ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[log.action_category] || 'bg-gray-100 text-gray-800'}`}>
                      {log.action_category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user_email || 'System'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.entity_type || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ip_address || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
