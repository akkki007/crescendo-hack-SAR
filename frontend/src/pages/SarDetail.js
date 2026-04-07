import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sarService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  SparklesIcon,
  ArrowPathIcon,
  DocumentCheckIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  EyeIcon,
  PrinterIcon,
  CheckCircleIcon,
  ShieldExclamationIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

// Component to render SAR sections with proper formatting
const SARNarrativeViewer = ({ narrative }) => {
  if (!narrative) return null;

  // Parse the narrative into sections
  const parseSections = (text) => {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    let currentContent = [];

    const sectionPatterns = [
      { pattern: /\*\*(?:1\.\s*)?PART\s*I[:\s]*FILING\s*INSTITUTION/i, title: 'PART I: FILING INSTITUTION INFORMATION', icon: BuildingOfficeIcon },
      { pattern: /\*\*(?:2\.\s*)?PART\s*II[:\s]*SUBJECT\s*INFORMATION/i, title: 'PART II: SUBJECT INFORMATION', icon: UserIcon },
      { pattern: /\*\*(?:3\.\s*)?PART\s*III[:\s]*SUSPICIOUS\s*ACTIVITY/i, title: 'PART III: SUSPICIOUS ACTIVITY INFORMATION', icon: ExclamationTriangleIcon },
      { pattern: /\*\*(?:4\.\s*)?PART\s*IV[:\s]*NARRATIVE/i, title: 'PART IV: NARRATIVE DESCRIPTION', icon: DocumentTextIcon },
      { pattern: /\*\*(?:5\.\s*)?PART\s*V[:\s]*CONCLUSION/i, title: 'PART V: CONCLUSION', icon: CheckCircleIcon },
      { pattern: /\*\*A\.\s*Introduction/i, title: 'A. Introduction / Summary', icon: null, subsection: true },
      { pattern: /\*\*B\.\s*Timeline/i, title: 'B. Timeline of Activity', icon: ClockIcon, subsection: true },
      { pattern: /\*\*C\.\s*Location/i, title: 'C. Location Information', icon: MapPinIcon, subsection: true },
      { pattern: /\*\*D\.\s*Detailed\s*Transaction/i, title: 'D. Detailed Transaction Analysis', icon: BanknotesIcon, subsection: true },
      { pattern: /\*\*E\.\s*Basis/i, title: 'E. Basis for Suspicion', icon: ShieldExclamationIcon, subsection: true },
      { pattern: /\*\*F\.\s*Customer\s*Interaction/i, title: 'F. Customer Interaction', icon: ChatBubbleLeftRightIcon, subsection: true },
    ];

    for (const line of lines) {
      let matchedSection = null;

      for (const sec of sectionPatterns) {
        if (sec.pattern.test(line)) {
          matchedSection = sec;
          break;
        }
      }

      if (matchedSection) {
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentContent.join('\n').trim()
          });
        }
        currentSection = matchedSection;
        currentContent = [];
      } else if (currentSection) {
        // Clean up markdown formatting
        const cleanedLine = line
          .replace(/\*\*/g, '')
          .replace(/^\s*[-•]\s*/, '• ');
        currentContent.push(cleanedLine);
      }
    }

    // Add last section
    if (currentSection) {
      sections.push({
        ...currentSection,
        content: currentContent.join('\n').trim()
      });
    }

    return sections;
  };

  const sections = parseSections(narrative);

  // If no sections parsed, show raw narrative
  if (sections.length === 0) {
    return (
      <div className="prose prose-sm max-w-none">
        <pre className="whitespace-pre-wrap text-sm text-primary-800 font-sans leading-relaxed">
          {narrative}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => {
        const Icon = section.icon;
        return (
          <div
            key={idx}
            className={`${section.subsection ? 'ml-4 border-l-2 border-primary-200 pl-4' : ''}`}
          >
            <h3 className={`flex items-center font-semibold mb-3 ${
              section.subsection
                ? 'text-sm text-primary-700'
                : 'text-base text-primary-900 border-b border-primary-200 pb-2'
            }`}>
              {Icon && <Icon className="w-5 h-5 mr-2 text-primary-600" />}
              {section.title}
            </h3>
            <div className="text-sm text-primary-700 leading-relaxed whitespace-pre-wrap">
              {section.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sar, setSar] = useState(null);
  const [narrative, setNarrative] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [auditTrailData, setAuditTrailData] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'edit'
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);

  useEffect(() => {
    fetchSarData();
  }, [id]);

  const fetchSarData = async () => {
    try {
      const response = await sarService.getById(id);
      setSar(response.data);
      setNarrative(response.data.narrative_draft || response.data.narrative_final || '');
      if (response.data.audit_trail) {
        try {
          const trail = typeof response.data.audit_trail === 'string'
            ? JSON.parse(response.data.audit_trail)
            : response.data.audit_trail;
          setAuditTrailData(Array.isArray(trail) ? trail : []);
        } catch {
          setAuditTrailData([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch SAR:', error);
      setError('Failed to load SAR data');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, isError = false) => {
    if (isError) {
      setError(message);
      setTimeout(() => setError(null), 5000);
    } else {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleGenerateNarrative = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await sarService.generate(id, feedback);
      setNarrative(response.data.narrative);
      if (response.data.audit_trail) {
        setAuditTrailData(response.data.audit_trail);
      }
      setFeedback('');
      showNotification('Narrative generated successfully');
      fetchSarData();
    } catch (error) {
      console.error('Failed to generate narrative:', error);
      showNotification(error.response?.data?.detail || error.response?.data?.error || 'Failed to generate narrative. Make sure the AI service is running.', true);
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateNarrative = async () => {
    if (!feedback.trim()) {
      showNotification('Please provide feedback or instructions for regeneration', true);
      return;
    }
    setRegenerating(true);
    setError(null);
    try {
      // Call AI service on port 8000: POST /sar/{sar_id}/regenerate
      const response = await sarService.regenerate(id, feedback);
      setNarrative(response.data.narrative);
      if (response.data.audit_trail) {
        setAuditTrailData(response.data.audit_trail);
      }
      setFeedback('');
      setShowFeedbackPanel(false);
      showNotification('Narrative regenerated with your feedback successfully!');
      fetchSarData();
    } catch (error) {
      console.error('Failed to regenerate narrative:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to regenerate narrative. Please ensure the AI service is running on port 8000.';
      showNotification(errorMsg, true);
    } finally {
      setRegenerating(false);
    }
  };

  const handleSaveNarrative = async () => {
    setActionLoading(true);
    try {
      await sarService.updateNarrative(id, {
        narrativeDraft: narrative,
        feedback: feedback
      });
      setFeedback('');
      showNotification('Draft saved successfully');
      fetchSarData();
    } catch (error) {
      console.error('Failed to save narrative:', error);
      showNotification('Failed to save draft', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    setActionLoading(true);
    try {
      await sarService.submit(id);
      showNotification('SAR submitted for review');
      fetchSarData();
    } catch (error) {
      console.error('Failed to submit SAR:', error);
      showNotification('Failed to submit SAR', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    const comments = prompt('Enter approval comments (optional):');
    setActionLoading(true);
    try {
      await sarService.approve(id, comments);
      showNotification('SAR approved successfully');
      fetchSarData();
    } catch (error) {
      console.error('Failed to approve SAR:', error);
      showNotification('Failed to approve SAR', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const comments = prompt('Enter rejection reason (required):');
    if (!comments) {
      showNotification('Comments are required when rejecting', true);
      return;
    }
    setActionLoading(true);
    try {
      await sarService.reject(id, comments);
      showNotification('SAR sent back for revision');
      fetchSarData();
    } catch (error) {
      console.error('Failed to reject SAR:', error);
      showNotification('Failed to reject SAR', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-200 border-t-primary-600"></div>
          <p className="mt-4 text-sm text-primary-500">Loading SAR...</p>
        </div>
      </div>
    );
  }

  if (!sar) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-primary-600 font-medium">SAR not found</p>
        <Link to="/sar" className="text-sm text-primary-500 hover:text-primary-700 mt-2 inline-block">
          Back to SAR Reports
        </Link>
      </div>
    );
  }

  const isCreator = sar.created_by === user.id;
  const canEditRole = ['admin', 'senior_analyst'].includes(user.role) || (user.role === 'analyst' && isCreator);
  const canEdit = (sar.sar_status === 'Draft' || sar.sar_status === 'Revision_Required') && canEditRole;
  const canSubmit = canEdit && narrative;
  const canApprove = ['Pending_Review', 'Under_Review'].includes(sar.sar_status) &&
    ['compliance_officer', 'admin'].includes(user.role);
  const canReject = ['Pending_Review', 'Under_Review'].includes(sar.sar_status) &&
    ['compliance_officer', 'admin', 'senior_analyst'].includes(user.role);

  const statusConfig = {
    Draft: { badge: 'bg-gray-100 text-gray-800 border border-gray-300', label: 'Draft', icon: PencilSquareIcon },
    Pending_Review: { badge: 'bg-amber-100 text-amber-800 border border-amber-300', label: 'Pending Review', icon: ClockIcon },
    Under_Review: { badge: 'bg-purple-100 text-purple-800 border border-purple-200', label: 'Under Review', icon: EyeIcon },
    Approved: { badge: 'bg-green-100 text-green-800 border border-green-300', label: 'Approved', icon: CheckCircleIcon },
    Filed: { badge: 'bg-emerald-200 text-emerald-900 border border-emerald-300', label: 'Filed', icon: DocumentCheckIcon },
    Revision_Required: { badge: 'bg-red-100 text-red-800 border border-red-300', label: 'Revision Required', icon: XCircleIcon },
    Rejected: { badge: 'bg-red-100 text-red-800 border border-red-300', label: 'Rejected', icon: XCircleIcon }
  };

  const StatusIcon = statusConfig[sar.sar_status]?.icon || DocumentTextIcon;

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Notifications */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm flex items-center print:hidden">
          <XCircleIcon className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm flex items-center print:hidden">
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="page-header print:bg-white print:shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="page-title">{sar.sar_id}</h1>
              <span className={`badge ${statusConfig[sar.sar_status]?.badge || 'badge-neutral'} inline-flex items-center`}>
                <StatusIcon className="w-3.5 h-3.5 mr-1" />
                {statusConfig[sar.sar_status]?.label || sar.sar_status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="page-subtitle">
              Alert: <Link to={`/alerts/${sar.alert_id}`} className="text-primary-600 hover:text-primary-800 print:text-primary-800">{sar.alert_id}</Link>
              {' '}&middot; Customer: <span className="font-medium">{sar.full_name}</span>
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-2 print:hidden">
            {canEdit && (
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('view')}
                  className={`px-3 py-1.5 text-sm font-medium flex items-center ${
                    viewMode === 'view' ? 'bg-primary-600 text-white' : 'bg-white text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1.5 text-sm font-medium flex items-center border-l border-gray-300 ${
                    viewMode === 'edit' ? 'bg-primary-600 text-white' : 'bg-white text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <PencilSquareIcon className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
            )}
            <button onClick={handlePrint} className="btn-secondary btn-sm">
              <PrinterIcon className="w-4 h-4 mr-1" />
              Print
            </button>
            <Link to="/sar" className="btn-secondary btn-sm">
              Back to Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Revision Comments */}
      {sar.sar_status === 'Revision_Required' && sar.reviewer_comments && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 print:hidden">
          <div className="flex">
            <InformationCircleIcon className="w-5 h-5 text-warning-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-warning-800">Revision Required</h3>
              <p className="text-sm text-warning-700 mt-1">{sar.reviewer_comments}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:block">
        {/* SAR Report Content */}
        <div className="lg:col-span-3 space-y-6 print:space-y-4">
          {/* Report Header */}
          <div className="card p-6 print:shadow-none print:border-2 print:border-gray-300">
            {/* Official Header */}
            <div className="text-center border-b-2 border-primary-800 pb-4 mb-6 print:border-black">
              <div className="flex justify-center mb-2">
                <ShieldExclamationIcon className="w-12 h-12 text-primary-700 print:text-black" />
              </div>
              <h2 className="text-2xl font-bold text-primary-900 print:text-black uppercase tracking-wide">
                Suspicious Activity Report
              </h2>
              <p className="text-sm text-primary-600 mt-1 print:text-gray-600">
                Suspicious Transaction Report (STR) / Financial Intelligence Report
              </p>
              <p className="text-xs text-primary-400 mt-2 print:text-gray-500">
                CONFIDENTIAL - FOR AUTHORIZED USE ONLY
              </p>
            </div>

            {/* Report Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg print:bg-gray-100">
              <div>
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">Report ID</p>
                <p className="text-sm font-mono font-semibold text-primary-900 mt-1">{sar.sar_id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">Alert Reference</p>
                <p className="text-sm font-mono text-primary-800 mt-1">{sar.alert_id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">Report Date</p>
                <p className="text-sm text-primary-800 mt-1">
                  {new Date(sar.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">Status</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded font-medium ${statusConfig[sar.sar_status]?.badge}`}>
                  {statusConfig[sar.sar_status]?.label || sar.sar_status}
                </span>
              </div>
            </div>

            {/* Narrative Section */}
            <div>
              {viewMode === 'edit' && canEdit ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider flex items-center">
                      <PencilSquareIcon className="w-4 h-4 mr-2" />
                      Edit Narrative
                    </h3>
                    <div className="flex gap-2">
                      {narrative && (
                        <button
                          onClick={() => setShowFeedbackPanel(!showFeedbackPanel)}
                          className={`btn-sm ${showFeedbackPanel ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'btn-secondary'}`}
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                          {showFeedbackPanel ? 'Hide Feedback' : 'Improve with AI'}
                        </button>
                      )}
                      <button
                        onClick={handleGenerateNarrative}
                        disabled={generating || regenerating}
                        className="btn-accent btn-sm"
                      >
                        <SparklesIcon className={`w-4 h-4 mr-1 ${generating ? 'animate-pulse' : ''}`} />
                        {generating ? 'Generating...' : narrative ? 'Regenerate Fresh' : 'Generate with AI'}
                      </button>
                    </div>
                  </div>

                  {/* AI Feedback Panel - Enhanced UX */}
                  {showFeedbackPanel && narrative && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <SparklesIcon className="w-5 h-5 text-amber-600 mr-2" />
                          <div>
                            <h4 className="font-semibold text-amber-900">Improve Narrative with AI</h4>
                            <p className="text-xs text-amber-700 mt-0.5">
                              Provide feedback and the AI will regenerate the narrative incorporating your instructions
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowFeedbackPanel(false)}
                          className="text-amber-500 hover:text-amber-700"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Feedback Input */}
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">
                          Your Instructions / Feedback
                        </label>
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm"
                          rows={4}
                          placeholder="Example: Add more details about the wire transfers. Emphasize the connection to high-risk jurisdictions. Make the timeline clearer..."
                        />
                      </div>

                      {/* Suggestion Chips */}
                      <div>
                        <p className="text-xs font-medium text-amber-700 mb-2">Quick suggestions (click to add):</p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            'Add more transaction details',
                            'Emphasize suspicious patterns',
                            'Include customer interaction notes',
                            'Make timeline more explicit',
                            'Add regulatory context',
                            'Strengthen basis for suspicion'
                          ].map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => setFeedback(prev => prev ? `${prev}. ${suggestion}` : suggestion)}
                              className="text-xs px-2 py-1 bg-white border border-amber-300 rounded-full text-amber-700 hover:bg-amber-100 transition-colors"
                            >
                              + {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Regenerate Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                        <p className="text-xs text-amber-600">
                          <InformationCircleIcon className="w-4 h-4 inline mr-1" />
                          The AI will use your current narrative + feedback to create an improved version
                        </p>
                        <button
                          onClick={handleRegenerateNarrative}
                          disabled={regenerating || !feedback.trim()}
                          className={`btn-sm ${
                            feedback.trim()
                              ? 'bg-amber-600 text-white hover:bg-amber-700'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          } transition-all`}
                        >
                          {regenerating ? (
                            <>
                              <ArrowPathIcon className="w-4 h-4 mr-1 animate-spin" />
                              Regenerating...
                            </>
                          ) : (
                            <>
                              <ArrowPathIcon className="w-4 h-4 mr-1" />
                              Regenerate with Feedback
                            </>
                          )}
                        </button>
                      </div>

                      {/* Progress Indicator */}
                      {regenerating && (
                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <ArrowPathIcon className="w-5 h-5 text-amber-600 animate-spin" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-amber-900">AI is processing your feedback...</p>
                              <p className="text-xs text-amber-600 mt-0.5">
                                Analyzing current narrative → Applying your instructions → Generating improved version
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-amber-500 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <textarea
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    rows={25}
                    className="form-input font-mono text-sm leading-relaxed w-full"
                    placeholder="SAR narrative will appear here after generation..."
                    disabled={generating || regenerating}
                  />

                  {/* Generation Progress (for fresh generation) */}
                  {generating && (
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <SparklesIcon className="w-6 h-6 text-primary-600 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary-900">Generating SAR Narrative...</p>
                          <p className="text-xs text-primary-600 mt-0.5">
                            Analyzing alert data → Applying compliance rules → Creating narrative
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Simple feedback field when panel is closed (for notes) */}
                  {!showFeedbackPanel && (
                    <div>
                      <label className="form-label">Notes for Reviewers (Optional)</label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="form-input"
                        rows={2}
                        placeholder="Add any notes for the compliance reviewer..."
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                    <button
                      onClick={handleSaveNarrative}
                      disabled={actionLoading || generating || regenerating}
                      className="btn-secondary"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={handleSubmitForReview}
                      disabled={!canSubmit || actionLoading || generating || regenerating}
                      className="btn-primary"
                    >
                      <DocumentCheckIcon className="w-4 h-4 mr-1" />
                      Submit for Review
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {narrative ? (
                    <div className="bg-white print:p-0">
                      <SARNarrativeViewer narrative={narrative} />
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg print:hidden">
                      <SparklesIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-primary-500">No narrative generated yet</p>
                      {canEdit && (
                        <button
                          onClick={() => setViewMode('edit')}
                          className="btn-accent mt-4"
                        >
                          <PencilSquareIcon className="w-4 h-4 mr-1" />
                          Start Editing
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Approval Actions */}
          {(canApprove || canReject) && (
            <div className="card p-6 print:hidden">
              <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4">Review Actions</h3>
              <div className="flex flex-wrap gap-3">
                {canApprove && (
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="btn bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Approve SAR
                  </button>
                )}
                {canReject && (
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="btn-danger"
                  >
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    Request Revision
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 print:hidden">
          {/* SAR Info */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4 flex items-center">
              <ShieldExclamationIcon className="w-4 h-4 mr-2" />
              Report Information
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-primary-500">Created By</dt>
                <dd className="text-primary-800 font-medium">{sar.created_by_name || 'System'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-primary-500">Created</dt>
                <dd className="text-primary-800">{new Date(sar.created_at).toLocaleDateString()}</dd>
              </div>
              {sar.submitted_at && (
                <div className="flex justify-between">
                  <dt className="text-primary-500">Submitted</dt>
                  <dd className="text-primary-800">{new Date(sar.submitted_at).toLocaleDateString()}</dd>
                </div>
              )}
              {sar.approved_at && (
                <div className="flex justify-between">
                  <dt className="text-primary-500">Approved</dt>
                  <dd className="text-primary-800">{new Date(sar.approved_at).toLocaleDateString()}</dd>
                </div>
              )}
              {sar.approved_by_name && (
                <div className="flex justify-between">
                  <dt className="text-primary-500">Approved By</dt>
                  <dd className="text-primary-800 font-medium">{sar.approved_by_name}</dd>
                </div>
              )}
              {sar.generated_by_model && (
                <div className="pt-2 border-t border-gray-100">
                  <dt className="text-primary-500 text-xs">AI Model</dt>
                  <dd className="text-primary-800 text-xs font-mono mt-1">{sar.generated_by_model}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Subject Info */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4 flex items-center">
              <UserIcon className="w-4 h-4 mr-2" />
              Subject Details
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-primary-500 text-xs">Full Name</dt>
                <dd className="text-primary-800 font-medium">{sar.full_name}</dd>
              </div>
              <div>
                <dt className="text-primary-500 text-xs">Customer ID</dt>
                <dd className="text-primary-800 font-mono text-xs">{sar.customer_id}</dd>
              </div>
              {sar.occupation && (
                <div>
                  <dt className="text-primary-500 text-xs">Occupation</dt>
                  <dd className="text-primary-800">{sar.occupation}</dd>
                </div>
              )}
              {sar.nationality && (
                <div>
                  <dt className="text-primary-500 text-xs">Nationality</dt>
                  <dd className="text-primary-800">{sar.nationality}</dd>
                </div>
              )}
              {sar.kyc_risk_rating && (
                <div>
                  <dt className="text-primary-500 text-xs">KYC Risk</dt>
                  <dd>
                    <span className={`badge text-xs ${
                      sar.kyc_risk_rating === 'High' ? 'badge-danger' :
                      sar.kyc_risk_rating === 'Medium' ? 'badge-warning' : 'badge-success'
                    }`}>
                      {sar.kyc_risk_rating}
                    </span>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Alert Reference */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-4">Alert Reference</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-primary-500">Type</dt>
                <dd className="text-primary-800 font-medium text-xs">{sar.alert_type}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-primary-500">Priority</dt>
                <dd>
                  <span className={`badge text-xs ${
                    sar.alert_priority === 'Critical' ? 'badge-danger' :
                    sar.alert_priority === 'High' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {sar.alert_priority}
                  </span>
                </dd>
              </div>
              <div className="pt-2">
                <Link
                  to={`/alerts/${sar.alert_id}`}
                  className="text-xs font-medium text-primary-600 hover:text-primary-800"
                >
                  View Full Alert Details →
                </Link>
              </div>
            </dl>
          </div>

          {/* Audit Trail */}
          <div className="card">
            <button
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              className="w-full p-5 text-left flex justify-between items-center"
            >
              <span className="text-sm font-semibold text-primary-800 uppercase tracking-wider">
                Audit Trail ({auditTrailData.length})
              </span>
              {showAuditTrail ? (
                <ChevronDownIcon className="w-4 h-4 text-primary-500" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-primary-500" />
              )}
            </button>

            {showAuditTrail && (
              <div className="px-5 pb-5 border-t border-gray-100">
                {auditTrailData.length === 0 ? (
                  <p className="text-sm text-primary-400 py-4 text-center">No audit trail data</p>
                ) : (
                  <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                    {auditTrailData.map((entry, idx) => (
                      <div key={idx} className="text-xs border-l-2 border-primary-200 pl-3 py-2 bg-gray-50 rounded-r">
                        {entry.sar_section && (
                          <p className="text-primary-600 font-semibold mb-1">{entry.sar_section}</p>
                        )}
                        {entry.sar_text && (
                          <p className="text-primary-700 italic mb-1">"{entry.sar_text.substring(0, 100)}..."</p>
                        )}
                        {entry.source_field && (
                          <p className="text-primary-500">
                            <span className="font-medium">Source:</span> <code className="bg-gray-200 px-1 rounded">{entry.source_field}</code>
                          </p>
                        )}
                        {entry.source_value && (
                          <p className="text-primary-400 mt-0.5">
                            <span className="font-medium">Value:</span> {
                              typeof entry.source_value === 'object'
                                ? JSON.stringify(entry.source_value).substring(0, 50)
                                : String(entry.source_value).substring(0, 50)
                            }
                          </p>
                        )}
                        {entry.explanation && (
                          <p className="text-primary-500 mt-1 text-xs">{entry.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-8 pt-4 border-t-2 border-gray-300 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Generated by SAR Narrative Generator System</span>
          <span>Printed: {new Date().toLocaleString()}</span>
        </div>
        <p className="mt-2 text-center italic">
          This document is CONFIDENTIAL and intended for authorized recipients only.
          Unauthorized disclosure is prohibited.
        </p>
      </div>
    </div>
  );
};

export default SarDetail;
