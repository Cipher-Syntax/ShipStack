import React, { useState, useEffect } from 'react';
import { getPublicListings, getCategories } from '../../services/listingService';
import MarketplaceCard from '../../components/marketplace/MarketplaceCard';
import { Pagination } from '../../components/ui/pagination';
import { Search, Filter } from 'lucide-react';

const BrowsePage = () => {
    const [listings, setListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        fetchCategories();
        fetchListings(currentPage);
    }, [currentPage]);
    
    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };
    
    const fetchListings = async (page) => {
        setLoading(true);
        try {
            const data = await getPublicListings(page);
            setListings(data.results || data);
            
            // Assuming DRF paginated response shape
            if (data.count !== undefined) {
                setTotalPages(Math.ceil(data.count / 12));
            } else {
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Failed to fetch listings", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background-primary flex flex-col">
            {/* Header / Search Bar area */}
            <div className="bg-background-secondary border-b border-border-primary py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-display font-bold text-text-primary mb-6">Browse Software</h1>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-text-tertiary" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-border-primary rounded-lg leading-5 bg-surface-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-focus-ring sm:text-sm transition-colors"
                                placeholder="Search by name, category, or technology..."
                            />
                        </div>
                        <button className="inline-flex items-center justify-center px-4 py-2 border border-border-primary rounded-lg shadow-sm text-sm font-medium text-text-primary bg-surface-primary hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus-ring transition-colors">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </button>
                    </div>
                    
                    {/* Quick Category Filters */}
                    <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-accent-primary text-white text-sm font-medium">
                            All
                        </button>
                        {categories.slice(0, 6).map(category => (
                            <button key={category.id} className="whitespace-nowrap px-4 py-1.5 rounded-full bg-surface-primary border border-border-primary text-text-secondary hover:bg-surface-hover text-sm font-medium transition-colors">
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="animate-pulse bg-surface-primary border border-border-primary rounded-lg overflow-hidden h-[340px]">
                                <div className="bg-background-secondary h-[180px] w-full"></div>
                                <div className="p-4 space-y-4">
                                    <div className="h-4 bg-background-secondary rounded w-1/4"></div>
                                    <div className="h-6 bg-background-secondary rounded w-3/4"></div>
                                    <div className="h-4 bg-background-secondary rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : listings.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                            {listings.map(listing => (
                                <MarketplaceCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                        
                        {totalPages > 1 && (
                            <div className="border-t border-border-primary pt-8 pb-12">
                                <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="mx-auto w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-text-tertiary" />
                        </div>
                        <h3 className="text-lg font-medium text-text-primary">No software found</h3>
                        <p className="mt-1 text-text-secondary">We couldn't find any listings matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowsePage;
