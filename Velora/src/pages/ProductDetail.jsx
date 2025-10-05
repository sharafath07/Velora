import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { Products } from '../data/product';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const product = Products.find(p => p.id === parseInt(id || '0'));

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                    <Button onClick={() => navigate('/shop')}>
                        Back to Shop
                    </Button>
                </div>
            </div>
        );
    }

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        if (!selectedColor) {
            alert('Please select a color');
            return;
        }
        
        addItem(product, selectedSize, selectedColor, quantity);
        alert(`${product.name} added to cart!`);
    };

    const productImages = [
        product.image,
        "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1488327/pexels-photo-1488327.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=800",
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                    <button
                        onClick={() => navigate('/shop')}
                        className="flex items-center hover:text-primary transition-colors duration-200"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Shop
                    </button>
                    <span>/</span>
                    <span>{product.category}</span>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div className="relative">
                            <img
                                src={productImages[activeImageIndex]}
                                alt={product.name}
                                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
                            />
                            {product.featured && (
                                <div className="absolute top-4 left-4">
                                    <span className="bg-primary text-white px-2 py-1 text-xs font-medium rounded">
                                        Featured
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-4 overflow-x-auto">
                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                                        activeImageIndex === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>
                            <p className="text-sm text-gray-600 mb-4">{product.category}</p>
                            <div className="flex items-center space-x-4 mb-4">
                                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="text-yellow-400 fill-current" />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-2">(24 reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Color</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200 ${
                                            selectedColor === color
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-300 text-gray-700 hover:border-primary'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Size</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium min-w-[3rem] transition-all duration-200 ${
                                            selectedSize === size
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-300 text-gray-700 hover:border-primary'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 border border-gray-300 rounded-md min-w-[3rem] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full py-3"
                                size="lg"
                            >
                                Add to Cart - ${product.price * quantity}
                            </Button>
                            
                            <div className="flex space-x-4">
                                <Button variant="outline" className="flex-1">
                                    <Heart size={18} className="mr-2" />
                                    Add to Wishlist
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Share2 size={18} className="mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 space-y-4">
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <Truck size={16} className="text-primary" />
                                <span>Free shipping on orders over $200</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <RotateCcw size={16} className="text-primary" />
                                <span>30-day return policy</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <Shield size={16} className="text-primary" />
                                <span>Authenticity guaranteed</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <button className="text-primary hover:text-primary-dark text-sm font-medium">
                                View Size Guide
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-gray-200 pt-16">
                    <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={20} className="text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-lg font-semibold">4.8</span>
                                </div>
                                <p className="text-gray-600 mb-4">Based on 24 reviews</p>
                                <Button variant="outline" className="w-full">
                                    Write a Review
                                </Button>
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            {[
                                {
                                    name: "Sarah M.",
                                    rating: 5,
                                    date: "2 weeks ago",
                                    comment: "Absolutely love this piece! The quality is exceptional and the fit is perfect. Worth every penny."
                                },
                                {
                                    name: "Emma L.",
                                    rating: 5,
                                    date: "1 month ago",
                                    comment: "Beautiful craftsmanship and attention to detail. The fabric feels luxurious and the color is exactly as shown."
                                },
                                {
                                    name: "Jessica R.",
                                    rating: 4,
                                    date: "1 month ago",
                                    comment: "Great quality and fast shipping. Runs slightly small, so I'd recommend sizing up."
                                }
                            ].map((review, index) => (
                                <div key={index} className="border-b border-gray-200 pb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                        <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={16} 
                                                className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"} 
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-16 border-t border-gray-200 pt-16">
                        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8 text-center">
                            You Might Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
