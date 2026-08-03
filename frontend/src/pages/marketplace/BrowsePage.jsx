import React, { useState, useEffect, useCallback } from 'react';
import { getPublicListings, getCategories, getTechnologies } from '../../services/listingService';
import MarketplaceCard from '../../components/marketplace/MarketplaceCard';
import { Pagination } from '../../components/ui/pagination';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Drawer } from '../../components/ui/drawer';

const BrowsePage = () => {
    const [listings, setListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    
    // UI States
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filters
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [ordering, setOrdering] = useState("-created_at");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveSearch(searchInput);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);
    
    // Initial data fetch
    useEffect(() => {
        fetchCategories();
        fetchTechnologies();
    }, []);
    
    // Listings fetch when filters or page changes
    useEffect(() => {
        fetchListings();
    }, [currentPage, activeSearch, selectedCategory, selectedTechs, minPrice, maxPrice, ordering]);
    
    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchTechnologies = async () => {
        try {
            const data = await getTechnologies();
            setTechnologies(data);
        } catch (error) {
            console.error("Failed to fetch technologies", error);
        }
    };
    
    const fetchListings = async () => {
        setLoading(true);
        try {
            const filters = {
                search: activeSearch,
                category: selectedCategory,
                technologies: selectedTechs.join(','),
                min_price: minPrice,
                max_price: maxPrice,
                ordering: ordering,
            };
            const data = await getPublicListings(currentPage, filters);
            setListings(data.results || data);
            
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

    const toggleTech = (slug) => {
        setSelectedTechs(prev => {
            if (prev.includes(slug)) return prev.filter(t => t !== slug);
            return [...prev, slug];
        });
        setCurrentPage(1);
    };

    const handleCategoryClick = (slug) => {
        setSelectedCategory(slug === selectedCategory ? "" : slug);
        setCurrentPage(1);
    };

    const activeFiltersCount = (selectedCategory ? 1 : 0) + selectedTechs.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

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
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-border-primary rounded-lg leading-5 bg-surface-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-focus-ring sm:text-sm transition-colors"
                                placeholder="Search by name or description..."
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <select 
                                value={ordering}
                                onChange={(e) => { setOrdering(e.target.value); setCurrentPage(1); }}
                                className="block w-40 pl-3 pr-8 py-3 border border-border-primary rounded-lg text-sm bg-surface-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
                            >
                                <option value="-created_at">Newest</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                            </select>

                            <button 
                                onClick={() => setIsDrawerOpen(true)}
                                className="inline-flex items-center justify-center px-4 py-2 border border-border-primary rounded-lg shadow-sm text-sm font-medium text-text-primary bg-surface-primary hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus-ring transition-colors relative"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-accent-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Quick Category Filters */}
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <button 
                            onClick={() => handleCategoryClick("")}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? 'bg-accent-primary text-white' : 'bg-surface-primary border border-border-primary text-text-secondary hover:bg-surface-hover'}`}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button 
                                key={category.id} 
                                onClick={() => handleCategoryClick(category.slug)}
                                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.slug ? 'bg-accent-primary text-white' : 'bg-surface-primary border border-border-primary text-text-secondary hover:bg-surface-hover'}`}
                            >
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
                        {activeFiltersCount > 0 && (
                            <button 
                                onClick={() => {
                                    setSearchInput("");
                                    setActiveSearch("");
                                    setSelectedCategory("");
                                    setSelectedTechs([]);
                                    setMinPrice("");
                                    setMaxPrice("");
                                }}
                                className="mt-4 text-accent-primary hover:underline text-sm font-medium"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Advanced Filters Drawer */}
            <Drawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                title="Filters"
            >
                <div className="space-y-8">
                    {/* Price Filter */}
                    <div>
                        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Price Range</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">₱</div>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={minPrice}
                                    onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                                    placeholder="Min" 
                                    className="block w-full pl-8 pr-3 py-2 border border-border-primary rounded-md text-sm bg-surface-primary text-text-primary focus:ring-accent-primary focus:border-accent-primary"
                                />
                            </div>
                            <span className="text-text-secondary">-</span>
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">₱</div>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={maxPrice}
                                    onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                                    placeholder="Max" 
                                    className="block w-full pl-8 pr-3 py-2 border border-border-primary rounded-md text-sm bg-surface-primary text-text-primary focus:ring-accent-primary focus:border-accent-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Technologies Filter */}
                    <div>
                        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Technologies</h3>
                        <div className="space-y-2">
                            {technologies.map(tech => (
                                <label key={tech.id} className="flex items-center group cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        checked={selectedTechs.includes(tech.slug)}
                                        onChange={() => toggleTech(tech.slug)}
                                        className="h-4 w-4 rounded border-border-primary text-accent-primary focus:ring-accent-primary/20 bg-background-primary cursor-pointer transition-colors"
                                    />
                                    <span className="ml-3 text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                        {tech.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border-primary">
                    <button 
                        onClick={() => {
                            setSelectedTechs([]);
                            setMinPrice("");
                            setMaxPrice("");
                            setCurrentPage(1);
                        }}
                        className="w-full py-2 px-4 border border-border-primary rounded-lg text-sm font-medium text-text-secondary hover:bg-background-secondary transition-colors"
                    >
                        Reset Filters
                    </button>
                    <button 
                        onClick={() => setIsDrawerOpen(false)}
                        className="w-full mt-3 py-2 px-4 bg-accent-primary rounded-lg text-sm font-medium text-white hover:bg-accent-hover transition-colors shadow-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </Drawer>
        </div>
    );
};

export default BrowsePage;
