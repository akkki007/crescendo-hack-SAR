import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { alertService, sarService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  UserIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldExclamationIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

// SAR Generation Modal Component
const SARGenerationModal = ({ isOpen, onClose, alert, onSarCreated }) => {
  const [generating, setGenerating] = useState(false);
  const [narrative, setNarrative] = useState('');
  const [auditTrail, setAuditTrail] = useState([]);
  const [error, setError] = useState(null);
  const [sarId, setSarId] = useState(null);
  const [step, setStep] = useState('idle'); // idle, generating, done
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setError(null);
    setStep('generating');

    try {
      // Single call to create SAR and generate narrative (Python AI service at port 8000)
      const response = await sarService.createAndGenerate(alert.alert_id, '');
      const newSarId = response.data.sar_id || response.data.id;
      setSarId(newSarId);
      setNarrative(response.data.narrative);
      setAuditTrail(response.data.audit_trail || []);
      setStep('done');

      if (onSarCreated) {
        onSarCreated(newSarId);
      }
    } catch (err) {
      console.error('SAR generation error:', err);
      setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to generate SAR. Is the AI service running at port 8000?');
      setStep('idle');
    }
  };

  const handleViewFullSar = () => {
    if (sarId) {
      navigate(`/sar/${sarId}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-primary-950/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-3">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">SAR Narrative Generator</h3>
                  <p className="text-sm text-primary-200">AI-Powered Report Generation</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {step === 'idle' && !narrative && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SparklesIcon className="w-10 h-10 text-accent-600" />
                </div>
                <h4 className="text-xl font-semibold text-primary-800 mb-2">Generate SAR Narrative</h4>
                <p className="text-primary-500 mb-6 max-w-md mx-auto">
                  Our AI will analyze the alert data, customer profile, and transaction patterns to generate a comprehensive SAR narrative.
                </p>

                {error && (
                  <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm mb-6 max-w-md mx-auto">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  className="btn-accent px-8 py-3 text-base"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Generate SAR Narrative
                </button>
              </div>
            )}

            {step === 'generating' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ArrowPathIcon className="w-10 h-10 text-primary-600 animate-spin" />
                </div>
                <h4 className="text-xl font-semibold text-primary-800 mb-2">
                  Generating SAR Narrative...
                </h4>
                <p className="text-primary-500">
                  AI is analyzing the data and generating the narrative. This may take a moment.
                </p>
              </div>
            )}

            {step === 'done' && narrative && (
              <div className="space-y-6">
                {/* Success Header */}
                <div className="bg-success-50 border border-success-200 rounded-lg p-4 flex items-center">
                  <CheckCircleIcon className="w-6 h-6 text-success-600 mr-3" />
                  <div>
                    <p className="font-medium text-success-800">SAR Narrative Generated Successfully</p>
                    <p className="text-sm text-success-600">SAR ID: {sarId}</p>
                  </div>
                </div>

                {/* Narrative Preview */}
                <div>
                  <h4 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-3">
                    Generated Narrative
                  </h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-primary-700 font-mono leading-relaxed">
                      {narrative}
                    </pre>
                  </div>
                </div>

                {/* Audit Trail Preview */}
                {auditTrail.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-3">
                      Audit Trail ({auditTrail.length} items)
                    </h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                      {auditTrail.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="text-xs text-primary-600 mb-2 pb-2 border-b border-gray-200 last:border-0">
                          <span className="font-medium">{item.source_field || 'Data Point'}:</span>{' '}
                          {item.sar_text?.substring(0, 100) || JSON.stringify(item).substring(0, 100)}...
                        </div>
                      ))}
                      {auditTrail.length > 5 && (
                        <p className="text-xs text-primary-400">+ {auditTrail.length - 5} more items</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
            {step === 'done' && sarId && (
              <button onClick={handleViewFullSar} className="btn-primary">
                <DocumentCheckIcon className="w-4 h-4 mr-2" />
                View Full SAR Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main AlertDetail Component
const AlertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alert, setAlert] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showSarModal, setShowSarModal] = useState(false);

  useEffect(() => {
    fetchAlertData();
  }, [id]);

  const fetchAlertData = async () => {
    try {
      const [alertRes, transRes] = await Promise.all([
        alertService.getById(id),
        alertService.getTransactions(id)
      ]);
      setAlert(alertRes.data);
      setTransactions(transRes.data);
    } catch (error) {
      console.error('Failed to fetch alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async () => {
    setActionLoading(true);
    try {
      await alertService.assign(id);
      fetchAlertData();
    } catch (error) {
      console.error('Failed to assign alert:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const priorityConfig = {
    Critical: { color: 'text-danger-700', bg: 'bg-danger-100', border: 'border-danger-200' },
    High: { color: 'text-warning-700', bg: 'bg-warning-100', border: 'border-warning-200' },
    Medium: { color: 'text-primary-700', bg: 'bg-primary-100', border: 'border-primary-200' },
    Low: { color: 'text-success-700', bg: 'bg-success-100', border: 'border-success-200' }
  };

  const statusConfig = {
    Open: { badge: 'badge-info', label: 'Open' },
    Under_Review: { badge: 'bg-purple-100 text-purple-800 border border-purple-200', label: 'Under Review' },
    Escalated: { badge: 'badge-danger', label: 'Escalated' },
    SAR_Filed: { badge: 'badge-success', label: 'SAR Filed' },
    Closed_No_Action: { badge: 'badge-neutral', label: 'Closed - No Action' },
    Closed_False_Positive: { badge: 'badge-neutral', label: 'Closed - False Positive' }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-200 border-t-primary-600"></div>
          <p className="mt-4 text-sm text-primary-500">Loading alert...</p>
        </div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-primary-600 font-medium">Alert not found</p>
        <Link to="/alerts" className="text-sm text-primary-500 hover:text-primary-700 mt-2 inline-block">
          Back to Alerts
        </Link>
      </div>
    );
  }

  const priority = priorityConfig[alert.alert_priority] || priorityConfig.Medium;

  return (
    <div className="space-y-6">
      {/* SAR Generation Modal */}
      <SARGenerationModal
        isOpen={showSarModal}
        onClose={() => setShowSarModal(false)}
        alert={alert}
        onSarCreated={(sarId) => console.log('SAR created:', sarId)}
      />

      {/* Header */}
      <div className="page-header">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="page-title">{alert.alert_id}</h1>
              <span className={`badge ${statusConfig[alert.alert_status]?.badge || 'badge-neutral'}`}>
                {statusConfig[alert.alert_status]?.label || alert.alert_status?.replace(/_/g, ' ')}
              </span>
              <span className={`badge ${priority.bg} ${priority.color} ${priority.border}`}>
                {alert.alert_priority} Priority
              </span>
            </div>
            <p className="page-subtitle">{alert.alert_type}</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
            <Link to="/alerts" className="btn-secondary btn-sm">
              Back to Alerts
            </Link>
            {!alert.assigned_to && ['senior_analyst', 'compliance_officer', 'admin'].includes(user.role) && (
              <button
                onClick={handleAssignToMe}
                disabled={actionLoading}
                className="btn-secondary"
              >
                <UserIcon className="w-4 h-4 mr-1.5" />
                Assign to Me
              </button>
            )}
            {alert.alert_status !== 'SAR_Filed' && ['analyst', 'senior_analyst', 'admin'].includes(user.role) && (
              <button
                onClick={() => setShowSarModal(true)}
                className="btn-accent"
              >
                <SparklesIcon className="w-4 h-4 mr-1.5" />
                Generate SAR Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alert & Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alert Information Card */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4 flex items-center">
              <ShieldExclamationIcon className="w-5 h-5 mr-2 text-primary-600" />
              Alert Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Risk Rating</dt>
                <dd className="mt-1 text-lg font-semibold text-primary-800">{alert.risk_rating}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Risk Score</dt>
                <dd className="mt-1">
                  <span className="text-lg font-semibold text-primary-800">{alert.risk_score}</span>
                  <span className="text-sm text-primary-500">/100</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Monitoring System</dt>
                <dd className="mt-1 text-sm text-primary-700">{alert.monitoring_system || 'AML System'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Review Period</dt>
                <dd className="mt-1 text-sm text-primary-700">
                  {alert.review_period_start} to {alert.review_period_end}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Assigned Analyst</dt>
                <dd className="mt-1 text-sm text-primary-700">{alert.assigned_analyst || 'Unassigned'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Generated</dt>
                <dd className="mt-1 text-sm text-primary-700">
                  {alert.alert_generated_at ? new Date(alert.alert_generated_at).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-primary-600" />
              Customer Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <IdentificationIcon className="w-5 h-5 text-primary-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Customer ID</dt>
                    <dd className="text-sm font-semibold text-primary-800">{alert.customer_id}</dd>
                  </div>
                </div>
                <div className="flex items-start">
                  <UserIcon className="w-5 h-5 text-primary-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Full Name</dt>
                    <dd className="text-sm font-semibold text-primary-800">{alert.full_name}</dd>
                  </div>
                </div>
                <div className="flex items-start">
                  <BuildingOfficeIcon className="w-5 h-5 text-primary-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Occupation</dt>
                    <dd className="text-sm text-primary-700">{alert.occupation || 'Not specified'}</dd>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-primary-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Nationality</dt>
                    <dd className="text-sm text-primary-700">{alert.nationality || 'India'}</dd>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CalendarIcon className="w-5 h-5 text-primary-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Date of Birth</dt>
                    <dd className="text-sm text-primary-700">{alert.date_of_birth || 'N/A'}</dd>
                  </div>
                </div>
                <div className="flex items-start">
                  <ShieldExclamationIcon className="w-5 h-5 text-primary-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">KYC Risk Rating</dt>
                    <dd className={`text-sm font-semibold ${
                      alert.kyc_risk_rating === 'High' ? 'text-danger-600' :
                      alert.kyc_risk_rating === 'Medium' ? 'text-warning-600' : 'text-success-600'
                    }`}>{alert.kyc_risk_rating}</dd>
                  </div>
                </div>
                <div className="flex items-start">
                  <ClockIcon className="w-5 h-5 text-primary-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Customer Since</dt>
                    <dd className="text-sm text-primary-700">{alert.relationship_start_date || 'N/A'}</dd>
                  </div>
                </div>
                <div className="flex items-start">
                  <BanknotesIcon className="w-5 h-5 text-primary-400 mr-3 mt-0.5" />
                  <div>
                    <dt className="text-xs font-medium text-primary-500 uppercase tracking-wider">Account Type</dt>
                    <dd className="text-sm text-primary-700">{alert.account_type || 'Savings'}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4 border-l-4 border-l-success-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-primary-500 uppercase tracking-wider">Inbound</p>
                  <p className="text-xl font-bold text-success-700 mt-1">
                    ₹{parseFloat(alert.total_inbound_amount || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-primary-400 mt-1">{alert.inbound_transaction_count || 0} transactions</p>
                </div>
                <ArrowTrendingDownIcon className="w-8 h-8 text-success-300" />
              </div>
            </div>
            <div className="card p-4 border-l-4 border-l-danger-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-primary-500 uppercase tracking-wider">Outbound</p>
                  <p className="text-xl font-bold text-danger-700 mt-1">
                    ₹{parseFloat(alert.total_outbound_amount || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-primary-400 mt-1">{alert.outbound_transaction_count || 0} transactions</p>
                </div>
                <ArrowTrendingUpIcon className="w-8 h-8 text-danger-300" />
              </div>
            </div>
            <div className="card p-4 border-l-4 border-l-primary-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-primary-500 uppercase tracking-wider">Counterparties</p>
                  <p className="text-xl font-bold text-primary-700 mt-1">{alert.unique_counterparties || 0}</p>
                  <p className="text-xs text-primary-400 mt-1">unique parties</p>
                </div>
                <UserIcon className="w-8 h-8 text-primary-300" />
              </div>
            </div>
            <div className="card p-4 border-l-4 border-l-accent-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-primary-500 uppercase tracking-wider">Expected</p>
                  <p className="text-xl font-bold text-accent-700 mt-1">
                    ₹{parseFloat(alert.expected_monthly_turnover_max || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-primary-400 mt-1">monthly turnover</p>
                </div>
                <BanknotesIcon className="w-8 h-8 text-accent-300" />
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          {transactions.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-primary-800 uppercase tracking-wider">
                  Suspicious Transactions ({transactions.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Channel</th>
                      <th>Amount</th>
                      <th>Counterparty</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {transactions.map((txn) => (
                      <tr key={txn.id}>
                        <td className="text-primary-700 font-medium">
                          {new Date(txn.transaction_date).toLocaleDateString('en-IN')}
                        </td>
                        <td>
                          <span className={`badge ${
                            txn.transaction_type?.includes('Credit') || txn.transaction_type?.includes('In')
                              ? 'badge-success' : 'badge-danger'
                          }`}>
                            {txn.transaction_type}
                          </span>
                        </td>
                        <td className="text-primary-600">{txn.channel || 'Online'}</td>
                        <td className={`font-semibold ${
                          txn.transaction_type?.includes('Credit') || txn.transaction_type?.includes('In')
                            ? 'text-success-600' : 'text-danger-600'
                        }`}>
                          ₹{parseFloat(txn.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="text-primary-700">{txn.counterparty_name || 'Unknown'}</td>
                        <td className="text-primary-500">{txn.counterparty_country || 'India'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Alert Reasons */}
          {alert.alert_reasons && alert.alert_reasons.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4 flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-warning-500" />
                Alert Reasons
              </h3>
              <ul className="space-y-3">
                {alert.alert_reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-2 h-2 bg-warning-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <p className="text-sm font-medium text-primary-700">{reason.reason_code || reason.description}</p>
                      {reason.description && reason.reason_code && (
                        <p className="text-xs text-primary-500 mt-0.5">{reason.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Matched Typologies */}
          {alert.matched_typologies && alert.matched_typologies.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4">
                Matched Typologies
              </h3>
              <div className="space-y-3">
                {alert.matched_typologies.map((typo, idx) => (
                  <div key={idx} className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-800">{typo.typology_name}</span>
                      <span className={`badge ${
                        typo.confidence === 'High' ? 'badge-danger' :
                        typo.confidence === 'Medium' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {typo.confidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Triggering Rules */}
          {alert.triggering_rules && alert.triggering_rules.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4">
                Triggering Rules
              </h3>
              <div className="flex flex-wrap gap-2">
                {alert.triggering_rules.map((rule, idx) => (
                  <span key={idx} className="badge badge-neutral text-xs">
                    {rule}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {['analyst', 'senior_analyst', 'admin'].includes(user.role) && (
                <button
                  onClick={() => setShowSarModal(true)}
                  disabled={alert.alert_status === 'SAR_Filed'}
                  className="btn-accent w-full justify-center"
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Generate SAR
                </button>
              )}
              <Link to={`/customers/${alert.customer_id}`} className="btn-secondary w-full justify-center">
                <UserIcon className="w-4 h-4 mr-2" />
                View Customer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetail;
