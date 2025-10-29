import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Button from '../components/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10)
      newErrors.message = 'Message must be at least 10 characters long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <div className="min-h-screen bg-white contact-container">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-light to-primary py-16 contact-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center contact-header-content">
          <h1 className="font-serif text-4xl font-bold text-white mb-4 animate-fade-in contact-header-title">
            Get in Touch
          </h1>
          <p className="text-xl text-white/90 animate-fade-in contact-header-subtitle">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 contact-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 contact-main">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8 contact-info">
            <div className="animate-slide-up contact-info-section">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 contact-info-title">
                Contact Information
              </h2>
              <div className="space-y-6 contact-info-items">
                <div className="flex items-start space-x-4 contact-info-item">
                  <div className="bg-primary-light rounded-full p-3 flex-shrink-0 contact-info-icon">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      123 Fashion Avenue<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 contact-info-item">
                  <div className="bg-primary-light rounded-full p-3 flex-shrink-0 contact-info-icon">
                    <Phone className="text-primary" size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 contact-info-item">
                  <div className="bg-primary-light rounded-full p-3 flex-shrink-0 contact-info-icon">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">hello@velora.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 contact-info-item">
                  <div className="bg-primary-light rounded-full p-3 flex-shrink-0 contact-info-icon">
                    <Clock className="text-primary" size={20} />
                  </div>
                  <div className="contact-info-details">
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <div className="text-gray-600 space-y-1 contact-hours">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 10:00 AM - 6:00 PM</p>
                      <p>Sunday: 12:00 PM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="animate-slide-up contact-faq">
              <h3 className="font-semibold text-lg text-gray-900 mb-4 contact-faq-title">
                Frequently Asked
              </h3>
              <div className="space-y-3 text-sm contact-faq-items">
                <div className="contact-faq-item">
                  <h4 className="font-medium text-gray-900">Shipping & Returns</h4>
                  <p className="text-gray-600">
                    Free shipping on orders over $200. 30-day returns.
                  </p>
                </div>
                <div className="contact-faq-item">
                  <h4 className="font-medium text-gray-900">Size Guide</h4>
                  <p className="text-gray-600">
                    Check our comprehensive size guide for the perfect fit.
                  </p>
                </div>
                <div className="contact-faq-item">
                  <h4 className="font-medium text-gray-900">Care Instructions</h4>
                  <p className="text-gray-600">
                    Detailed care instructions included with every purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 contact-form-section">
            <div className="bg-white rounded-lg shadow-lg p-8 animate-slide-up">
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6 contact-form-title">
                Send Us a Message
              </h2>

              {isSubmitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6 contact-success-message">
                  <p className="font-medium">Thank you for your message!</p>
                  <p className="text-sm">We'll get back to you within 24 hours.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 contact-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 contact-form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 contact-form-input ${
                        errors.name ? 'border-red-500 error' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1 contact-form-error">{errors.name}</p>}
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 contact-form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 contact-form-input ${
                        errors.email ? 'border-red-500 error' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1 contact-form-error">{errors.email}</p>}
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 contact-form-label">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 contact-form-input ${
                      errors.subject ? 'border-red-500 error' : 'border-gray-300'
                    }`}
                    placeholder="What is your message about?"
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1 contact-form-error">{errors.subject}</p>}
                </div>

                <div className="contact-form-group">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 contact-form-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-none contact-form-textarea ${
                      errors.message ? 'border-red-500 error' : 'border-gray-300'
                    }`}
                    placeholder="Tell us more about your inquiry..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1 contact-form-error">{errors.message}</p>}
                </div>

                <div className="contact-form-submit">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-3"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 contact-form-spinner" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
