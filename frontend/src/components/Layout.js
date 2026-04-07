import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  BellAlertIcon,
  DocumentTextIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Alerts', href: '/alerts', icon: BellAlertIcon, badge: true },
  { name: 'SAR Reports', href: '/sar', icon: DocumentTextIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Audit Logs', href: '/audit', icon: ClipboardDocumentListIcon, roles: ['admin', 'compliance_officer'] },
];

const NavItem = ({ item, isActive, onClick }) => (
  <Link
    to={item.href}
    onClick={onClick}
    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
  >
    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
    <span className="flex-1">{item.name}</span>
    {isActive && <ChevronRightIcon className="h-4 w-4 opacity-50" />}
  </Link>
);

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrator',
      compliance_officer: 'Compliance Officer',
      senior_analyst: 'Senior Analyst',
      analyst: 'Analyst'
    };
    return roles[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="fixed inset-0 bg-primary-950/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform lg:hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="sidebar h-full flex flex-col shadow-sidebar">
          <div className="sidebar-header flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-lg font-semibold text-white">SAR Generator</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-primary-300 hover:text-white transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation
              .filter(item => !item.roles || item.roles.includes(user?.role))
              .map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <NavItem
                  key={item.name}
                  item={item}
                  isActive={isActive}
                  onClick={() => setSidebarOpen(false)}
                />
              );
            })}
          </nav>
          <div className="p-4 border-t border-primary-800/50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-primary-300 truncate">{getRoleLabel(user?.role)}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-primary-300 hover:text-white hover:bg-primary-800 rounded-lg transition-colors"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="sidebar flex min-h-0 flex-1 flex-col shadow-sidebar">
          <div className="sidebar-header flex h-16 items-center px-4">
            <div className="flex items-center">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <ShieldCheckIcon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-lg font-semibold text-white tracking-tight">SAR Generator</span>
                <span className="block text-[10px] text-primary-400 uppercase tracking-wider">Compliance Suite</span>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="mb-2 px-3 text-[10px] font-semibold text-primary-400 uppercase tracking-wider">
              Main Menu
            </div>
            {navigation
              .filter(item => !item.roles || item.roles.includes(user?.role))
              .map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <NavItem key={item.name} item={item} isActive={isActive} />
              );
            })}
          </nav>
          <div className="flex-shrink-0 p-4 border-t border-primary-800/50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-primary-300 truncate">{getRoleLabel(user?.role)}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-primary-300 hover:text-white hover:bg-primary-800 rounded-lg transition-colors"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex h-14 flex-shrink-0 bg-white border-b border-gray-200 lg:hidden">
          <button
            type="button"
            className="px-4 text-primary-600 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center justify-between px-4">
            <div className="flex items-center">
              <ShieldCheckIcon className="w-5 h-5 text-primary-700" />
              <span className="ml-2 text-base font-semibold text-primary-900">SAR Generator</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 lg:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-4 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-xs text-gray-400">
              SAR Narrative Generator &copy; 2026 &middot; Compliance Management Suite
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
