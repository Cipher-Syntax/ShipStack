import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { commerceService } from '../../services/commerceService';
import { ArrowLeft, DollarSign, Users, Package, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DeveloperSalesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
            </div>
        );
    }

    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.purchase_price), 0);
    const uniqueCustomers = new Set(sales.map(s => s.buyer.id)).size;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            <button 
                onClick={() => navigate('/dashboard')} 
                className="mb-8 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors group w-max"
            >
                <div className="p-1.5 rounded-full bg-background-secondary group-hover:bg-border-primary transition-colors">
                    <ArrowLeft size={16} />
                </div>
                Back to Dashboard
            </button>

            <div className="mb-10">
                <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">Sales & Customers</h1>
                <p className="mt-2 text-lg text-text-secondary font-light">
                    Track your revenue and manage your growing customer base.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8">
                    {error}
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-background-secondary rounded-2xl p-6 border border-border-secondary shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-secondary">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-text-primary">
                            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(totalRevenue)}
                        </h3>
                    </div>
                </div>
                <div className="bg-background-secondary rounded-2xl p-6 border border-border-secondary shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-secondary">Total Sales</p>
                        <h3 className="text-2xl font-bold text-text-primary">{sales.length}</h3>
                    </div>
                </div>
                <div className="bg-background-secondary rounded-2xl p-6 border border-border-secondary shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-secondary">Unique Customers</p>
                        <h3 className="text-2xl font-bold text-text-primary">{uniqueCustomers}</h3>
                    </div>
                </div>
            </div>

            {/* Sales Table */}
            {sales.length === 0 ? (
                <div className="bg-background-secondary rounded-3xl border border-border-primary p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-background-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <DollarSign size={32} className="text-text-tertiary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-text-primary mb-3">No sales yet</h3>
                    <p className="text-text-secondary max-w-md mx-auto mb-8">
                        When users purchase your software, their details and your revenue will appear here.
                    </p>
                    <Link 
                        to="/developer/listings" 
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-accent-primary hover:bg-accent-hover transition-all"
                    >
                        Manage Listings
                    </Link>
                </div>
            ) : (
                <div className="bg-background-secondary rounded-2xl border border-border-secondary overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-secondary bg-background-primary text-sm font-bold text-text-secondary">
                                    <th className="px-6 py-4 font-bold">Date</th>
                                    <th className="px-6 py-4 font-bold">Listing</th>
                                    <th className="px-6 py-4 font-bold">Customer</th>
                                    <th className="px-6 py-4 font-bold">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-secondary">
                                {sales.map(sale => (
                                    <tr key={sale.id} className="hover:bg-background-primary transition-colors">
                                        <td className="px-6 py-4 text-sm text-text-secondary">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(sale.purchased_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {sale.listing.cover_image ? (
                                                    <img src={sale.listing.cover_image} alt={sale.listing.title} className="w-10 h-10 rounded-lg object-cover border border-border-primary" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-background-primary border border-border-primary flex items-center justify-center">
                                                        <Package size={16} className="text-text-tertiary" />
                                                    </div>
                                                )}
                                                <Link to={`/listings/${sale.listing.slug}`} className="text-sm font-bold text-text-primary hover:text-accent-primary transition-colors">
                                                    {sale.listing.title}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-bold text-xs uppercase">
                                                    {sale.buyer.username[0]}
                                                </div>
                                                <span className="text-sm font-medium text-text-primary">{sale.buyer.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-green-50 text-green-700 border border-green-200">
                                                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(sale.purchase_price)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeveloperSalesPage;
