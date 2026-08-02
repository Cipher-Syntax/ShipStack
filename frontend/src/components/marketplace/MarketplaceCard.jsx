import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';

const MarketplaceCard = ({ listing }) => {
    return (
        <Link to={`/listings/${listing.slug}`} className="block h-full group">
            <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md hover:border-border-secondary bg-surface-primary dark:bg-surface-primary border-border-primary">
                <div className="relative aspect-video overflow-hidden bg-background-secondary">
                    {listing.cover_image_url ? (
                        <img 
                            src={listing.cover_image_url} 
                            alt={listing.title} 
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                            No Image
                        </div>
                    )}
                </div>
                
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                        {listing.category && (
                            <Badge variant="secondary" className="font-medium">
                                {listing.category.name}
                            </Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>New</span>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-text-primary text-lg leading-tight line-clamp-1 group-hover:text-accent-primary transition-colors">
                            {listing.title}
                        </h3>
                        <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                            {listing.short_description}
                        </p>
                    </div>
                    
                    <div className="pt-2 flex items-center justify-between border-t border-border-primary mt-auto">
                        <div className="flex items-center gap-2">
                            {listing.authors && listing.authors.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    {listing.authors[0].logo ? (
                                        <img 
                                            src={listing.authors[0].logo} 
                                            alt={listing.authors[0].store_name || listing.authors[0].username} 
                                            className="w-5 h-5 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-[10px] font-bold">
                                            {(listing.authors[0].store_name || listing.authors[0].username).charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="truncate max-w-[120px]">
                                        {listing.authors[0].store_name || listing.authors[0].username}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="font-bold text-text-primary">
                            ${listing.price}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default MarketplaceCard;
