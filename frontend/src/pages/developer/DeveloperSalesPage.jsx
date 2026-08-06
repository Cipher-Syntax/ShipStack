import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { commerceService } from '../../services/commerceService';
import { 
    ArrowLeft, 
    DollarSign, 
    Users, 
    Package, 
    Calendar, 
    Search, 
    TrendingUp, 
    MessageSquare,
    ExternalLink,
    CheckCircle,
    Download,
    CreditCard,
    BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { RevenueAreaChart, SalesByListingBarChart, RevenuePieChart } from '../../components/charts/AnalyticsCharts';

const DeveloperSalesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('sales'); // 'sales' | 'customers'

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const data = await commerceService.getDeveloperSales();
            setSales(data);
        } catch (err) {
            console.error('Failed to fetch sales', err);
            setError('Failed to load your sales data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-primary"></div>
            </div>
        );
    }

    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.purchase_price), 0);
    
    // Group sales by unique customers
    const customerMap = {};
    sales.forEach(sale => {
        const buyerId = sale.buyer.id;
        if (!customerMap[buyerId]) {
            customerMap[buyerId] = {
                id: buyerId,
                username: sale.buyer.username,
                purchasesCount: 0,
                totalSpent: 0,
                lastPurchase: sale.purchased_at,
                listings: []
            };
        }
        customerMap[buyerId].purchasesCount += 1;
        customerMap[buyerId].totalSpent += parseFloat(sale.purchase_price);
        customerMap[buyerId].listings.push(sale.listing);
    });
    const customersList = Object.values(customerMap);

    // Filter sales based on search query
    const filteredSales = sales.filter(sale => 
        sale.listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.buyer.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter customers based on search query
    const filteredCustomers = customersList.filter(customer =>
        customer.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300 font-sans space-y-8">
            
            {/* Header Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-accent-primary transition-colors group"
                    >
                        <div className="p-1 rounded-lg bg-background-secondary group-hover:bg-accent-primary/10 transition-colors">
                            <ArrowLeft size={14} />
                        </div>
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">
                        Sales & Revenue Analytics
                    </h1>
                    <p className="text-text-secondary text-sm mt-1">
                        Interactive charts, revenue distribution, customer directory, and transaction history.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/developer/listings">
                        <Button variant="outline" className="rounded-xl border-border-primary font-bold text-sm">
                            Manage Software
                        </Button>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-200 dark:border-red-900/50 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Executive Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Revenue Card */}
                <div className="bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Gross Revenue</span>
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-display font-bold text-text-primary tracking-tight">
                        {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(totalRevenue)}
                    </h3>
                    <p className="text-xs text-text-tertiary mt-2 font-medium flex items-center gap-1">
                        <TrendingUp size={13} className="text-emerald-500" />
                        Total payouts from software sales
                    </p>
                </div>

                {/* Total Orders Card */}
                <div className="bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm relative overflow-hidden group hover:border-accent-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Orders</span>
                        <div className="p-2.5 bg-accent-primary/10 text-accent-primary rounded-xl">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-display font-bold text-text-primary tracking-tight">
                        {sales.length}
                    </h3>
                    <p className="text-xs text-text-tertiary mt-2 font-medium">
                        Average: {sales.length > 0 ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(totalRevenue / sales.length) : 'PHP 0.00'} / order
                    </p>
                </div>

                {/* Unique Buyers Card */}
                <div className="bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Unique Customers</span>
                        <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                            <Users size={20} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-display font-bold text-text-primary tracking-tight">
                        {customersList.length}
                    </h3>
                    <p className="text-xs text-text-tertiary mt-2 font-medium">
                        Verified buyer accounts
                    </p>
                </div>

            </div>

            {/* VISUAL ANALYTICS CHARTS SECTION */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <BarChart3 size={20} className="text-accent-primary" />
                    <h2 className="text-xl font-display font-bold text-text-primary">Performance Charts</h2>
                </div>

                {/* Area Chart + Donut Pie Chart Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RevenueAreaChart sales={sales} />
                    </div>
                    <div>
                        <RevenuePieChart sales={sales} />
                    </div>
                </div>

                {/* Bar Chart for Product Sales */}
                <div>
                    <SalesByListingBarChart sales={sales} />
                </div>
            </div>

            {/* Controls Bar: Tabs & Search */}
            <div className="pt-4 border-t border-border-primary">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    
                    {/* Tabs */}
                    <div className="flex bg-background-secondary p-1 rounded-xl border border-border-primary w-fit">
                        <button
                            onClick={() => setActiveTab('sales')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'sales'
                                    ? 'bg-background-primary text-text-primary shadow-sm'
                                    : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            Sales History ({sales.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('customers')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'customers'
                                    ? 'bg-background-primary text-text-primary shadow-sm'
                                    : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            Customer Directory ({customersList.length})
                        </button>
                    </div>

                    {/* Search Field */}
                    <div className="relative w-full sm:w-72">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder={activeTab === 'sales' ? "Search software or buyer..." : "Search customer name..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-background-secondary border border-border-primary rounded-xl focus:outline-none focus:border-accent-primary transition-colors text-text-primary placeholder:text-text-tertiary"
                        />
                    </div>

                </div>

                {/* TAB CONTENT: SALES HISTORY */}
                {activeTab === 'sales' && (
                    filteredSales.length === 0 ? (
                        <div className="bg-background-secondary rounded-2xl border border-border-primary p-12 text-center shadow-sm">
                            <div className="w-16 h-16 bg-background-primary rounded-2xl border border-border-primary flex items-center justify-center mx-auto mb-4 text-text-tertiary">
                                <DollarSign size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-1">
                                {searchQuery ? "No matching sales found" : "No sales recorded yet"}
                            </h3>
                            <p className="text-text-secondary text-xs max-w-sm mx-auto">
                                {searchQuery ? "Try searching with a different keyword." : "When buyers purchase your software listings, transaction records will appear here."}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-background-secondary rounded-2xl border border-border-primary overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border-primary bg-background-primary/50 text-xs font-bold uppercase tracking-wider text-text-secondary">
                                            <th className="px-6 py-3.5">Software Listing</th>
                                            <th className="px-6 py-3.5">Customer</th>
                                            <th className="px-6 py-3.5">Purchased Date</th>
                                            <th className="px-6 py-3.5">Status</th>
                                            <th className="px-6 py-3.5 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-primary">
                                        {filteredSales.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-background-primary/40 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {sale.listing.cover_image ? (
                                                            <img src={sale.listing.cover_image} alt={sale.listing.title} className="w-9 h-9 rounded-xl object-cover border border-border-primary shrink-0" />
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-xl bg-background-primary border border-border-primary flex items-center justify-center shrink-0 text-text-tertiary">
                                                                <Package size={16} />
                                                            </div>
                                                        )}
                                                        <div className="overflow-hidden">
                                                            <Link to={`/listings/${sale.listing.slug}`} className="text-sm font-bold text-text-primary hover:text-accent-primary transition-colors truncate block">
                                                                {sale.listing.title}
                                                            </Link>
                                                            <p className="text-xs text-text-tertiary truncate">ID: #{sale.listing.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold text-xs shrink-0">
                                                            {sale.buyer.username[0]?.toUpperCase()}
                                                        </div>
                                                        <span className="text-xs font-bold text-text-primary">{sale.buyer.username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-text-secondary">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={13} className="text-text-tertiary" />
                                                        {new Date(sale.purchased_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle size={12} /> Completed
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-sm font-bold text-text-primary">
                                                        {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(sale.purchase_price)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}

                {/* TAB CONTENT: CUSTOMER DIRECTORY */}
                {activeTab === 'customers' && (
                    filteredCustomers.length === 0 ? (
                        <div className="bg-background-secondary rounded-2xl border border-border-primary p-12 text-center shadow-sm">
                            <div className="w-16 h-16 bg-background-primary rounded-2xl border border-border-primary flex items-center justify-center mx-auto mb-4 text-text-tertiary">
                                <Users size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-1">
                                {searchQuery ? "No matching customers" : "No buyers yet"}
                            </h3>
                            <p className="text-text-secondary text-xs max-w-sm mx-auto">
                                Customer profile records will be generated automatically upon their first software purchase.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredCustomers.map((customer) => (
                                <div key={customer.id} className="bg-background-secondary p-5 rounded-2xl border border-border-primary shadow-sm hover:border-accent-primary/50 transition-all flex flex-col justify-between space-y-4">
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-accent-primary to-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                                            {customer.username[0]?.toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="font-bold text-text-primary text-sm truncate">{customer.username}</h4>
                                            <p className="text-xs text-text-tertiary">Buyer ID: #{customer.id}</p>
                                        </div>
                                    </div>

                                    <div className="bg-background-primary/60 p-3 rounded-xl border border-border-primary/60 space-y-2 text-xs">
                                        <div className="flex justify-between items-center text-text-secondary">
                                            <span>Total Purchases</span>
                                            <span className="font-bold text-text-primary">{customer.purchasesCount} {customer.purchasesCount === 1 ? 'software' : 'softwares'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-text-secondary">
                                            <span>Total Spent</span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(customer.totalSpent)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Link to="/messages">
                                            <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-xl text-xs font-bold border-border-primary py-2 text-text-primary hover:text-accent-primary hover:border-accent-primary/40">
                                                <MessageSquare size={14} /> Send Message
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )
                )}

            </div>

        </div>
    );
};

export default DeveloperSalesPage;
