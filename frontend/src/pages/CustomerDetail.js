import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerService } from '../services/api';

const CustomerDetail = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerProfile();
  }, [id]);

  const fetchCustomerProfile = async () => {
    try {
      const response = await customerService.getProfile(id);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch customer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-12 text-gray-500">Customer not found</div>;
  }

  const { customer, accounts, alertsSummary, sarSummary } = profile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{customer.full_name}</h1>
        <p className="text-gray-500">Customer ID: {customer.customer_id}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Accounts</p>
          <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Alerts</p>
          <p className="text-2xl font-bold text-gray-900">{alertsSummary?.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Open Alerts</p>
          <p className="text-2xl font-bold text-orange-600">{alertsSummary?.open_alerts || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Filed SARs</p>
          <p className="text-2xl font-bold text-red-600">{sarSummary?.filed_sars || 0}</p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="text-sm text-gray-900">{customer.customer_type}</dd>
            </div>
            {customer.date_of_birth && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="text-sm text-gray-900">{new Date(customer.date_of_birth).toLocaleDateString()}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Nationality</dt>
              <dd className="text-sm text-gray-900">{customer.nationality || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Occupation</dt>
              <dd className="text-sm text-gray-900">{customer.occupation || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{customer.email || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="text-sm text-gray-900">{customer.phone_primary || '-'}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">KYC & Compliance</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">KYC Status</dt>
              <dd>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  customer.kyc_status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {customer.kyc_status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Risk Rating</dt>
              <dd>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  customer.kyc_risk_rating === 'Low' ? 'bg-green-100 text-green-800' :
                  customer.kyc_risk_rating === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {customer.kyc_risk_rating}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">PAN</dt>
              <dd className="text-sm text-gray-900">{customer.pan_number || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Relationship Since</dt>
              <dd className="text-sm text-gray-900">{new Date(customer.relationship_start_date).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">PEP Status</dt>
              <dd className="text-sm text-gray-900">{customer.pep_status ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Expected Monthly Turnover</dt>
              <dd className="text-sm text-gray-900">
                INR {parseFloat(customer.expected_monthly_turnover_min || 0).toLocaleString()} -
                {parseFloat(customer.expected_monthly_turnover_max || 0).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Accounts */}
      {accounts.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Accounts</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.account_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {account.account_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      account.account_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {account.account_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    INR {parseFloat(account.current_balance || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.branch_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Link
          to={`/alerts?customerId=${customer.id}`}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          View Alerts
        </Link>
      </div>
    </div>
  );
};

export default CustomerDetail;
