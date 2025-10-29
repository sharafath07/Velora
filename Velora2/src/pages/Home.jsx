import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';
import { Products } from '../data/product';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const Home = () => {
  const featuredProducts = Products.filter(product => product.featured).slice(0, 6);

  return (
    <div className="min-h-screen home-page">
      {/* Hero Section */}
      <section className="home-hero relative flex items-center justify-center text-center text-white">
        <div className="home-hero-bg absolute inset-0 bg-cover bg-center" />
        <div className="home-hero-overlay absolute inset-0" />
        <div className="home-hero-content relative z-10">
          <h1 className="home-hero-title font-serif text-5xl md:text-6xl font-bold mb-4">
            Discover Your Signature Style
          </h1>
          <p className="home-hero-subtitle text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Experience timeless elegance and modern sophistication with Velora.
          </p>
          <Link
            to="/Velora/shop"
            className="home-hero-cta inline-flex items-center justify-center gap-2 text-white font-medium px-8 py-3 rounded-full"
          >
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-4 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 text-sm font-medium">
            <span>✨ New Arrivals Weekly</span>
            <span>🚚 Free Shipping Over $200</span>
            <span>💎 Premium Quality Guaranteed</span>
            <span>🔄 Easy 30-Day Returns</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white home-featured">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 home-featured-header">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4 home-featured-title">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto home-featured-description">
              Discover our handpicked selection of luxury pieces that define contemporary elegance.
            </p>
          </div>

          <div className="product-card-container home-featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="animate-slide-up"
              />
            ))}
          </div>

          <div className="text-center home-featured-cta">
            <Link to="/Velora/shop">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 home-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Explore our carefully curated collections
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Dresses', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Outerwear', image: 'https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Knitwear', image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Accessories', image: 'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=400' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/Velora/shop?category=${category.name}`}
                className="group relative overflow-hidden rounded-lg aspect-square home-category-item"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white font-serif text-xl font-bold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-gray-50 home-story">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center home-story-content">
            <div className="animate-slide-up home-story-text">
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6 home-story-title">
                The Velora Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed home-story-paragraph">
                Founded on the principle that luxury should be accessible to the modern woman,
                Velora represents the perfect fusion of timeless elegance and contemporary design.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed home-story-paragraph">
                Each piece is thoughtfully selected from premium materials and crafted with
                meticulous attention to detail, ensuring that every woman feels extraordinary
                in her Velora ensemble.
              </p>
              <Link to="/Velora/about">
                <Button variant="outline">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="animate-slide-up home-story-image">
              <img
                src="https://images.pexels.com/photos/1488327/pexels-photo-1488327.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Velora Story"
                className="rounded-lg shadow-lg w-full h-96 object-cover home-story-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-white home-newsletter">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Stay in Style
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Subscribe to our newsletter for exclusive offers, style tips, and first access to new collections.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <Button variant="secondary" className="px-6 py-3">
              Subscribe
            </Button>
          </form>
          <p className="text-sm mt-4 opacity-75">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white home-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 home-features-grid">
          <div className="text-center home-feature-item">
            <div className="home-feature-icon">
              <Truck size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2 home-feature-title">Free Shipping</h3>
            <p className="text-gray-600 text-sm home-feature-description">
              Complimentary shipping on all orders over $200
            </p>
          </div>
          <div className="text-center home-feature-item">
            <div className="home-feature-icon">
              <Shield size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2 home-feature-title">Secure Payment</h3>
            <p className="text-gray-600 text-sm home-feature-description">
              Your payment information is always protected
            </p>
          </div>
          <div className="text-center home-feature-item">
            <div className="home-feature-icon">
              <Star size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2 home-feature-title">Premium Quality</h3>
            <p className="text-gray-600 text-sm home-feature-description">
              Carefully curated luxury pieces that last
            </p>
          </div>
          <div className="text-center home-feature-item">
            <div className="home-feature-icon">
              <Headphones size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2 home-feature-title">24/7 Support</h3>
            <p className="text-gray-600 text-sm home-feature-description">
              Dedicated customer service whenever you need us
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
