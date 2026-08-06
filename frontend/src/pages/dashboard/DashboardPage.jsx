import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Store, Package, LogOut, Code, User, ChevronRight, ChevronLeft, Sparkles, Menu, X, MessageSquare, ClipboardList, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { NotificationBell } from '../../components/NotificationBell';
import { commerceService } from '../../services/commerceService';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [sales, setSales] = useState([]);

    useEffect(() => {
        if (user?.is_verified_developer) {
            commerceService.getDeveloperSales()
                .then(setSales)
                .catch(console.error);
        }
    }, [user]);

    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.purchase_price), 0);

    return (
        <div className="h-screen w-full bg-background-primary flex font-sans overflow-hidden">
            
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                ${isSidebarOpen ? 'w-64' : 'w-20'} 
                ${isMobileMenuOpen ? 'translate-x-0 flex w-64' : '-translate-x-full md:translate-x-0 flex'}
                bg-background-secondary border-r border-border-primary flex-col justify-between transition-all duration-300
            `}>
                
                {/* Collapse Toggle Button (Desktop Only) */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden md:block absolute -right-3 top-8 bg-background-primary border border-border-primary text-text-secondary rounded-full p-1 shadow-sm hover:text-accent-primary hover:border-accent-primary transition-colors z-30"
                >
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

                {/* Mobile Close Button */}
                <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="md:hidden absolute right-4 top-6 text-text-secondary hover:text-text-primary z-30"
                >
                    <X size={24} />
                </button>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {/* Sidebar Header */}
                    <div className="p-6 h-20 flex items-center">
                        <Link to="/" className="flex items-center gap-3 text-2xl font-display font-bold text-text-primary overflow-hidden">
                            <img src="/shipstack_logo.jpg" alt="ShipStack" className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0" />
                            {isSidebarOpen && <span className="whitespace-nowrap">ShipStack</span>}
                        </Link>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="px-3 py-2 space-y-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-accent-primary font-bold text-sm relative group rounded-lg" title="Overview">
                            <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-accent-primary rounded-r-full"></div>
                            <LayoutDashboard size={18} className="shrink-0" />
                            {isSidebarOpen && <span className="whitespace-nowrap">Overview</span>}
                        </Link>
                        
                        <Link to="/messages" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-lg font-medium text-sm transition-colors group" title="Messages">
                            <MessageSquare size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                            {isSidebarOpen && <span className="whitespace-nowrap">Messages</span>}
                        </Link>
                        
                        <Link to="/requests" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-lg font-medium text-sm transition-colors group" title="Requests">
                            <ClipboardList size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                            {isSidebarOpen && <span className="whitespace-nowrap">Requests</span>}
                        </Link>
                        
                        {user?.is_verified_developer ? (
                            <>
                                <Link to="/developer/storefront-settings" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-lg font-medium text-sm transition-colors group" title="Storefront">
                                    <Store size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                    {isSidebarOpen && <span className="whitespace-nowrap">Storefront</span>}
                                </Link>
                                <Link to="/developer/listings" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-lg font-medium text-sm transition-colors group" title="My Software">
                                    <Code size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                    {isSidebarOpen && <span className="whitespace-nowrap">My Software</span>}
                                </Link>
                                <Link to="/developer/sales" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-lg font-medium text-sm transition-colors group" title="My Sales">
                                    <DollarSign size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                    {isSidebarOpen && <span className="whitespace-nowrap">My Sales</span>}
                                </Link>
                            </>
                        ) : (
                            <Link to="/developer/apply" className="flex items-center justify-between px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-lg font-medium text-sm transition-colors group" title="Become a Creator">
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} className="shrink-0 text-yellow-500 group-hover:scale-110 transition-transform" /> 
                                    {isSidebarOpen && <span className="whitespace-nowrap">Become a Creator</span>}
                                </div>
                            </Link>
                        )}

                        <div className="pt-4 mt-4 border-t border-border-primary">
                            <Link to="/dashboard/purchases" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-lg font-medium text-sm transition-colors group" title="My Purchases">
                                <Package size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                {isSidebarOpen && <span className="whitespace-nowrap">My Purchases</span>}
                            </Link>
                        </div>
                    </nav>
                </div>
                
                {/* User Info / Logout */}
                <div className="p-4 border-t border-border-primary">
                    <div className={`flex items-center ${isSidebarOpen ? 'gap-3 px-2' : 'justify-center'} mb-4 transition-all`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-primary to-blue-400 flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-text-primary truncate">{user?.username}</p>
                                <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    {isSidebarOpen ? (
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-border-primary" onClick={logout}>
                            <LogOut size={16} /> Sign Out
                        </Button>
                    ) : (
                        <button 
                            onClick={logout} 
                            className="w-full flex items-center justify-center p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Mobile Header */}
                <header className="h-16 border-b border-border-primary bg-background-primary flex items-center justify-between px-4 sm:px-6 shrink-0 md:hidden">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-background-secondary"
                        >
                            <Menu size={24} />
                        </button>
                        <Link to="/" className="flex items-center gap-2 text-xl font-display font-bold text-text-primary">
                            <img src="/shipstack_logo.jpg" alt="ShipStack" className="w-6 h-6 rounded object-cover shadow-sm" />
                            ShipStack
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <NotificationBell />
                        <Button variant="ghost" size="sm" onClick={logout}>Sign Out</Button>
                    </div>
                </header>

                {/* Desktop Header */}
                <header className="hidden md:flex h-16 border-b border-border-primary bg-background-primary items-center justify-end px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="text-sm font-medium text-text-primary">
                            {user?.username}
                        </div>
                    </div>
                </header>

                {/* Dashboard Content Container */}
                <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-text-primary">Welcome back, {user?.username}!</h1>
                        <p className="text-text-secondary mt-1">Here's what's happening with your account today.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Status Card */}
                        <div className="bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm flex flex-col justify-between">
                            <div className="flex items-center gap-3 text-text-secondary mb-4">
                                <User size={20} /> <span className="font-semibold">Account Status</span>
                            </div>
                            <div>
                                {user?.is_verified_developer ? (
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold mb-2">
                                            Verified Developer
                                        </div>
                                        <p className="text-sm text-text-primary font-medium">You have full access to create storefronts and publish software.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full text-xs font-bold mb-2">
                                            Buyer Account
                                        </div>
                                        <p className="text-sm text-text-secondary mb-4">Apply for developer verification to start selling your software.</p>
                                        <Link to="/dashboard/purchases" className="w-full flex items-center justify-center gap-2 py-2 bg-background-primary border border-border-primary hover:border-accent-primary hover:text-accent-primary text-text-primary rounded-lg text-sm font-bold transition-colors">
                                            <Package size={16} /> View My Purchases
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Storefront / Metrics Card */}
                        {user?.is_verified_developer ? (
                            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-accent-primary to-accent-hover p-8 rounded-2xl shadow-md text-white flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-2 text-blue-100">
                                            <DollarSign size={20} /> <span className="font-semibold text-sm uppercase tracking-wider">Total Revenue</span>
                                        </div>
                                        <h2 className="text-4xl font-display font-bold">
                                            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(totalRevenue)}
                                        </h2>
                                        <p className="mt-2 text-blue-50 text-sm">From {sales.length} total sales.</p>
                                    </div>
                                    <div className="relative z-10 mt-6 pt-6 border-t border-white/20 flex gap-4">
                                        <Link to="/developer/sales" className="text-sm font-bold hover:text-blue-100 flex items-center gap-1">
                                            View Sales <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                                <div className="bg-background-secondary p-8 rounded-2xl shadow-sm border border-border-primary flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-text-secondary">
                                            <Store size={20} /> <span className="font-semibold text-sm uppercase tracking-wider">Storefront</span>
                                        </div>
                                        <h2 className="text-2xl font-display font-bold text-text-primary">Brand Settings</h2>
                                        <p className="mt-2 text-text-secondary text-sm">Manage your public developer profile and banner.</p>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-border-primary">
                                        <Link to="/developer/storefront-settings" className="text-sm font-bold text-accent-primary hover:text-accent-hover flex items-center gap-1">
                                            Manage Storefront <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="lg:col-span-2 bg-gradient-to-br from-accent-primary to-accent-hover p-8 rounded-2xl shadow-md text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                <div className="relative z-10 space-y-3">
                                    <h2 className="text-3xl font-display font-bold">Build Your Storefront</h2>
                                    <p className="text-blue-50 max-w-lg leading-relaxed">
                                        Unlock the ability to create a professional storefront and sell your software by applying to become a verified developer.
                                    </p>
                                </div>
                                <div className="relative z-10 shrink-0 w-full md:w-auto">
                                    <Link to="/developer/apply">
                                        <Button className="w-full md:w-auto h-12 px-8 bg-white text-accent-primary hover:bg-blue-50 border-none shadow-xl hover:shadow-2xl transition-shadow font-bold text-lg">
                                            Apply Now <ChevronRight size={20} className="ml-1"/>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
