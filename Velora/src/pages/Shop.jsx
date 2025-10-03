import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid2x2 as Grid, List, SlidersHorizontal } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid');
    const [priceRange, setPriceRange] = useState([0, 1000]);

    // Update URL when category changes
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                     product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            
            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'featured':
            default:
                filtered.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return 0;
                });
        }

        return filtered;
    }, [searchTerm, selectedCategory, sortBy, priceRange]);

    return (
        <div className="shop-container">
            <div className="shop-content">
                {/* Header */}
                <div className="shop-header">
                    <h1 className="shop-title">Shop Collection</h1>
                    <p className="shop-description">
                        Discover our complete range of luxury fashion • {filteredAndSortedProducts.length} products
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="shop-filters">
                    <div className="shop-filters-header">
                        <div className="shop-filters-title">
                            <SlidersHorizontal size={20} />
                            <span>Filters & Search</span>
                        </div>
                    </div>
                    
                    <div className="shop-filters-row">
                        {/* Search */}
                        <div className="shop-search">
                            <Search className="shop-search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="shop-search-input"
                            />
                        </div>

                        <div className="shop-controls">
                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="shop-select"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="shop-select"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name</option>
                            </select>

                            {/* View Mode */}
                            <div className="shop-view-toggle">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`shop-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`shop-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="shop-price-filter">
                        <label className="shop-price-label">
                            Price Range: ${priceRange[0]} - ${priceRange[1]} 
                        </label>
                        <div className="shop-price-inputs">
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                className="shop-price-range"
                            />
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="shop-price-range"
                            />
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="shop-results">
                    <p className="shop-results-text">
                        Showing {filteredAndSortedProducts.length} of {products.length} products
                    </p>
                </div>

                {filteredAndSortedProducts.length > 0 ? (
                    <div 
                        className={`shop-products ${
                            viewMode === 'grid' 
                                ? 'shop-products-grid'
                                : 'shop-products-list'
                        }`}
                    >
                        {filteredAndSortedProducts.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product}
                                className={viewMode === 'list' ? 'flex' : ''}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="shop-no-results">
                        <h3 className="shop-no-results-title">No products found</h3>
                        <p className="shop-no-results-subtitle">Try adjusting your search criteria</p>
                        <Button 
                            onClick={() => {
                                setSearchTerm('');
                                handleCategoryChange('All');
                                setPriceRange([0, 1000]);
                            }}
                            variant="outline"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;