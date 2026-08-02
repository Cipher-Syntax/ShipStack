import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicListings, getCategories } from '../../services/listingService';
import MarketplaceCard from '../../components/marketplace/MarketplaceCard';
import { ShieldCheck, Code2, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';

const HomePage = () => {
    const [recentListings, setRecentListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [listingsData, categoriesData] = await Promise.all([
                    getPublicListings(1), // fetch first page of listings
                    getCategories()
                ]);
                
                // DRF paginated response returns .results array
                const items = listingsData.results || listingsData;
                setRecentListings(items.slice(0, 4)); // Only show top 4 recent
                setCategories(categoriesData.slice(0, 8)); // Top 8 categories
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchInitialData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background-primary font-sans">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-background-secondary pt-24 pb-32">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
                        </span>
                        ShipStack v1.0 is Live
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-text-primary tracking-tight mb-8 leading-tight">
                        Production-Ready Software <br className="hidden md:block"/> 
                        from <span className="text-accent-primary">Verified Developers</span>
                    </h1>
                    
                    <p className="mt-4 text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-10 font-light">
                        Discover, purchase, and own complete software solutions. Skip months of development and launch faster with curated, high-quality codebases.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/browse">
                            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 shadow-md hover:shadow-lg transition-all">
                                Browse Marketplace
                            </Button>
                        </Link>
                        <Link to="/developer/apply">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-surface-primary">
                                Become a Seller
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust & Value Proposition */}
            <section className="border-y border-border-primary bg-surface-primary py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-border-primary">
                        <div className="flex flex-col items-center md:items-start p-4 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-success flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">Verified Developers</h3>
                            <p className="text-text-secondary text-sm">Every seller undergoes a strict identity and quality review before joining.</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start p-4 space-y-3 md:pl-8">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-accent-primary flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">Malware Scanned</h3>
                            <p className="text-text-secondary text-sm">All software packages are automatically scanned for malicious code.</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start p-4 space-y-3 md:pl-8">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">Full Ownership</h3>
                            <p className="text-text-secondary text-sm">Download the complete source code and retain ownership of your licensed copy.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-20 bg-background-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-display font-bold text-text-primary">Explore Categories</h2>
                            <p className="text-text-secondary mt-2">Find the exact tools for your stack.</p>
                        </div>
                        <Link to="/browse" className="hidden sm:flex items-center text-accent-primary font-medium hover:text-accent-hover transition-colors">
                            View all <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map(category => (
                            <Link key={category.id} to={`/browse?category=${category.slug}`} className="group">
                                <div className="p-6 rounded-xl border border-border-primary bg-surface-primary hover:border-accent-primary hover:shadow-md transition-all flex flex-col items-center text-center space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-background-secondary text-text-secondary group-hover:text-accent-primary group-hover:bg-accent-primary/10 flex items-center justify-center transition-colors">
                                        <Zap className="w-5 h-5" /> {/* Fallback icon, ideally use category.icon */}
                                    </div>
                                    <span className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">{category.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending / Recent Software */}
            <section className="py-20 bg-background-secondary border-t border-border-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-display font-bold text-text-primary">Recently Added</h2>
                            <p className="text-text-secondary mt-2">Fresh, production-ready solutions published by the community.</p>
                        </div>
                        <Link to="/browse" className="hidden sm:flex items-center text-accent-primary font-medium hover:text-accent-hover transition-colors">
                            Browse marketplace <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse bg-surface-primary border border-border-primary rounded-lg h-[340px]"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recentListings.map(listing => (
                                <MarketplaceCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}
                    
                    <div className="mt-10 sm:hidden flex justify-center">
                        <Link to="/browse">
                            <Button variant="outline" className="w-full">
                                Browse all software
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
