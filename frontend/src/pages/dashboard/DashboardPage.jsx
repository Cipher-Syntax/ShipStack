import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    LayoutDashboard, 
    Store, 
    Package, 
    LogOut, 
    Code, 
    User, 
    ChevronRight, 
    ChevronLeft, 
    Sparkles, 
    Menu, 
    X, 
    MessageSquare, 
    ClipboardList, 
    DollarSign,
    Plus,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    Clock
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { NotificationBell } from '../../components/NotificationBell';
import { commerceService } from '../../services/commerceService';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [sales, setSales] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.is_verified_developer) {
            commerceService.getDeveloperSales()
                .then(setSales)
                .catch(console.error);
        }
        commerceService.getMyPurchases()
            .then(setPurchases)
            .catch(console.error);
    }, [user]);

    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.purchase_price), 0);
    const uniqueCustomers = new Set(sales.map(s => s.buyer.id)).size;

    return (
        <div className="h-screen w-full bg-background-primary flex font-sans overflow-hidden">
            
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
                    <div className="p-6 h-20 flex items-center">
                        <Link to="/" className="flex items-center gap-3 text-2xl font-display font-bold text-text-primary overflow-hidden group">
                            <img src="/shipstack_logo.jpg" alt="ShipStack" className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0 group-hover:scale-105 transition-transform" />
                            {isSidebarOpen && <span className="whitespace-nowrap tracking-tight">ShipStack</span>}
                        </Link>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="px-3 py-2 space-y-1">
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 border-l-[3px] border-accent-primary text-accent-primary font-bold text-sm transition-all group" title="Overview">
                            <LayoutDashboard size={18} className="shrink-0" />
                            {isSidebarOpen && <span className="whitespace-nowrap">Overview</span>}
                        </Link>
                        
                        <Link to="/messages" className="flex items-center gap-3 px-4 py-2.5 border-l-[3px] border-transparent text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="Messages">
                            <MessageSquare size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                            {isSidebarOpen && <span className="whitespace-nowrap">Messages</span>}
                        </Link>
                        
                        <Link to="/requests" className="flex items-center gap-3 px-4 py-2.5 border-l-[3px] border-transparent text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="Requests">
                            <ClipboardList size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                            {isSidebarOpen && <span className="whitespace-nowrap">Requests</span>}
                        </Link>
                        
                        {user?.is_verified_developer ? (
                            <>
                                <div className="pt-3 pb-1 px-3">
                                    {isSidebarOpen && <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Creator Hub</p>}
                                </div>
                                <Link to="/developer/listings" className="flex items-center gap-3 px-4 py-2.5 border-l-[3px] border-transparent text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="My Software">
                                    <Code size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                    {isSidebarOpen && <span className="whitespace-nowrap">My Software</span>}
                                </Link>
                                <Link to="/developer/sales" className="flex items-center gap-3 px-4 py-2.5 border-l-[3px] border-transparent text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="My Sales">
                                    <DollarSign size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                    {isSidebarOpen && <span className="whitespace-nowrap">Sales & Revenue</span>}
                                </Link>
                                <Link to="/developer/storefront-settings" className="flex items-center gap-3 px-4 py-2.5 border-l-[3px] border-transparent text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="Storefront">
                                    <Store size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                    {isSidebarOpen && <span className="whitespace-nowrap">Storefront</span>}
                                </Link>
                            </>
                        ) : (
                            <Link to="/developer/apply" className="flex items-center justify-between px-4 py-2.5 border-l-[3px] border-transparent text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="Become a Creator">
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} className="shrink-0 text-amber-500 group-hover:scale-110 transition-transform" /> 
                                    {isSidebarOpen && <span className="whitespace-nowrap font-medium">Become a Creator</span>}
                                </div>
                            </Link>
                        )}

                        <div className="pt-4 mt-4 border-t border-border-primary">
                            {isSidebarOpen && <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-3 pb-1">Buyer Hub</p>}
                            <Link to="/dashboard/purchases" className="flex items-center gap-3 px-4 py-2.5 border-l-[3px] border-transparent text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="My Purchases">
                                <Package size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                {isSidebarOpen && <span className="whitespace-nowrap">My Purchases</span>}
                            </Link>
                        </div>

                        {(user?.is_staff || user?.is_superuser) && (
                            <div className="pt-4 mt-4 border-t border-border-primary">
                                {isSidebarOpen && <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-3 pb-1">Admin</p>}
                                <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 border-l-[3px] border-transparent text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="Admin Panel">
                                    <ShieldCheck size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                    {isSidebarOpen && <span className="whitespace-nowrap">Admin Panel</span>}
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
                
                {/* User Info / Logout */}
                <div className="p-4 border-t border-border-primary">
                    <div className={`flex items-center ${isSidebarOpen ? 'gap-3 px-2' : 'justify-center'} mb-3 transition-all`}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-primary to-blue-500 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
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
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-border-primary rounded-xl font-semibold text-sm" onClick={logout}>
                            <LogOut size={16} /> Sign Out
                        </Button>
                    ) : (
                        <button 
                            onClick={logout} 
                            className="w-full flex items-center justify-center p-2.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-background-primary/50">
                {/* Mobile Header */}
                <header className="h-16 border-b border-border-primary bg-background-primary flex items-center justify-between px-4 sm:px-6 shrink-0 md:hidden">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background-secondary"
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
                <header className="hidden md:flex h-16 border-b border-border-primary bg-background-primary/80 backdrop-blur-md items-center justify-between px-8 shrink-0 sticky top-0 z-20">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="font-semibold text-text-primary">Dashboard</span>
                        <span>/</span>
                        <span>Overview</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="h-4 w-px bg-border-primary"></div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary bg-background-secondary px-3 py-1.5 rounded-full border border-border-primary">
                            {user?.username}
                        </div>
                    </div>
                </header>

                {/* Dashboard Content Container */}
                <div className="p-6 md:p-10 w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
                    
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-primary">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">
                                Welcome, {user?.username}
                            </h1>
                            <p className="text-text-secondary text-base">
                                {user?.is_verified_developer 
                                    ? "Here's an overview of your marketplace business." 
                                    : "Explore the marketplace and manage your software."}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            {user?.is_verified_developer ? (
                                <Link to="/developer/listings/new/basics">
                                    <Button className="bg-text-primary hover:bg-background-secondary hover:text-text-primary text-background-primary rounded-xl font-bold px-5 h-11 border border-transparent hover:border-border-primary">
                                        <Plus size={18} className="mr-2" /> New Listing
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/browse">
                                    <Button className="bg-text-primary hover:bg-background-secondary hover:text-text-primary text-background-primary rounded-xl font-bold px-5 h-11 border border-transparent hover:border-border-primary">
                                        Explore Marketplace
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {user?.is_verified_developer && (
                            <>
                                <div className="bg-background-primary p-6 rounded-2xl border border-border-primary shadow-sm flex flex-col justify-center">
                                    <span className="text-sm font-semibold text-text-secondary mb-1">Total Revenue</span>
                                    <h3 className="text-3xl font-display font-bold text-text-primary">
                                        {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(totalRevenue)}
                                    </h3>
                                </div>
                                <div className="bg-background-primary p-6 rounded-2xl border border-border-primary shadow-sm flex flex-col justify-center">
                                    <span className="text-sm font-semibold text-text-secondary mb-1">Sales Completed</span>
                                    <h3 className="text-3xl font-display font-bold text-text-primary">{sales.length}</h3>
                                </div>
                            </>
                        )}
                        <div className="bg-background-primary p-6 rounded-2xl border border-border-primary shadow-sm flex flex-col justify-center">
                            <span className="text-sm font-semibold text-text-secondary mb-1">My Purchases</span>
                            <h3 className="text-3xl font-display font-bold text-text-primary">{purchases.length}</h3>
                        </div>
                    </div>

                    {/* Call to Action */}
                    {!user?.is_verified_developer && (
                        <div className="mt-8 bg-background-secondary rounded-2xl p-8 border border-border-primary shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">Are you a developer?</h3>
                                <p className="text-text-secondary text-sm">Join ShipStack as a verified creator to start selling your software directly to buyers.</p>
                            </div>
                            <Link to="/developer/apply" className="shrink-0">
                                <Button variant="outline" className="h-11 px-6 font-bold rounded-xl border-2 border-border-primary bg-background-primary hover:bg-background-secondary">
                                    Become a Creator
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
