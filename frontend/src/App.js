import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import AlertDetail from './pages/AlertDetail';
import SarReports from './pages/SarReports';
import SarDetail from './pages/SarDetail';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import AuditLogs from './pages/AuditLogs';
import TransactionGraph from './pages/TransactionGraph';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="alerts/:id" element={<AlertDetail />} />
            <Route path="sar" element={<SarReports />} />
            <Route path="sar/:id" element={<SarDetail />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="txn-graph" element={<TransactionGraph />} />
            <Route path="audit" element={<ProtectedRoute roles={['admin', 'compliance_officer']}><AuditLogs /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
