import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  List, 
  FileClock, 
  LogOut, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X,
  Command,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

const AdminLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/admin', label: 'Command Center', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/verifications', label: 'Verifications', icon: ShieldCheck },
    { to: '/admin/listings', label: 'Marketplace Review', icon: List },
    { to: '/admin/audit', label: 'Audit Trail', icon: FileClock },
  ];

  return (
    <div className="h-screen w-full bg-background-primary flex font-sans overflow-hidden selection:bg-accent-primary/20">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        ${isMobileMenuOpen ? 'translate-x-0 flex w-64' : '-translate-x-full md:translate-x-0 flex'}
        bg-background-secondary border-r border-border-primary flex-col justify-between transition-all duration-300 shadow-sm
      `}>
        
        {/* Collapse Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:flex absolute -right-3 top-8 bg-background-primary border border-border-primary text-text-secondary rounded-full p-1 shadow-md hover:text-accent-primary hover:border-accent-primary transition-all z-30"
        >
          {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute right-4 top-6 text-text-secondary hover:text-text-primary z-30"
        >
          <X size={22} />
        </button>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Sidebar Header */}
          <div className={`p-6 h-20 flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} border-b border-border-primary/50`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-md shrink-0">
              <Command className="text-white w-5 h-5" />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <h2 className="text-base font-display font-bold text-text-primary tracking-tight truncate">ShipStack</h2>
                <p className="text-[9px] font-bold text-accent-primary tracking-widest uppercase">Admin OS</p>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="px-3 py-4 space-y-1">
            {isSidebarOpen && <p className="px-3 pb-2 text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Management</p>}
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 font-bold text-sm transition-all group ${
                    !isSidebarOpen ? 'justify-center px-0' : ''
                  } ${
                    isActive
                      ? 'border-l-[3px] border-accent-primary text-accent-primary'
                      : 'border-l-[3px] border-transparent text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl'
                  }`
                }
                title={item.label}
              >
                <item.icon className="shrink-0 transition-colors" size={18} />
                {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-border-primary">
          {isSidebarOpen ? (
            <Link to="/dashboard" className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border-2 border-border-primary text-text-secondary hover:text-text-primary hover:border-text-primary hover:bg-background-secondary transition-all text-sm font-bold shadow-sm">
              <ArrowLeft size={16} /> Exit Admin
            </Link>
          ) : (
            <Link to="/dashboard" className="flex items-center justify-center w-full py-2.5 rounded-xl border-2 border-border-primary text-text-secondary hover:text-text-primary hover:border-text-primary hover:bg-background-secondary transition-all shadow-sm" title="Exit Admin">
              <ArrowLeft size={16} />
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-background-primary/50 relative">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border-primary bg-background-primary flex items-center justify-between px-4 sm:px-6 shrink-0 md:hidden z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background-secondary"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-800">
                <Command className="text-white w-3 h-3" />
              </div>
              <span className="font-display font-bold text-text-primary">Admin OS</span>
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 border-b border-border-primary bg-background-primary/80 backdrop-blur-md items-center justify-between px-8 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary bg-background-secondary px-3 py-1.5 rounded-full border border-border-primary shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
              {user?.username} (Admin)
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 w-full mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
