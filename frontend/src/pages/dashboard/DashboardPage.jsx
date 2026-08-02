import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Store, Package, LogOut, Code, User, ChevronRight, ChevronLeft, Sparkles, Menu, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                            <button disabled className="w-full flex items-center justify-between px-3 py-2.5 text-text-tertiary opacity-70 cursor-not-allowed rounded-lg font-medium text-sm" title="My Purchases">
                                <div className="flex items-center gap-3">
                                    <Package size={18} className="shrink-0" /> 
                                    {isSidebarOpen && <span className="whitespace-nowrap">My Purchases</span>}
                                </div>
                                {isSidebarOpen && <span className="text-[10px] uppercase font-bold tracking-wider bg-border-primary px-1.5 py-0.5 rounded shrink-0">Soon</span>}
                            </button>
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
                    <Button variant="ghost" size="sm" onClick={logout}>Sign Out</Button>
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
                                        <p className="text-sm text-text-secondary">Apply for developer verification to start selling your software.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Storefront Card */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-accent-primary to-accent-hover p-8 rounded-2xl shadow-md text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="relative z-10 space-y-3">
                                <h2 className="text-3xl font-display font-bold">Build Your Storefront</h2>
                                <p className="text-blue-50 max-w-lg leading-relaxed">
                                    {user?.is_verified_developer 
                                        ? "Design your storefront banner, upload your logo, and establish your professional brand on ShipStack."
                                        : "Unlock the ability to create a professional storefront and sell your software by applying to become a verified developer."}
                                </p>
                            </div>
                            <div className="relative z-10 shrink-0 w-full md:w-auto">
                                {user?.is_verified_developer ? (
                                    <Link to="/developer/storefront-settings">
                                        <Button className="w-full md:w-auto h-12 px-8 bg-white text-accent-primary hover:bg-blue-50 border-none shadow-xl hover:shadow-2xl transition-shadow font-bold text-lg">
                                            Manage Storefront <ChevronRight size={20} className="ml-1"/>
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link to="/developer/apply">
                                        <Button className="w-full md:w-auto h-12 px-8 bg-white text-accent-primary hover:bg-blue-50 border-none shadow-xl hover:shadow-2xl transition-shadow font-bold text-lg">
                                            Apply Now <ChevronRight size={20} className="ml-1"/>
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
