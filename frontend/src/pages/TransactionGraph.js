import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { customerService } from '../services/api';
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowPathIcon,
  FunnelIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

// ─── Anomaly Detection Helpers ───────────────────────────────────

const STRUCTURING_THRESHOLD = 1000000; // 10 lakh INR
const HIGH_VALUE_THRESHOLD = 500000;   // 5 lakh INR

function detectAnomalies(transactions) {
  const flags = new Map(); // txn id -> array of anomaly strings

  const sortedTxns = [...transactions].sort(
    (a, b) => new Date(a.transaction_timestamp) - new Date(b.transaction_timestamp)
  );

  // Group by counterparty
  const byCounterparty = {};
  sortedTxns.forEach((t) => {
    const key = t.counterparty_name || 'Unknown';
    if (!byCounterparty[key]) byCounterparty[key] = [];
    byCounterparty[key].push(t);
  });

  sortedTxns.forEach((t) => {
    const anomalies = [];
    const amt = parseFloat(t.amount) || 0;

    // High value
    if (amt >= HIGH_VALUE_THRESHOLD) anomalies.push('High Value');

    // Structuring: amount just below 10 lakh (within 10%)
    if (amt >= STRUCTURING_THRESHOLD * 0.9 && amt < STRUCTURING_THRESHOLD)
      anomalies.push('Possible Structuring');

    // Cross-border
    if (t.counterparty_country && t.counterparty_country !== 'India')
      anomalies.push('Cross Border');

    // Round-trip: same counterparty has both inflow and outflow
    const cpTxns = byCounterparty[t.counterparty_name || 'Unknown'] || [];
    const hasInflow = cpTxns.some((x) =>
      ['Credit', 'Transfer_In', 'Cash_Deposit', 'NEFT', 'RTGS', 'IMPS'].includes(x.transaction_type)
    );
    const hasOutflow = cpTxns.some((x) =>
      ['Debit', 'Transfer_Out', 'Cash_Withdrawal', 'Wire_Transfer'].includes(x.transaction_type)
    );
    if (hasInflow && hasOutflow && cpTxns.length >= 2) anomalies.push('Round-Trip');

    // Rapid movement: multiple transactions in 24h window
    const ts = new Date(t.transaction_timestamp).getTime();
    const nearby = sortedTxns.filter((x) => {
      const xts = new Date(x.transaction_timestamp).getTime();
      return x.id !== t.id && Math.abs(xts - ts) < 24 * 60 * 60 * 1000;
    });
    if (nearby.length >= 3) anomalies.push('Rapid Movement');

    if (anomalies.length > 0) flags.set(t.id, anomalies);
  });

  return flags;
}

// ─── Custom Node Components ──────────────────────────────────────

function CustomerNode({ data }) {
  return (
    <div className="relative">
      <Handle type="source" position={Position.Bottom} className="!bg-primary-500 !w-2 !h-2" />
      <div
        className="px-5 py-4 rounded-2xl shadow-xl border-2 min-w-[180px] text-center"
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)',
          borderColor: '#3b82f6',
        }}
      >
        <div className="w-12 h-12 rounded-full bg-white/10 mx-auto mb-2 flex items-center justify-center text-xl font-bold text-white border border-white/20">
          {data.initials}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-300 mb-1">
          Customer
        </div>
        <div className="text-sm font-bold text-white leading-tight">{data.label}</div>
        <div className="text-[10px] text-blue-200 mt-1">{data.customerId}</div>
        {data.riskRating && (
          <span
            className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              data.riskRating === 'Low'
                ? 'bg-green-500/20 text-green-300'
                : data.riskRating === 'Medium'
                ? 'bg-yellow-500/20 text-yellow-300'
                : data.riskRating === 'High'
                ? 'bg-orange-500/20 text-orange-300'
                : 'bg-red-500/20 text-red-300'
            }`}
          >
            {data.riskRating} Risk
          </span>
        )}
      </div>
    </div>
  );
}

function AccountNode({ data }) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-accent-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-accent-500 !w-2 !h-2" />
      <div
        className={`px-4 py-3 rounded-xl shadow-lg border-2 min-w-[150px] text-center bg-white ${
          data.status === 'Frozen' || data.status === 'Blocked'
            ? 'border-red-400'
            : 'border-teal-400'
        }`}
      >
        <div className="text-[10px] font-semibold uppercase tracking-widest text-teal-600 mb-1">
          {data.accountType}
        </div>
        <div className="text-xs font-bold text-gray-800">{data.label}</div>
        <div className="text-[10px] text-gray-500 mt-1">
          {data.balance}
        </div>
        <span
          className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${
            data.status === 'Active'
              ? 'bg-green-100 text-green-700'
              : data.status === 'Dormant'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {data.status}
        </span>
      </div>
    </div>
  );
}

function CounterpartyNode({ data }) {
  const isSuspicious = data.anomalyCount > 0;
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2" />
      <div
        className={`px-4 py-3 rounded-xl shadow-lg border-2 min-w-[140px] text-center bg-white transition-all ${
          isSuspicious
            ? 'border-red-500 ring-4 ring-red-100'
            : 'border-gray-300'
        }`}
      >
        {isSuspicious && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow">
            <ExclamationTriangleIcon className="w-3 h-3 text-white" />
          </div>
        )}
        <div
          className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${
            isSuspicious ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          Counterparty
        </div>
        <div className="text-xs font-bold text-gray-800 leading-tight">{data.label}</div>
        {data.bank && (
          <div className="text-[10px] text-gray-400 mt-0.5">{data.bank}</div>
        )}
        {data.country && data.country !== 'India' && (
          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-orange-100 text-orange-700">
            {data.country}
          </span>
        )}
        <div className="text-[10px] text-gray-500 mt-1">
          {data.txnCount} txn{data.txnCount !== 1 ? 's' : ''} &middot; {data.totalAmount}
        </div>
        {isSuspicious && (
          <div className="text-[10px] text-red-600 font-semibold mt-1">
            {data.anomalyCount} anomal{data.anomalyCount > 1 ? 'ies' : 'y'}
          </div>
        )}
      </div>
    </div>
  );
}

const nodeTypes = {
  customer: CustomerNode,
  account: AccountNode,
  counterparty: CounterpartyNode,
};

// ─── Layout Helpers ──────────────────────────────────────────────

function buildGraphData(customer, accounts, transactions, anomalyFlags, filters) {
  const nodes = [];
  const edges = [];

  // Filter transactions
  let filteredTxns = [...transactions];
  if (filters.txnType) {
    filteredTxns = filteredTxns.filter((t) => t.transaction_type === filters.txnType);
  }
  if (filters.minAmount) {
    filteredTxns = filteredTxns.filter((t) => parseFloat(t.amount) >= filters.minAmount);
  }
  if (filters.anomaliesOnly) {
    filteredTxns = filteredTxns.filter((t) => anomalyFlags.has(t.id));
  }

  // Customer node at center
  nodes.push({
    id: 'customer',
    type: 'customer',
    position: { x: 400, y: 0 },
    data: {
      label: customer.full_name,
      customerId: customer.customer_id,
      riskRating: customer.kyc_risk_rating,
      initials: (customer.full_name || '')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase(),
    },
  });

  // Account nodes in arc below customer
  const accountMap = {};
  accounts.forEach((acc, i) => {
    const angle = accounts.length === 1
      ? 0
      : ((i / (accounts.length - 1)) - 0.5) * Math.PI * 0.6;
    const radius = 200;
    const x = 400 + Math.sin(angle) * radius * 2;
    const y = 200 + Math.cos(angle) * radius * 0.3;

    accountMap[acc.id] = `account-${acc.id}`;
    nodes.push({
      id: `account-${acc.id}`,
      type: 'account',
      position: { x, y },
      data: {
        label: acc.account_number || acc.account_id,
        accountType: acc.account_type,
        balance: `INR ${parseFloat(acc.current_balance || 0).toLocaleString('en-IN')}`,
        status: acc.account_status,
      },
    });

    edges.push({
      id: `e-customer-${acc.id}`,
      source: 'customer',
      target: `account-${acc.id}`,
      type: 'smoothstep',
      style: { stroke: '#0d9488', strokeWidth: 2 },
      animated: false,
    });
  });

  // Group transactions by counterparty
  const counterpartyGroups = {};
  filteredTxns.forEach((t) => {
    const cpName = t.counterparty_name || 'Unknown';
    if (!counterpartyGroups[cpName]) {
      counterpartyGroups[cpName] = {
        name: cpName,
        bank: t.counterparty_bank_name,
        country: t.counterparty_country,
        transactions: [],
        anomalyCount: 0,
        totalAmount: 0,
      };
    }
    counterpartyGroups[cpName].transactions.push(t);
    counterpartyGroups[cpName].totalAmount += parseFloat(t.amount) || 0;
    if (anomalyFlags.has(t.id)) {
      counterpartyGroups[cpName].anomalyCount += (anomalyFlags.get(t.id) || []).length;
    }
  });

  // Counterparty nodes in outer arc
  const cpEntries = Object.values(counterpartyGroups);
  cpEntries.forEach((cp, i) => {
    const angle = cpEntries.length === 1
      ? 0
      : ((i / (cpEntries.length - 1)) - 0.5) * Math.PI * 0.8;
    const radius = 350;
    const x = 400 + Math.sin(angle) * radius * 2.2;
    const y = 480 + Math.cos(angle) * radius * 0.4;

    const cpId = `cp-${cp.name.replace(/\s+/g, '-')}`;
    nodes.push({
      id: cpId,
      type: 'counterparty',
      position: { x, y },
      data: {
        label: cp.name,
        bank: cp.bank,
        country: cp.country,
        txnCount: cp.transactions.length,
        totalAmount: `INR ${cp.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        anomalyCount: cp.anomalyCount,
      },
    });

    // Find which accounts connect to this counterparty
    const accountIds = [...new Set(cp.transactions.map((t) => t.account_id))];
    accountIds.forEach((accId) => {
      const accNodeId = accountMap[accId];
      if (!accNodeId) return;

      const accTxns = cp.transactions.filter((t) => t.account_id === accId);
      const hasAnomaly = accTxns.some((t) => anomalyFlags.has(t.id));
      const totalAmt = accTxns.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
      const isHighValue = totalAmt >= HIGH_VALUE_THRESHOLD;

      edges.push({
        id: `e-${accNodeId}-${cpId}`,
        source: accNodeId,
        target: cpId,
        type: 'smoothstep',
        animated: hasAnomaly,
        label: `${accTxns.length} txn · INR ${totalAmt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        labelStyle: {
          fontSize: 9,
          fontWeight: hasAnomaly ? 700 : 500,
          fill: hasAnomaly ? '#ef4444' : '#6b7280',
        },
        labelBgStyle: {
          fill: hasAnomaly ? '#fef2f2' : '#f9fafb',
          fillOpacity: 0.9,
        },
        labelBgPadding: [4, 2],
        style: {
          stroke: hasAnomaly ? '#ef4444' : isHighValue ? '#3b82f6' : '#9ca3af',
          strokeWidth: hasAnomaly ? 2.5 : isHighValue ? 2 : 1.5,
          strokeDasharray: hasAnomaly ? '6 3' : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: hasAnomaly ? '#ef4444' : isHighValue ? '#3b82f6' : '#9ca3af',
        },
      });
    });
  });

  return { nodes, edges };
}

// ─── Detail Panel ────────────────────────────────────────────────

function DetailPanel({ selectedNode, transactions, anomalyFlags, onClose }) {
  if (!selectedNode) return null;

  const { data, type } = selectedNode;

  const relatedTxns =
    type === 'counterparty'
      ? transactions.filter(
          (t) => (t.counterparty_name || 'Unknown') === data.label
        )
      : type === 'account'
      ? transactions.filter(
          (t) => t.account_id === selectedNode.id.replace('account-', '')
        )
      : transactions;

  return (
    <div className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80">
        <div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${
              type === 'customer'
                ? 'text-blue-600'
                : type === 'account'
                ? 'text-teal-600'
                : 'text-gray-500'
            }`}
          >
            {type}
          </span>
          <h3 className="text-sm font-bold text-gray-900 mt-0.5">{data.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Node-specific info */}
        <div className="px-5 py-3 border-b border-gray-100">
          {type === 'customer' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">ID</span>
                <p className="font-medium text-gray-900">{data.customerId}</p>
              </div>
              <div>
                <span className="text-gray-500">Risk</span>
                <p className="font-medium text-gray-900">{data.riskRating}</p>
              </div>
            </div>
          )}
          {type === 'account' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Type</span>
                <p className="font-medium text-gray-900">{data.accountType}</p>
              </div>
              <div>
                <span className="text-gray-500">Balance</span>
                <p className="font-medium text-gray-900">{data.balance}</p>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <p className="font-medium text-gray-900">{data.status}</p>
              </div>
            </div>
          )}
          {type === 'counterparty' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.bank && (
                <div>
                  <span className="text-gray-500">Bank</span>
                  <p className="font-medium text-gray-900">{data.bank}</p>
                </div>
              )}
              {data.country && (
                <div>
                  <span className="text-gray-500">Country</span>
                  <p className="font-medium text-gray-900">{data.country}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Transactions</span>
                <p className="font-medium text-gray-900">{data.txnCount}</p>
              </div>
              <div>
                <span className="text-gray-500">Total</span>
                <p className="font-medium text-gray-900">{data.totalAmount}</p>
              </div>
            </div>
          )}
        </div>

        {/* Transaction list */}
        <div className="px-5 py-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Transactions ({relatedTxns.length})
          </h4>
          <div className="space-y-2">
            {relatedTxns.slice(0, 50).map((t) => {
              const tAnomalies = anomalyFlags.get(t.id) || [];
              return (
                <div
                  key={t.id}
                  className={`p-2.5 rounded-lg border text-xs ${
                    tAnomalies.length > 0
                      ? 'border-red-200 bg-red-50/50'
                      : 'border-gray-100 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      {t.transaction_type?.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`font-bold ${
                        ['Credit', 'Transfer_In', 'Cash_Deposit'].includes(t.transaction_type)
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {['Credit', 'Transfer_In', 'Cash_Deposit'].includes(t.transaction_type)
                        ? '+'
                        : '-'}
                      INR {parseFloat(t.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-gray-500">
                    <span>{t.channel?.replace(/_/g, ' ')}</span>
                    <span>
                      {new Date(t.transaction_timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {t.counterparty_name && type !== 'counterparty' && (
                    <div className="mt-1 text-gray-500">
                      To: {t.counterparty_name}
                    </div>
                  )}
                  {tAnomalies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tAnomalies.map((a) => (
                        <span
                          key={a}
                          className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-semibold"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {relatedTxns.length === 0 && (
              <p className="text-gray-400 text-xs py-4 text-center">No transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200 px-4 py-3 z-40">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Legend</h4>
      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary-700 border border-primary-500 inline-block" />
          <span className="text-gray-600">Customer</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-teal-500 border border-teal-400 inline-block" />
          <span className="text-gray-600">Account</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-400 border border-gray-300 inline-block" />
          <span className="text-gray-600">Counterparty</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-red-400 inline-block ring-2 ring-red-200" />
          <span className="text-gray-600">Suspicious Entity</span>
        </div>
        <hr className="border-gray-200 my-1" />
        <div className="flex items-center gap-2">
          <span className="w-6 border-t-2 border-gray-400 inline-block" />
          <span className="text-gray-600">Normal Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 border-t-2 border-blue-500 inline-block" />
          <span className="text-gray-600">High Value</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 border-t-2 border-red-500 border-dashed inline-block" />
          <span className="text-gray-600">Anomalous</span>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Bar ───────────────────────────────────────────────────

function StatsBar({ transactions, anomalyFlags }) {
  const totalAmount = transactions.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const anomalyCount = anomalyFlags.size;
  const uniqueCounterparties = new Set(transactions.map((t) => t.counterparty_name || 'Unknown')).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Transactions</p>
        <p className="text-xl font-bold text-gray-900">{transactions.length}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Total Volume</p>
        <p className="text-xl font-bold text-gray-900">
          INR {totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Counterparties</p>
        <p className="text-xl font-bold text-gray-900">{uniqueCounterparties}</p>
      </div>
      <div className={`rounded-xl border px-4 py-3 ${anomalyCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
        <p className={`text-[10px] font-semibold uppercase tracking-widest ${anomalyCount > 0 ? 'text-red-400' : 'text-gray-400'}`}>
          Anomalies
        </p>
        <p className={`text-xl font-bold ${anomalyCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
          {anomalyCount}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────

const TransactionGraph = () => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [anomalyFlags, setAnomalyFlags] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filters, setFilters] = useState({
    txnType: '',
    minAmount: '',
    anomaliesOnly: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Load all customers on mount for dropdown
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await customerService.getAll({ limit: 100, sortBy: 'full_name', sortOrder: 'ASC' });
        setAllCustomers(res.data.customers);
      } catch (e) {
        console.error('Failed to load customers:', e);
      } finally {
        setCustomersLoading(false);
      }
    };
    loadCustomers();
  }, []);

  // Filter customers based on search (local filter on preloaded list)
  useEffect(() => {
    if (search.length === 0) {
      setCustomers(allCustomers);
    } else {
      const q = search.toLowerCase();
      setCustomers(
        allCustomers.filter(
          (c) =>
            c.full_name?.toLowerCase().includes(q) ||
            c.customer_id?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, allCustomers]);

  // Fetch customer data when selected
  useEffect(() => {
    if (!selectedCustomerId) return;
    fetchCustomerData(selectedCustomerId);
  }, [selectedCustomerId]);

  const fetchCustomerData = async (id) => {
    setLoading(true);
    setSelectedNode(null);
    try {
      const [profileRes, txnRes] = await Promise.all([
        customerService.getProfile(id),
        customerService.getTransactions(id, { limit: 200 }),
      ]);
      const { customer: cust, accounts: accts } = profileRes.data;
      const txns = txnRes.data;

      setCustomer(cust);
      setAccounts(accts);
      setTransactions(txns);

      const flags = detectAnomalies(txns);
      setAnomalyFlags(flags);
    } catch (e) {
      console.error('Failed to fetch customer data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Rebuild graph when data or filters change
  useEffect(() => {
    if (!customer || accounts.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }
    const parsedFilters = {
      ...filters,
      minAmount: filters.minAmount ? parseFloat(filters.minAmount) : null,
    };
    const { nodes: n, edges: e } = buildGraphData(
      customer,
      accounts,
      transactions,
      anomalyFlags,
      parsedFilters
    );
    setNodes(n);
    setEdges(e);
  }, [customer, accounts, transactions, anomalyFlags, filters]);

  const handleSelectCustomer = (c) => {
    setSearch('');
    setShowDropdown(false);
    setSelectedCustomerId(c.id);
  };

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const handleReset = () => {
    setSearch('');
    setSelectedCustomerId(null);
    setCustomer(null);
    setAccounts([]);
    setTransactions([]);
    setAnomalyFlags(new Map());
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setFilters({ txnType: '', minAmount: '', anomaliesOnly: false });
  };

  const txnTypes = useMemo(
    () => [...new Set(transactions.map((t) => t.transaction_type))].sort(),
    [transactions]
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction Graph</h1>
        <p className="text-sm text-gray-500 mt-1">
          Visualize transaction relationships and detect anomalies in customer activity
        </p>
      </div>

      {/* Customer Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Dropdown selector */}
          <div className="sm:w-64 flex-shrink-0">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Customer
            </label>
            <select
              value={selectedCustomerId || ''}
              onChange={(e) => {
                const c = allCustomers.find((x) => x.id === e.target.value);
                if (c) handleSelectCustomer(c);
              }}
              disabled={customersLoading}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
            >
              <option value="">{customersLoading ? 'Loading...' : 'Select a customer'}</option>
              {allCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.customer_id}) — {c.kyc_risk_rating}
                </option>
              ))}
            </select>
          </div>

          {/* Search with autocomplete */}
          <div className="flex-1 relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Or Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Search by name, ID, or email..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Search dropdown */}
            {showDropdown && search.length > 0 && customers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                {customers.slice(0, 10).map((c) => (
                  <button
                    key={c.id}
                    onMouseDown={() => handleSelectCustomer(c)}
                    className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{c.full_name}</div>
                        <div className="text-xs text-gray-500">
                          {c.customer_id} &middot; {c.customer_type}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.kyc_risk_rating === 'Low'
                            ? 'bg-green-100 text-green-700'
                            : c.kyc_risk_rating === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : c.kyc_risk_rating === 'High'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {c.kyc_risk_rating}
                      </span>
                    </div>
                  </button>
                ))}
                {customers.length === 0 && search.length > 0 && (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">No matches found</div>
                )}
              </div>
            )}
          </div>

          {selectedCustomerId && (
            <>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    showFilters
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FunnelIcon className="w-4 h-4" />
                  Filters
                </button>
                <button
                  onClick={() => fetchCustomerData(selectedCustomerId)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </>
          )}
        </div>

        {/* Filters */}
        {showFilters && selectedCustomerId && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Transaction Type
              </label>
              <select
                value={filters.txnType}
                onChange={(e) => setFilters((f) => ({ ...f, txnType: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                {txnTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Min Amount (INR)
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => setFilters((f) => ({ ...f, minAmount: e.target.value }))}
                placeholder="e.g. 100000"
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm w-36 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer pb-1">
              <input
                type="checkbox"
                checked={filters.anomaliesOnly}
                onChange={(e) => setFilters((f) => ({ ...f, anomaliesOnly: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-red-600">Anomalies Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Stats */}
      {customer && transactions.length > 0 && (
        <StatsBar transactions={transactions} anomalyFlags={anomalyFlags} />
      )}

      {/* Graph Area */}
      {loading ? (
        <div className="flex items-center justify-center h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-4">Loading transaction graph...</p>
          </div>
        </div>
      ) : customer ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
          {transactions.length === 0 ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <InformationCircleIcon className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-500 mt-3">No transactions found for this customer</p>
              </div>
            </div>
          ) : (
            <div style={{ height: 600 }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                minZoom={0.2}
                maxZoom={2}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="#e5e7eb" gap={20} size={1} />
                <Controls
                  className="!bg-white !border-gray-200 !shadow-lg !rounded-xl"
                  showInteractive={false}
                />
                <MiniMap
                  className="!bg-gray-50 !border-gray-200 !rounded-xl !shadow-lg"
                  nodeColor={(n) =>
                    n.type === 'customer'
                      ? '#1e3a5f'
                      : n.type === 'account'
                      ? '#0d9488'
                      : n.data?.anomalyCount > 0
                      ? '#ef4444'
                      : '#9ca3af'
                  }
                  maskColor="rgba(0,0,0,0.08)"
                />
                <Legend />
              </ReactFlow>
              <DetailPanel
                selectedNode={selectedNode}
                transactions={transactions}
                anomalyFlags={anomalyFlags}
                onClose={() => setSelectedNode(null)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800">Select a Customer</h3>
            <p className="text-sm text-gray-500 mt-1">
              Search for a customer above to visualize their transaction network and detect anomalies
            </p>
          </div>
        </div>
      )}

      {/* Info Footer */}
      {customer && transactions.length > 0 && anomalyFlags.size > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <span className="font-semibold">{anomalyFlags.size} suspicious transaction{anomalyFlags.size !== 1 ? 's' : ''} detected.</span>{' '}
            Anomalies are highlighted with red dashed edges and flagged counterparty nodes.
            Click on any node to view detailed transaction information.
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionGraph;
