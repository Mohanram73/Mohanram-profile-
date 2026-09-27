import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import PublicPortfolio from './components/public/PublicPortfolio';
import AdminLayout from './components/admin/AdminLayout';
import Login from './components/admin/Login';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
  });

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin') || window.location.hash === '#admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
  };

  const backToSite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  if (isAdminRoute) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#070b16] flex items-center justify-center font-mono text-xs text-teal-400">
          Checking Security Credentials...
        </div>
      );
    }
    if (isAuthenticated) {
      return <AdminLayout onBackToSite={backToSite} />;
    }
    return <Login onBackToSite={backToSite} />;
  }

  return <PublicPortfolio onOpenAdmin={openAdmin} />;
}
