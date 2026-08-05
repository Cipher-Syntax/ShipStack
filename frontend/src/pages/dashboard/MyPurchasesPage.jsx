import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { commerceService } from '../../services/commerceService';
import { ArrowLeft, Download, Star, PackageOpen, ExternalLink, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MyPurchasesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            const data = await commerceService.getMyPurchases();
            setPurchases(data);
        } catch (err) {
            console.error('Failed to fetch purchases', err);
            setError('Failed to load your purchases.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (listingId) => {
        setDownloadingId(listingId);
        try {
            const data = await commerceService.generateDownloadToken(listingId);
            if (data.token) {
                // Instead of using an anchor tag, we can manually trigger download
                window.location.href = `/api/commerce/download/${listingId}/?token=${data.token}`;
            }
        } catch (err) {
            console.error('Failed to start download', err);
            alert('Failed to initiate download. The file may no longer be available.');
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
            </div>
        );
    }

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
                <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">My Purchases</h1>
                <p className="mt-2 text-lg text-text-secondary font-light">
                    Manage and download the software you've acquired.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8">
                    {error}
                </div>
            )}

            {purchases.length === 0 ? (
                <div className="bg-background-secondary rounded-3xl border border-border-primary p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-background-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <PackageOpen size={32} className="text-text-tertiary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-text-primary mb-3">No purchases yet</h3>
                    <p className="text-text-secondary max-w-md mx-auto mb-8">
                        You haven't bought any software yet. Explore the marketplace to find the tools you need.
                    </p>
                    <Link 
                        to="/browse" 
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-accent-primary hover:bg-accent-hover active:scale-[0.98] transition-all shadow-lg shadow-accent-primary/20"
                    >
                        Browse Marketplace
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchases.map(purchase => (
                        <div key={purchase.id} className="bg-background-secondary border border-border-secondary rounded-2xl overflow-hidden hover:border-border-primary transition-all group flex flex-col shadow-sm hover:shadow-md">
                            {/* Image Header */}
                            <div className="aspect-video w-full bg-border-secondary relative overflow-hidden">
                                {purchase.listing.cover_image ? (
                                    <img 
                                        src={purchase.listing.cover_image} 
                                        alt={purchase.listing.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-background-primary text-text-tertiary">
                                        <PackageOpen size={48} />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                    ${(purchase.purchase_price / 100).toFixed(2)}
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <Link to={`/listings/${purchase.listing.slug}`} className="block group-hover:text-accent-primary transition-colors">
                                    <h3 className="text-xl font-bold text-text-primary line-clamp-1 mb-2">
                                        {purchase.listing.title}
                                    </h3>
                                </Link>
                                <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">
                                    {purchase.listing.short_description}
                                </p>
                                
                                <div className="flex items-center gap-2 text-xs text-text-tertiary mb-6">
                                    <Calendar size={14} />
                                    <span>Purchased on {new Date(purchase.purchased_at).toLocaleDateString()}</span>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-border-primary">
                                    <button
                                        onClick={() => handleDownload(purchase.listing.id)}
                                        disabled={downloadingId === purchase.listing.id}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-accent-primary text-white hover:bg-accent-hover transition-colors disabled:opacity-70"
                                    >
                                        {downloadingId === purchase.listing.id ? (
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                        ) : (
                                            <Download size={16} />
                                        )}
                                        Download
                                    </button>
                                    <Link
                                        to={`/listings/${purchase.listing.slug}#reviews`}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-background-primary border border-border-secondary text-text-primary hover:border-accent-primary hover:text-accent-primary transition-colors"
                                    >
                                        <Star size={16} />
                                        Review
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPurchasesPage;
