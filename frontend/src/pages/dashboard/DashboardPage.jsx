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
                        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 bg-accent-primary/10 text-accent-primary font-bold text-sm rounded-xl transition-all group" title="Overview">
                            <LayoutDashboard size={18} className="shrink-0" />
                            {isSidebarOpen && <span className="whitespace-nowrap">Overview</span>}
                        </Link>
                        
                        <Link to="/messages" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="Messages">
                            <MessageSquare size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                            {isSidebarOpen && <span className="whitespace-nowrap">Messages</span>}
                        </Link>
                        
                        <Link to="/requests" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-lg font-medium text-sm transition-colors group" title="Requests">
                            <ClipboardList size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                            {isSidebarOpen && <span className="whitespace-nowrap">Requests</span>}
                        </Link>
                        
                        {user?.is_verified_developer ? (
                            <>
                                <div className="pt-3 pb-1 px-3">
                                    {isSidebarOpen && <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Creator Hub</p>}
                                </div>
                                <Link to="/developer/listings" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="My Software">
                                    <Code size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                    {isSidebarOpen && <span className="whitespace-nowrap">My Software</span>}
                                </Link>
                                <Link to="/developer/sales" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="My Sales">
                                    <DollarSign size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                    {isSidebarOpen && <span className="whitespace-nowrap">Sales & Revenue</span>}
                                </Link>
                                <Link to="/developer/storefront-settings" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="Storefront">
                                    <Store size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                    {isSidebarOpen && <span className="whitespace-nowrap">Storefront</span>}
                                </Link>
                            </>
                        ) : (
                            <Link to="/developer/apply" className="flex items-center justify-between px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="Become a Creator">
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} className="shrink-0 text-amber-500 group-hover:scale-110 transition-transform" /> 
                                    {isSidebarOpen && <span className="whitespace-nowrap font-medium">Become a Creator</span>}
                                </div>
                            </Link>
                        )}

                        <div className="pt-4 mt-4 border-t border-border-primary">
                            {isSidebarOpen && <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-3 pb-1">Buyer Hub</p>}
                            <Link to="/dashboard/purchases" className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-background-primary hover:text-text-primary rounded-xl font-medium text-sm transition-colors group" title="My Purchases">
                                <Package size={18} className="shrink-0 group-hover:text-accent-primary transition-colors" />
                                {isSidebarOpen && <span className="whitespace-nowrap">My Purchases</span>}
                            </Link>
                        </div>
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
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            {user?.username}
                        </div>
                    </div>
                </header>

                {/* Dashboard Content Container */}
                <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
                    
                    {/* Welcome Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
                                    Welcome back, {user?.username}!
                                </h1>
                                {user?.is_verified_developer ? (
                                    <span className="inline-flex items-center gap-1 bg-blue-500/10 text-accent-primary border border-accent-primary/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                        <ShieldCheck size={13} /> Verified Creator
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 bg-text-tertiary/10 text-text-secondary border border-border-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
                                        Buyer
                                    </span>
                                )}
                            </div>
                            <p className="text-text-secondary text-sm">
                                Overview of your marketplace activity, sales, and software assets.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {user?.is_verified_developer ? (
                                <Link to="/developer/listings/new/basics">
                                    <Button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-hover text-white rounded-xl font-bold px-4 py-2.5 shadow-sm">
                                        <Plus size={16} /> New Listing
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/developer/apply">
                                    <Button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-hover text-white rounded-xl font-bold px-4 py-2.5 shadow-sm">
                                        <Sparkles size={16} /> Become a Creator
                                    </Button>
                                </Link>
                            )}
                            <Link to="/browse">
                                <Button variant="outline" className="rounded-xl border-border-primary font-bold text-sm">
                                    Explore Store
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stat Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Stat 1 */}
                        <div className="bg-background-secondary p-5 rounded-2xl border border-border-primary shadow-sm hover:border-accent-primary/40 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Total Revenue</span>
                                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <DollarSign size={18} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary tracking-tight">
                                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(totalRevenue)}
                            </h3>
                            <p className="text-xs text-text-tertiary mt-1 font-medium">Lifetime earned</p>
                        </div>

                        {/* Stat 2 */}
                        <div className="bg-background-secondary p-5 rounded-2xl border border-border-primary shadow-sm hover:border-accent-primary/40 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Sales Completed</span>
                                <div className="p-2 bg-blue-500/10 text-accent-primary rounded-xl">
                                    <TrendingUp size={18} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary tracking-tight">{sales.length}</h3>
                            <p className="text-xs text-text-tertiary mt-1 font-medium">{uniqueCustomers} unique buyers</p>
                        </div>

                        {/* Stat 3 */}
                        <div className="bg-background-secondary p-5 rounded-2xl border border-border-primary shadow-sm hover:border-accent-primary/40 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">My Purchases</span>
                                <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                                    <Package size={18} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary tracking-tight">{purchases.length}</h3>
                            <p className="text-xs text-text-tertiary mt-1 font-medium">Owned licenses</p>
                        </div>

                        {/* Stat 4 */}
                        <div className="bg-background-secondary p-5 rounded-2xl border border-border-primary shadow-sm hover:border-accent-primary/40 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Account Status</span>
                                <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                                    <ShieldCheck size={18} />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">
                                {user?.is_verified_developer ? 'Verified' : 'Buyer'}
                            </h3>
                            <p className="text-xs text-text-tertiary mt-1 font-medium">Active & verified</p>
                        </div>
                    </div>

                    {/* Main Section Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Main Center Area (2 cols) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Primary Storefront Card */}
                            {user?.is_verified_developer ? (
                                <div className="bg-gradient-to-br from-accent-primary to-accent-hover rounded-2xl p-7 text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                                    <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                                    <div className="relative z-10 space-y-2">
                                        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                                            <Store size={13} /> Developer Storefront Active
                                        </div>
                                        <h2 className="text-2xl font-display font-bold">Customize Your Brand</h2>
                                        <p className="text-blue-100 text-sm max-w-lg leading-relaxed">
                                            Upload custom cover banners, configure social media profiles, and customize your creator storefront appearance.
                                        </p>
                                    </div>
                                    <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
                                        <Link to="/developer/storefront-settings">
                                            <Button className="bg-white text-accent-primary hover:bg-blue-50 font-bold border-none shadow-md rounded-xl text-sm px-5 py-2.5">
                                                Manage Storefront <ChevronRight size={16} className="ml-1" />
                                            </Button>
                                        </Link>
                                        <Link to="/developer/sales">
                                            <Button variant="ghost" className="text-white hover:bg-white/10 font-semibold rounded-xl text-sm px-4">
                                                View Sales History <ArrowUpRight size={16} className="ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-accent-primary to-accent-hover rounded-2xl p-7 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="relative z-10 space-y-2">
                                        <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-200 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold">
                                            <Sparkles size={13} /> Become a Creator
                                        </div>
                                        <h2 className="text-2xl font-display font-bold">Sell Your Software on ShipStack</h2>
                                        <p className="text-blue-100 text-sm max-w-md leading-relaxed">
                                            Apply for verified developer status to launch software products, receive payments, and interact with buyers.
                                        </p>
                                    </div>
                                    <div className="relative z-10 shrink-0 w-full md:w-auto">
                                        <Link to="/developer/apply">
                                            <Button className="w-full md:w-auto bg-white text-accent-primary hover:bg-blue-50 font-bold border-none shadow-md rounded-xl text-sm px-6 py-3">
                                                Apply Now <ChevronRight size={16} className="ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Quick Navigation Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                {/* Card 1 */}
                                <Link to="/developer/listings" className="group bg-background-secondary p-5 rounded-2xl border border-border-primary shadow-sm hover:border-accent-primary hover:shadow-md transition-all flex items-start gap-4">
                                    <div className="p-3 bg-accent-primary/10 text-accent-primary rounded-xl group-hover:bg-accent-primary group-hover:text-white transition-colors">
                                        <Code size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 font-bold text-text-primary text-base group-hover:text-accent-primary transition-colors">
                                            My Software <ArrowUpRight size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-xs text-text-secondary mt-1">Manage draft & published listings</p>
                                    </div>
                                </Link>

                                {/* Card 2 */}
                                <Link to="/requests" className="group bg-background-secondary p-5 rounded-2xl border border-border-primary shadow-sm hover:border-accent-primary hover:shadow-md transition-all flex items-start gap-4">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <ClipboardList size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 font-bold text-text-primary text-base group-hover:text-emerald-600 transition-colors">
                                            Request Board <ArrowUpRight size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-xs text-text-secondary mt-1">Browse client software requests</p>
                                    </div>
                                </Link>

                                {/* Card 3 */}
                                <Link to="/dashboard/purchases" className="group bg-background-secondary p-5 rounded-2xl border border-border-primary shadow-sm hover:border-accent-primary hover:shadow-md transition-all flex items-start gap-4">
                                    <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 font-bold text-text-primary text-base group-hover:text-purple-600 transition-colors">
                                            My Purchases <ArrowUpRight size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-xs text-text-secondary mt-1">Download owned software files</p>
                                    </div>
                                </Link>

                                {/* Card 4 */}
                                <Link to="/messages" className="group bg-background-secondary p-5 rounded-2xl border border-border-primary shadow-sm hover:border-accent-primary hover:shadow-md transition-all flex items-start gap-4">
                                    <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 font-bold text-text-primary text-base group-hover:text-amber-600 transition-colors">
                                            Messages <ArrowUpRight size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-xs text-text-secondary mt-1">Chat directly with buyers & sellers</p>
                                    </div>
                                </Link>

                            </div>

                        </div>

                        {/* Right Sidebar Status Column (1 col) */}
                        <div className="space-y-6">
                            
                            {/* Profile Card */}
                            <div className="bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-text-primary text-base truncate">{user?.username}</h3>
                                        <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border-primary space-y-3 text-xs">
                                    <div className="flex justify-between items-center text-text-secondary">
                                        <span>Role</span>
                                        <span className="font-bold text-text-primary">{user?.is_verified_developer ? 'Developer' : 'Buyer'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-text-secondary">
                                        <span>Verification</span>
                                        <span className={`font-bold ${user?.is_verified_developer ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {user?.is_verified_developer ? 'Verified' : 'Unverified'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-text-secondary">
                                        <span>Account Health</span>
                                        <span className="font-bold text-emerald-600">Good</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Action Shortcuts */}
                            <div className="bg-background-secondary p-5 rounded-2xl border border-border-primary shadow-sm space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary px-1">Shortcuts</h4>
                                <div className="space-y-1 text-sm font-semibold">
                                    <Link to="/browse" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-background-primary text-text-primary transition-colors">
                                        <span>Browse Marketplace</span>
                                        <ChevronRight size={16} className="text-text-tertiary" />
                                    </Link>
                                    <Link to="/requests/new" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-background-primary text-text-primary transition-colors">
                                        <span>Post a Request</span>
                                        <ChevronRight size={16} className="text-text-tertiary" />
                                    </Link>
                                    {user?.is_verified_developer && (
                                        <Link to="/developer/sales" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-background-primary text-text-primary transition-colors">
                                            <span>Sales & Revenue Analytics</span>
                                            <ChevronRight size={16} className="text-text-tertiary" />
                                        </Link>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
