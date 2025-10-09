import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Activities from './pages/Activities';
import Settings from './pages/Settings';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminActivities from './pages/AdminActivities';
import AdminSettings from './pages/AdminSettings';
import Unauthorized from './pages/Unauthorized';
import Orders from './pages/Orders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/Velora/login" element={<Login />} />
              <Route path="/Velora/register" element={<Register />} />
              <Route path="/Velora/unauthorized" element={<Unauthorized />} />
              
              {/* Public Routes with Navbar/Footer */}
              <Route path="/Velora" element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Home />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/Velora/shop" element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Shop />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/Velora/product/:id" element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <ProductDetail />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/Velora/cart" element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Cart />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/Velora/about" element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <About />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/Velora/contact" element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Contact />
                  </main>
                  <Footer />
                </div>
              } />

              {/* Protected User Routes */}
              <Route path="/Velora/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/Velora/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/Velora/activities" element={
                <ProtectedRoute>
                  <Activities />
                </ProtectedRoute>
              } />
              <Route path="/Velora/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/Velora/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />

              {/* Protected Admin Routes */}
              <Route path="/Velora/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/Velora/admin/users" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/Velora/admin/analytics" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/Velora/admin/activities" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminActivities />
                </ProtectedRoute>
              } />
              <Route path="/Velora/admin/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettings />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;