import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';
import { Products } from '../data/product';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const Home = () => {
  const featuredProducts = Products.filter(product => product.featured).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of luxury pieces that define contemporary elegance.
            </p>
          </div>

          <div className="product-card-container">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                className="animate-slide-up"
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/Velora/shop">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
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
                className="group relative overflow-hidden rounded-lg aspect-square"
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
                The Velora Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded on the principle that luxury should be accessible to the modern woman, 
                Velora represents the perfect fusion of timeless elegance and contemporary design. 
                Our carefully curated collections celebrate femininity while empowering confidence.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
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
            <div className="animate-slide-up">
              <img
                src="https://images.pexels.com/photos/1488327/pexels-photo-1488327.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Velora Story"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-white">
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-slide-up">
              <div className="bg-primary-light rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">
                Complimentary shipping on all orders over $200
              </p>
            </div>
            <div className="text-center animate-slide-up">
              <div className="bg-primary-light rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">
                Your payment information is always protected
              </p>
            </div>
            <div className="text-center animate-slide-up">
              <div className="bg-primary-light rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">
                Carefully curated luxury pieces that last
              </p>
            </div>
            <div className="text-center animate-slide-up">
              <div className="bg-primary-light rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Headphones className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">
                Dedicated customer service whenever you need us
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;