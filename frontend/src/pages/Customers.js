import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { customerService } from '../services/api';

const riskColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  'Very High': 'bg-red-100 text-red-800'
};

const Customers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchCustomers();
  }, [searchParams]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const response = await customerService.getAll(params);
      setCustomers(response.data.customers);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500">View customer profiles and associated alerts</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, customer ID, or PAN..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Search
          </button>
        </div>
      </form>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No customers found
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Since</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/customers/${customer.customer_id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium"
                    >
                      {customer.customer_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.full_name}</div>
                    {customer.email && (
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.customer_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      customer.kyc_status === 'Verified'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {customer.kyc_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${riskColors[customer.kyc_risk_rating]}`}>
                      {customer.kyc_risk_rating}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.relationship_start_date).toLocaleDateString()}
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

export default Customers;
