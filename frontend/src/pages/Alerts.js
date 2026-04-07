import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { alertService } from '../services/api';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const priorityConfig = {
  Critical: { badge: 'badge-danger', dot: 'bg-danger-500' },
  High: { badge: 'badge-warning', dot: 'bg-warning-500' },
  Medium: { badge: 'badge-info', dot: 'bg-primary-400' },
  Low: { badge: 'badge-success', dot: 'bg-success-500' }
};

const statusConfig = {
  Open: { badge: 'badge-info', label: 'Open' },
  Under_Review: { badge: 'bg-purple-100 text-purple-800 border border-purple-200', label: 'Under Review' },
  Escalated: { badge: 'badge-danger', label: 'Escalated' },
  SAR_Filed: { badge: 'badge-success', label: 'SAR Filed' },
  Closed_No_Action: { badge: 'badge-neutral', label: 'Closed - No Action' },
  Closed_False_Positive: { badge: 'badge-neutral', label: 'Closed - False Positive' }
};

const Alerts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [alerts, setAlerts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    assignedTo: searchParams.get('assignedTo') || ''
  });

  useEffect(() => {
    fetchAlerts();
  }, [searchParams]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const response = await alertService.getAll(params);
      setAlerts(response.data.alerts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
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

  const clearFilters = () => {
    setFilters({ status: '', priority: '', assignedTo: '' });
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = filters.status || filters.priority || filters.assignedTo;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Alerts</h1>
          <p className="page-subtitle">Manage and review suspicious activity alerts</p>
        </div>
        {pagination.total > 0 && (
          <div className="mt-3 sm:mt-0">
            <span className="badge badge-info">{pagination.total} total alerts</span>
          </div>
        )}
      </div>

      {/* Filters Card */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm font-medium text-primary-700">
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filters
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-primary-600 hover:text-primary-800"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Under_Review">Under Review</option>
              <option value="Escalated">Escalated</option>
              <option value="SAR_Filed">SAR Filed</option>
              <option value="Closed_No_Action">Closed - No Action</option>
              <option value="Closed_False_Positive">Closed - False Positive</option>
            </select>
          </div>
          <div>
            <label className="form-label">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="form-select"
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="form-label">Assigned To</label>
            <select
              value={filters.assignedTo}
              onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              className="form-select"
            >
              <option value="">All</option>
              <option value="me">Assigned to Me</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-200 border-t-primary-600"></div>
              <p className="mt-4 text-sm text-primary-500">Loading alerts...</p>
            </div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-primary-600 font-medium">No alerts found</p>
            <p className="text-sm text-primary-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>Alert ID</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Generated</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>
                      <Link to={`/alerts/${alert.alert_id}`} className="text-primary-700 hover:text-primary-900 font-semibold">
                        {alert.alert_id}
                      </Link>
                    </td>
                    <td>
                      <div className="font-medium text-primary-800">{alert.customer_name}</div>
                      <div className="text-xs text-primary-400">{alert.customer_code}</div>
                    </td>
                    <td className="text-primary-700">
                      {alert.alert_type}
                    </td>
                    <td>
                      <span className={`badge ${priorityConfig[alert.alert_priority]?.badge || 'badge-neutral'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priorityConfig[alert.alert_priority]?.dot || 'bg-gray-400'}`}></span>
                        {alert.alert_priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${statusConfig[alert.alert_status]?.badge || 'badge-neutral'}`}>
                        {statusConfig[alert.alert_status]?.label || alert.alert_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="text-primary-500">
                      {alert.assigned_analyst || <span className="italic text-primary-400">Unassigned</span>}
                    </td>
                    <td className="text-primary-500 text-sm">
                      {new Date(alert.alert_generated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50/80 px-5 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-primary-500">
              Page <span className="font-medium text-primary-700">{pagination.page}</span> of{' '}
              <span className="font-medium text-primary-700">{pagination.totalPages}</span>
              <span className="hidden sm:inline"> ({pagination.total} total results)</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary btn-sm"
              >
                Previous
              </button>
              <button
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn-secondary btn-sm"
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

export default Alerts;
