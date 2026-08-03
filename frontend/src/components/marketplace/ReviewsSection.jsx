import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getListingReviews, createReview } from '../../services/reviewService';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { Star } from 'lucide-react';
import { Input } from '../ui/input';

export function ReviewsSection({ listingId, isOwned, averageRating, totalReviews }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    // Filters
    const [filterRating, setFilterRating] = useState('');
    const [sort, setSort] = useState('-created_at');
    const { user } = useAuth();
    const { addToast } = useToast();

    useEffect(() => {
        loadReviews();
    }, [listingId, filterRating, sort]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filterRating) params.rating = filterRating;
            if (sort) params.sort = sort;
            
            const data = await getListingReviews(listingId, params);
            setReviews(data.results || data);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            addToast('error', 'Rating Required', 'Please select a star rating.');
            return;
        }

        try {
            setSubmitting(true);
            await createReview({
                listing: listingId,
                rating,
                title,
                body
            });
            addToast('success', 'Review Submitted', 'Thank you for your review!');
            setIsModalOpen(false);
            loadReviews(); // reload to show the new review
            // Ideally reset form
            setRating(0);
            setTitle('');
            setBody('');
        } catch (error) {
            addToast('error', 'Submission Failed', error.response?.data?.non_field_errors?.[0] || 'An error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    const hasReviewed = reviews.some(r => r.user === user?.id);

    return (
        <div className="mt-12 bg-surface-primary border border-border-primary rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
                        <Star className="text-amber-500 fill-amber-500" />
                        Reviews
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-text-primary">{averageRating ? Number(averageRating).toFixed(1) : '0.0'}</span>
                        <div className="flex flex-col">
                            <StarRating rating={averageRating ? Math.round(averageRating) : 0} readOnly size={16} />
                            <span className="text-sm text-text-secondary">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</span>
                        </div>
                    </div>
                </div>

                {isOwned && !hasReviewed && (
                    <Button onClick={() => setIsModalOpen(true)}>
                        Write a Review
                    </Button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 pt-4 border-t border-border-primary">
                <select 
                    value={filterRating} 
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
                
                <select 
                    value={sort} 
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                >
                    <option value="-created_at">Most Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                </select>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-32 bg-background-secondary rounded-xl"></div>
                    ))}
                </div>
            ) : reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b border-border-primary border-dashed last:border-0 pb-6 last:pb-0">
                            <div className="flex items-start gap-4">
                                {review.user_avatar ? (
                                    <img src={review.user_avatar} alt={review.user_username} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold">
                                        {review.user_username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <span className="font-bold text-text-primary mr-2">{review.user_username}</span>
                                            <span className="text-xs text-text-tertiary">{new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <StarRating rating={review.rating} readOnly size={14} />
                                    </div>
                                    <h4 className="font-bold text-text-primary text-sm mb-1">{review.title}</h4>
                                    <p className="text-sm text-text-secondary whitespace-pre-wrap">{review.body}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-text-tertiary">
                    No reviews yet. Be the first to review!
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Write a Review">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Rating</label>
                        <StarRating rating={rating} onChange={setRating} size={32} />
                    </div>
                    <Input
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summarize your experience"
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Review</label>
                        <textarea
                            className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all min-h-[120px]"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="What did you like or dislike?"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
