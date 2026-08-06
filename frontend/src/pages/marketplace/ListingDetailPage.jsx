import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicListing } from '../../services/listingService';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, Package, ShieldCheck, Tag as TagIcon, Star, Code, MessageSquare } from 'lucide-react';

import { ReviewsSection } from '../../components/marketplace/ReviewsSection';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { commerceService } from '../../services/commerceService';
import { useMessaging } from '../../hooks/useMessaging';
import { useNavigate } from 'react-router-dom';

const ListingDetailPage = () => {
    const { slug } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const { user } = useAuth();
    const { addToast } = useToast();
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const { startConversation } = useMessaging();
    const navigate = useNavigate();
    const [isMessagingLoading, setIsMessagingLoading] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const data = await getPublicListing(slug);
                setListing(data);
                
                // Set initial active image (cover image if exists, else first screenshot)
                const cover = data.media?.find(m => m.media_type === 'COVER');
                if (cover) {
                    setActiveImage(cover.file);
                } else if (data.media?.length > 0) {
                    setActiveImage(data.media[0].file);
                }
            } catch (err) {
                setError(err.response?.status === 404 ? 'Not Found' : 'Error loading listing');
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-primary">
                <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-primary px-4">
                <Package size={64} className="text-text-tertiary mb-4" />
                <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Software Not Found</h1>
                <p className="text-text-secondary mb-8 text-center max-w-md">
                    The listing you're looking for doesn't exist or is no longer available.
                </p>
                <Link to="/">
                    <Button variant="primary">Return to Marketplace</Button>
                </Link>
            </div>
        );
    }

    const handleCheckout = async () => {
        if (!user) {
            // Unauthenticated: we could redirect to login and pass redirect param, for now just simple redirect
            window.location.href = `/login?redirect=/listings/${slug}`;
            return;
        }
        
        setIsCheckoutLoading(true);
        try {
            const data = await commerceService.createCheckoutSession(listing.id);
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            }
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.error || "Failed to initiate checkout. Please try again.", "error");
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            // First we get a short-lived download token from the authenticated API
            // This ensures we always get a fresh auto-refreshed token via Axios!
            const { token } = await commerceService.generateDownloadToken(listing.id);
            // Then we use native browser navigation with the UUID token!
            window.location.href = `http://localhost:8000/api/commerce/download/${listing.id}/?token=${token}`;
        } catch (err) {
            console.error(err);
            addToast(err.response?.data?.error || "Failed to initiate download. Please login again.", "error");
        }
    };

    const handleMessageDeveloper = async () => {
        if (!user) {
            window.location.href = `/login?redirect=/listings/${slug}`;
            return;
        }
        
        setIsMessagingLoading(true);
        try {
            const conversation = await startConversation(author.username);
            navigate(`/messages?conversation=${conversation.id}`);
        } catch (err) {
            console.error(err);
            addToast("Failed to initiate conversation.", "error");
        } finally {
            setIsMessagingLoading(false);
        }
    };

    const author = listing.authors?.[0];
    const authorName = author?.store_name || author?.username || 'Unknown Developer';
    const authorSlug = author?.store_slug || author?.username;
    
    const formattedPrice = new Intl.NumberFormat('en-PH', { 
        style: 'currency', 
        currency: 'PHP' 
    }).format(listing.price);

    // Group media
    const displayMedia = listing.media?.filter(m => m.media_type === 'COVER' || m.media_type === 'SCREENSHOT') || [];

    return (
        <div className="min-h-screen bg-background-primary pb-24">
            {/* Breadcrumbs */}
            <div className="border-b border-border-primary bg-surface-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center text-sm">
                    <Link to="/" className="text-text-secondary hover:text-accent-primary transition-colors">Marketplace</Link>
                    <ChevronRight size={14} className="mx-2 text-text-tertiary" />
                    <span className="text-text-secondary">{listing.category?.name || 'Uncategorized'}</span>
                    <ChevronRight size={14} className="mx-2 text-text-tertiary" />
                    <span className="text-text-primary font-medium truncate max-w-[200px] sm:max-w-md">{listing.title}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-primary mb-4 leading-tight">
                        {listing.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary">
                        <Link to={`/store/${authorSlug}`} className="flex items-center gap-2 hover:text-accent-primary transition-colors group">
                            {author?.logo ? (
                                <img src={author.logo} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold">
                                    {authorName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="font-medium">{authorName}</span>
                        </Link>
                        
                        <div className="flex items-center gap-1.5 text-amber-500">
                            <Star className="fill-current w-4 h-4" />
                            <Star className="fill-current w-4 h-4" />
                            <Star className="fill-current w-4 h-4" />
                            <Star className="fill-current w-4 h-4" />
                            <Star className="fill-current w-4 h-4" />
                            <span className="text-text-primary ml-1">(New)</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Left Column: Media & Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Media Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full bg-background-secondary rounded-2xl overflow-hidden border border-border-primary flex items-center justify-center">
                                {activeImage ? (
                                    <img src={activeImage} alt={listing.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Package size={64} className="text-text-tertiary" />
                                )}
                            </div>
                            
                            {displayMedia.length > 1 && (
                                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                    {displayMedia.map(media => (
                                        <button 
                                            key={media.id}
                                            onClick={() => setActiveImage(media.file)}
                                            className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === media.file ? 'border-accent-primary ring-2 ring-accent-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={media.file} alt="thumbnail" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">Overview</h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-xl prose-a:text-accent-primary hover:prose-a:text-accent-hover">
                                <ReactMarkdown>
                                    {listing.full_description || "No description provided."}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-[140px] space-y-6">
                            {/* Purchase / Download Card */}
                            <div className="bg-surface-primary border border-border-primary rounded-2xl p-6 shadow-sm">
                                {listing.is_owned ? (
                                    <>
                                        <div className="mb-6">
                                            <div className="text-sm text-text-secondary mb-1">Standard License</div>
                                            <div className="text-2xl font-display font-bold text-success flex items-center gap-2">
                                                <ShieldCheck className="w-6 h-6" /> Owned
                                            </div>
                                        </div>
                                        <Button 
                                            variant="primary" 
                                            className="w-full h-12 text-base font-bold shadow-sm mb-4"
                                            onClick={handleDownload}
                                        >
                                            Download Source Code
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <div className="text-sm text-text-secondary mb-1">Standard License</div>
                                            <div className="text-4xl font-display font-bold text-text-primary">
                                                {formattedPrice}
                                            </div>
                                        </div>
                                        
                                        <Button 
                                            variant="primary" 
                                            className="w-full h-12 text-base font-bold shadow-sm mb-4"
                                            onClick={handleCheckout}
                                            disabled={isCheckoutLoading}
                                        >
                                            {isCheckoutLoading ? 'Processing...' : (user ? 'Buy Now' : 'Login to Purchase')}
                                        </Button>
                                    </>
                                )}
                                
                                <div className="space-y-3 text-sm text-text-secondary">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck size={18} className="text-green-500 shrink-0 mt-0.5" />
                                        <span>Verified and scanned for malware</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Package size={18} className="text-blue-500 shrink-0 mt-0.5" />
                                        <span>Instant digital delivery</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Developer */}
                            {user?.username !== author?.username && (
                                <div className="bg-surface-primary border border-border-primary rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                        <MessageSquare size={18} /> Have Questions?
                                    </h3>
                                    <p className="text-sm text-text-secondary mb-4">
                                        Contact the developer for pre-sales or support inquiries.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleMessageDeveloper}
                                        disabled={isMessagingLoading}
                                    >
                                        {isMessagingLoading ? 'Connecting...' : 'Message Developer'}
                                    </Button>
                                </div>
                            )}

                            {/* Tech Stack */}
                            {listing.technologies?.length > 0 && (
                                <div className="bg-surface-primary border border-border-primary rounded-2xl p-6">
                                    <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                        <Code size={18} /> Technologies
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {listing.technologies.map(tech => (
                                            <span key={tech.id} className="px-3 py-1 bg-background-secondary border border-border-secondary rounded-full text-sm text-text-secondary">
                                                {tech.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {listing.tags?.length > 0 && (
                                <div className="bg-surface-primary border border-border-primary rounded-2xl p-6">
                                    <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                        <TagIcon size={18} /> Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {listing.tags.map(tag => (
                                            <span key={tag.id} className="text-sm text-accent-primary hover:underline cursor-pointer">
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Version History */}
                            {listing.releases && listing.releases.length > 0 ? (
                                <div className="bg-surface-primary border border-border-primary rounded-2xl p-6">
                                    <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                        <Package size={18} /> Version History
                                    </h3>
                                    <div className="space-y-4">
                                        {listing.releases.slice(0, 3).map(release => (
                                            <div key={release.id} className="border-b border-border-primary border-dashed last:border-0 pb-4 last:pb-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-text-primary">
                                                        {release.version_number.toLowerCase().startsWith('v') ? release.version_number : `v${release.version_number}`}
                                                    </span>
                                                    <span className="text-xs text-text-tertiary">
                                                        {new Date(release.published_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-text-secondary line-clamp-2 prose prose-sm dark:prose-invert">
                                                    <ReactMarkdown>{release.changelog}</ReactMarkdown>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-background-secondary border border-border-primary border-dashed rounded-2xl p-6 text-center">
                                    <h3 className="font-bold text-text-primary mb-2">Version History</h3>
                                    <p className="text-sm text-text-secondary">
                                        No releases published yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Reviews Section */}
                <ReviewsSection 
                    listingId={listing.id} 
                    isOwned={listing.is_owned} 
                    averageRating={listing.average_rating}
                    totalReviews={listing.total_reviews}
                />
            </div>
        </div>
    );
};

export default ListingDetailPage;
