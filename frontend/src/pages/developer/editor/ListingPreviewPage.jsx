import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing, submitListing } from '../../../services/listingService';
import { useToast } from '../../../contexts/ToastContext';
import { Button } from '../../../components/ui/Button';
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Package } from 'lucide-react';

export default function ListingPreviewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState(null);
    const { addToast } = useToast();
    const carouselRef = React.useRef(null);

    useEffect(() => {
        getListing(id).then(setData);
    }, [id]);

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 400;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrors(null);
        try {
            await submitListing(id);
            addToast("Success! Listing submitted for review.", "success");
            navigate('/developer/listings');
        } catch (error) {
            console.error(error);
            if (error.response?.data) {
                setErrors(error.response.data);
                addToast("Validation failed. Check the errors above.", "error");
            } else {
                addToast("An unexpected error occurred during submission.", "error");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!data) return <div className="p-8 text-text-secondary animate-pulse">Loading preview...</div>;

    const coverImage = data.media?.find(m => m.media_type === 'COVER');
    const screenshots = data.media?.filter(m => m.media_type === 'SCREENSHOT') || [];
    const formattedPrice = data.price ? Number(data.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">4. Preview & Publish</h1>
                <p className="text-text-secondary text-lg mt-2">Review your details before submitting for moderation.</p>
            </div>
            
            {errors && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <AlertCircle className="text-red-600" size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-red-900 mb-1">Validation Errors Prevent Submission</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-red-700">
                            {Object.entries(errors).map(([key, msg]) => (
                                <li key={key}><span className="capitalize font-semibold">{key}</span>: {msg}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Simulated Storefront Card */}
            <div className="bg-background-secondary border border-border-primary rounded-2xl shadow-xl overflow-hidden">
                <div className="h-96 bg-gradient-to-r from-accent-primary/20 to-blue-500/20 border-b border-border-primary relative flex items-center justify-center overflow-hidden">
                    {coverImage ? (
                        <img src={coverImage.file} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-text-tertiary font-bold tracking-widest uppercase">No Cover Image</span>
                    )}
                </div>
                <div className="p-8">
                    <div className="flex justify-between items-start gap-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-display font-bold text-text-primary">{data.title || 'Untitled'}</h2>
                            <p className="text-lg text-text-secondary mt-2 max-w-2xl">{data.short_description || 'No short description provided.'}</p>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                            <div className="px-5 py-2 bg-background-primary border border-border-primary rounded-xl text-text-primary font-bold text-2xl shadow-sm">
                                ₱{formattedPrice}
                            </div>
                        </div>
                    </div>
                    
                    <div className="prose prose-neutral max-w-none prose-p:text-text-secondary prose-headings:text-text-primary border-t border-border-primary pt-6 mt-6">
                        {data.full_description ? (
                            <div className="whitespace-pre-wrap font-mono text-sm">{data.full_description}</div>
                        ) : (
                            <p className="italic text-text-tertiary">No full description provided.</p>
                        )}
                    </div>
                    
                    {screenshots.length > 0 && (
                        <div className="mt-8 border-t border-border-primary pt-6">
                            <h3 className="text-xl font-bold text-text-primary mb-4">Screenshots</h3>
                            <div className="relative group">
                                <button 
                                    onClick={() => scrollCarousel('left')}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background-primary/80 backdrop-blur border border-border-primary text-text-primary flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-background-primary"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                
                                <div 
                                    ref={carouselRef}
                                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {screenshots.map(s => (
                                        <div key={s.id} className="snap-center shrink-0 rounded-xl overflow-hidden border border-border-primary h-64 w-[400px]">
                                            <img src={s.file} alt="Screenshot" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => scrollCarousel('right')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background-primary/80 backdrop-blur border border-border-primary text-text-primary flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-background-primary"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                            <style dangerouslySetInnerHTML={{__html: `
                                .hide-scrollbar::-webkit-scrollbar { display: none; }
                            `}} />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => navigate(`/developer/listings/${id}/media`)}>
                    &larr; Back
                </Button>
                {data.status === 'DRAFT' ? (
                    <Button onClick={handleSubmit} disabled={submitting} className="px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20">
                        {submitting ? 'Submitting...' : <span className="flex items-center gap-2"><CheckCircle2 size={18} /> Submit for Review</span>}
                    </Button>
                ) : (
                    <Button onClick={() => navigate(`/developer/listings/${id}/releases`)} className="px-8 bg-accent-primary hover:bg-accent-hover text-white shadow-lg shadow-accent-primary/20">
                        <span className="flex items-center gap-2"><Package size={18} /> Manage Releases</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
