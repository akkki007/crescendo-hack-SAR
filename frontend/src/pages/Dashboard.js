import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BellAlertIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color, bgColor, link, trend }) => (
  <Link to={link} className="card card-hover p-5 group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-primary-500 uppercase tracking-wider">{title}</p>
        <p className="mt-2 text-3xl font-bold text-primary-900">{value}</p>
        {trend && (
          <p className="mt-1 flex items-center text-xs text-success-600">
            <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs font-medium text-primary-600 group-hover:text-primary-800">
      View details
      <ArrowRightIcon className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, activityRes] = await Promise.all([
          dashboardService.getOverview(),
          dashboardService.getRecentActivity(10)
        ]);
        setStats(overviewRes.data);
        setRecentActivity(activityRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-200 border-t-primary-600"></div>
          <p className="mt-4 text-sm text-primary-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.firstName}. Here's your compliance overview.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="text-xs text-primary-500">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Alert Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-primary-800 uppercase tracking-wider">Alert Overview</h2>
          <Link to="/alerts" className="text-xs font-medium text-primary-600 hover:text-primary-800 flex items-center">
            View all alerts <ArrowRightIcon className="w-3 h-3 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Open Alerts"
            value={stats?.alerts?.open_alerts || 0}
            icon={BellAlertIcon}
            color="text-warning-600"
            bgColor="bg-warning-50"
            link="/alerts?status=Open"
          />
          <StatCard
            title="Under Review"
            value={stats?.alerts?.under_review || 0}
            icon={ClockIcon}
            color="text-primary-600"
            bgColor="bg-primary-50"
            link="/alerts?status=Under_Review"
          />
          <StatCard
            title="High Priority"
            value={stats?.alerts?.high_priority || 0}
            icon={ExclamationTriangleIcon}
            color="text-danger-600"
            bgColor="bg-danger-50"
            link="/alerts?priority=High"
          />
          <StatCard
            title="Critical"
            value={stats?.alerts?.critical || 0}
            icon={ExclamationTriangleIcon}
            color="text-danger-700"
            bgColor="bg-danger-100"
            link="/alerts?priority=Critical"
          />
        </div>
      </div>

      {/* SAR Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-primary-800 uppercase tracking-wider">SAR Report Status</h2>
          <Link to="/sar" className="text-xs font-medium text-primary-600 hover:text-primary-800 flex items-center">
            View all reports <ArrowRightIcon className="w-3 h-3 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Draft"
            value={stats?.sars?.draft || 0}
            icon={DocumentTextIcon}
            color="text-gray-600"
            bgColor="bg-gray-100"
            link="/sar?status=Draft"
          />
          <StatCard
            title="Pending Review"
            value={stats?.sars?.pending_review || 0}
            icon={ClockIcon}
            color="text-warning-600"
            bgColor="bg-warning-50"
            link="/sar?status=Pending_Review"
          />
          <StatCard
            title="Approved"
            value={stats?.sars?.approved || 0}
            icon={CheckCircleIcon}
            color="text-success-600"
            bgColor="bg-success-50"
            link="/sar?status=Approved"
          />
          <StatCard
            title="Filed"
            value={stats?.sars?.filed || 0}
            icon={CheckCircleIcon}
            color="text-success-700"
            bgColor="bg-success-100"
            link="/sar?status=Filed"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Workload */}
        {stats?.workload && stats.workload.length > 0 && (
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4">Team Workload</h2>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th>Analyst</th>
                    <th>Open Alerts</th>
                    <th>Pending SARs</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {stats.workload.map((user) => (
                    <tr key={user.id}>
                      <td className="font-medium">{user.name}</td>
                      <td>
                        <span className={`badge ${user.open_alerts > 5 ? 'badge-warning' : 'badge-info'}`}>
                          {user.open_alerts}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{user.pending_sars}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-primary-800 uppercase tracking-wider">Recent Activity</h2>
            <Link to="/audit" className="text-xs font-medium text-primary-600 hover:text-primary-800">
              View all
            </Link>
          </div>
          <div className="flow-root">
            <ul className="-mb-6">
              {recentActivity.length === 0 ? (
                <li className="text-sm text-primary-500 text-center py-8">No recent activity</li>
              ) : (
                recentActivity.slice(0, 6).map((activity, idx) => (
                  <li key={idx}>
                    <div className="relative pb-6">
                      {idx !== Math.min(recentActivity.length, 6) - 1 && (
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" />
                      )}
                      <div className="relative flex items-start space-x-3">
                        <div>
                          <span className="h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary-700">
                              {activity.action_category?.[0] || 'S'}
                            </span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1">
                          <div className="text-sm text-primary-800">
                            <span className="font-medium">{activity.user_name || 'System'}</span>
                            <span className="text-primary-500"> {activity.action.toLowerCase().replace(/_/g, ' ')}</span>
                          </div>
                          <div className="mt-0.5 text-xs text-primary-400">
                            {new Date(activity.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
