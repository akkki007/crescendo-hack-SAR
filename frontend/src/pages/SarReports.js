import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { sarService } from '../services/api';
import {
  DocumentTextIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const statusConfig = {
  Draft: { badge: 'badge-neutral', label: 'Draft' },
  Pending_Review: { badge: 'badge-warning', label: 'Pending Review' },
  Under_Review: { badge: 'bg-purple-100 text-purple-800 border border-purple-200', label: 'Under Review' },
  Revision_Required: { badge: 'bg-orange-100 text-orange-800 border border-orange-200', label: 'Revision Required' },
  Approved: { badge: 'badge-success', label: 'Approved' },
  Filed: { badge: 'bg-green-200 text-green-900 border border-green-300', label: 'Filed' },
  Rejected: { badge: 'badge-danger', label: 'Rejected' }
};

const SarReports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sars, setSars] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    createdBy: searchParams.get('createdBy') || ''
  });

  useEffect(() => {
    fetchSars();
  }, [searchParams]);

  const fetchSars = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const response = await sarService.getAll(params);
      setSars(response.data.sars);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch SARs:', error);
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
    setFilters({ status: '', createdBy: '' });
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = filters.status || filters.createdBy;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">SAR Reports</h1>
          <p className="page-subtitle">Manage and review Suspicious Activity Reports</p>
        </div>
        {pagination.total > 0 && (
          <div className="mt-3 sm:mt-0">
            <span className="badge badge-info">{pagination.total} total reports</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending_Review">Pending Review</option>
              <option value="Under_Review">Under Review</option>
              <option value="Revision_Required">Revision Required</option>
              <option value="Approved">Approved</option>
              <option value="Filed">Filed</option>
            </select>
          </div>
          <div>
            <label className="form-label">Created By</label>
            <select
              value={filters.createdBy}
              onChange={(e) => handleFilterChange('createdBy', e.target.value)}
              className="form-select"
            >
              <option value="">All</option>
              <option value="me">Created by Me</option>
            </select>
          </div>
        </div>
      </div>

      {/* SAR Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-200 border-t-primary-600"></div>
              <p className="mt-4 text-sm text-primary-500">Loading SAR reports...</p>
            </div>
          </div>
        ) : sars.length === 0 ? (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-primary-600 font-medium">No SAR reports found</p>
            <p className="text-sm text-primary-400 mt-1">Create a SAR from an alert to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>SAR ID</th>
                  <th>Alert</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {sars.map((sar) => (
                  <tr key={sar.id}>
                    <td>
                      <Link to={`/sar/${sar.sar_id}`} className="text-primary-700 hover:text-primary-900 font-semibold flex items-center">
                        <DocumentTextIcon className="w-4 h-4 mr-2 text-primary-400" />
                        {sar.sar_id}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/alerts/${sar.alert_id}`} className="text-primary-600 hover:text-primary-800">
                        {sar.alert_id}
                      </Link>
                    </td>
                    <td>
                      <div className="font-medium text-primary-800">{sar.customer_name}</div>
                      <div className="text-xs text-primary-400">{sar.customer_code}</div>
                    </td>
                    <td>
                      <span className={`badge ${statusConfig[sar.sar_status]?.badge || 'badge-neutral'}`}>
                        {statusConfig[sar.sar_status]?.label || sar.sar_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="text-primary-600">
                      {sar.created_by_name}
                    </td>
                    <td className="text-primary-500 text-sm">
                      {new Date(sar.created_at).toLocaleDateString()}
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
              <span className="hidden sm:inline"> ({pagination.total} total reports)</span>
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

export default SarReports;
