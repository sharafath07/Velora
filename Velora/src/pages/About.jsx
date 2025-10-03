import React from 'react';
import { Award, Heart, Users, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary-light to-primary overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/1488327/pexels-photo-1488327.jpeg?auto=compress&cs=tinysrgb&w=1920")',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white animate-fade-in">
            <h1 className="font-serif text-5xl font-bold mb-4">Our Story</h1>
            <p className="text-xl max-w-2xl">
              Crafting luxury fashion experiences that celebrate the modern woman's elegance and confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
                The Velora Journey
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Born from a vision to redefine luxury fashion, Velora represents the perfect harmony 
                between timeless elegance and contemporary style. Our journey began with a simple 
                belief: every woman deserves to feel extraordinary.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="animate-slide-up">
                <img
                  src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Velora Atelier"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="animate-slide-up">
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">Our Philosophy</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  At Velora, we believe that luxury is not just about premium materials or 
                  exquisite craftsmanship—though we excel in both. It's about the confidence 
                  that comes from wearing something truly special, the feeling of being uniquely you.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Each piece in our collection is carefully curated to embody this philosophy, 
                  ensuring that when you wear Velora, you're not just dressed—you're transformed.
                </p>
              </div>
            </div>

            <div className="text-center mb-12 animate-slide-up">
              <h3 className="font-serif text-3xl font-bold text-gray-900 mb-8">Our Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-primary-light rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="text-primary" size={24} />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Passion</h4>
                  <p className="text-gray-600 text-sm">
                    Every piece reflects our deep passion for fashion and dedication to excellence.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-light rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Award className="text-primary" size={24} />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Quality</h4>
                  <p className="text-gray-600 text-sm">
                    We never compromise on quality, using only the finest materials and craftsmanship.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-light rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="text-primary" size={24} />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Community</h4>
                  <p className="text-gray-600 text-sm">
                    Building a community of confident, empowered women who inspire each other.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-light rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Globe className="text-primary" size={24} />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Sustainability</h4>
                  <p className="text-gray-600 text-sm">
                    Committed to ethical practices and sustainable fashion for a better future.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-12 animate-slide-up">
              <h3 className="font-serif text-3xl font-bold text-gray-900 mb-6 text-center">Our Promise</h3>
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  When you choose Velora, you're not just purchasing clothing—you're investing in 
                  pieces that will elevate your wardrobe and boost your confidence. We promise to 
                  deliver exceptional quality, timeless designs, and an unparalleled shopping experience.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our commitment extends beyond fashion to creating lasting relationships with our 
                  customers, understanding their needs, and continuously evolving to exceed their expectations.
                </p>
              </div>
            </div>

            <div className="text-center animate-slide-up">
              <h3 className="font-serif text-3xl font-bold text-gray-900 mb-6">Join Our Story</h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Every Velora piece tells a story—of craftsmanship, of elegance, of the woman who wears it. 
                We invite you to become part of our story, to discover what it means to wear luxury 
                that's crafted just for you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;