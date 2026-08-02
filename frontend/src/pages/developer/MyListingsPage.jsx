import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyListings, createDraft, deleteListing } from '../../services/listingService';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../contexts/ToastContext';
import { Plus, Edit2, Code, FileText, Package, Clock, ExternalLink, ArrowRight, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';

export default function MyListingsPage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const data = await getMyListings();
            setListings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        setCreating(true);
        try {
            const draft = await createDraft();
            addToast("Draft created successfully!", "success");
            navigate(`/developer/listings/${draft.id}/basics`);
        } catch (error) {
            console.error("Failed to create draft", error);
            addToast("Failed to create draft.", "error");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteListing(deletingId);
            setListings(listings.filter(l => l.id !== deletingId));
            addToast("Listing deleted permanently.", "success");
        } catch (error) {
            console.error("Failed to delete", error);
            addToast("Failed to delete listing.", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'DRAFT': return 'bg-yellow-500 text-white border-yellow-600';
            case 'PENDING_REVIEW': return 'bg-blue-600 text-white border-blue-700';
            case 'PUBLISHED': return 'bg-green-600 text-white border-green-700';
            case 'REJECTED': return 'bg-red-600 text-white border-red-700';
            default: return 'bg-gray-600 text-white border-gray-700';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-8 px-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 -ml-4 flex items-center gap-2 text-text-secondary">
                <ArrowLeft size={16} /> Back to Dashboard
            </Button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-secondary border border-border-primary text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                        <Code size={14} className="text-accent-primary" />
                        Software Studio
                    </div>
                    <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">My Listings</h1>
                    <p className="text-text-secondary text-lg max-w-2xl">Manage your software products, update details, and submit new tools to the ShipStack marketplace.</p>
                </div>
                <Button onClick={handleCreate} disabled={creating} className="shrink-0 h-12 px-6 shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 transition-shadow">
                    {creating ? <span className="flex items-center gap-2"><Clock size={18} className="animate-spin" /> Creating...</span> : <span className="flex items-center gap-2"><Plus size={18} /> Create New Listing</span>}
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <div key={i} className="animate-pulse bg-background-secondary h-48 rounded-2xl border border-border-primary"></div>
                    ))}
                </div>
            ) : listings.length === 0 ? (
                <div className="relative overflow-hidden text-center py-24 bg-background-secondary rounded-2xl border border-border-primary border-dashed shadow-sm flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
                    <div className="w-20 h-20 bg-surface-secondary rounded-full flex items-center justify-center mb-6 border border-border-primary shadow-inner">
                        <Package size={32} className="text-text-tertiary" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-3">No listings yet</h3>
                    <p className="text-text-secondary max-w-md mx-auto mb-8">You haven't created any software listings. Start building your storefront by creating your first product.</p>
                    <Button onClick={handleCreate} variant="primary" disabled={creating} className="h-12 px-8">
                        {creating ? 'Initializing Editor...' : 'Create your first listing'}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map(l => {
                        const coverImage = l.media?.find(m => m.media_type === 'COVER');
                        const formattedPrice = l.price ? Number(l.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
                        
                        return (
                            <div key={l.id} className="group relative bg-background-secondary border border-border-primary rounded-2xl flex flex-col hover:border-accent-primary/50 transition-all shadow-sm hover:shadow-md overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
                                
                                {/* Full-width Cover Photo */}
                                <div className="w-full h-48 bg-surface-secondary relative overflow-hidden border-b border-border-primary shrink-0">
                                    {coverImage ? (
                                        <img src={coverImage.file} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-background-primary/50">
                                            <FileText size={32} className="text-text-tertiary group-hover:text-accent-primary transition-colors" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-black border shadow-lg ${getStatusColor(l.status)}`}>
                                            {l.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1 relative z-10">
                                    <div className="space-y-1 mb-6 flex-1">
                                        <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-1">{l.title || 'Untitled Listing'}</h3>
                                        <p className="text-sm text-text-secondary line-clamp-2 min-h-[40px]">{l.short_description || 'No description provided yet.'}</p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-primary border-dashed">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-text-primary">₱{formattedPrice}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button 
                                                variant="danger" 
                                                className="h-9 px-3 shadow-sm hover:bg-red-600 border border-red-500/50 text-white"
                                                onClick={() => setDeletingId(l.id)}
                                                title="Delete Listing"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                            <Button 
                                                variant="secondary" 
                                                className="h-9 px-4 font-semibold text-sm shadow-sm hover:bg-surface-hover hover:border-accent-primary/30"
                                                onClick={() => navigate(`/developer/listings/${l.id}/basics`)}
                                            >
                                                {l.status === 'DRAFT' ? (
                                                    <span className="flex items-center gap-2"><Edit2 size={14} /> Edit</span>
                                                ) : (
                                                    <span className="flex items-center gap-2">Manage <ArrowRight size={14} /></span>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal 
                isOpen={!!deletingId} 
                onClose={() => setDeletingId(null)}
            >
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                        <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-1">Delete Listing</h3>
                        <p className="text-sm text-text-secondary">Are you sure you want to delete this listing? This action cannot be undone and will permanently remove all associated data and files.</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
                    <Button variant="ghost" onClick={() => setDeletingId(null)}>Cancel</Button>
                    <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
                        Yes, delete it
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
