import React, { use } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/Velora/" element={<Home />} />
              <Route path="/Velora/shop" element={<Shop />} />
              <Route path="/Velora/product/:id" element={<ProductDetail />} />
              <Route path="/Velora/cart" element={<Cart />} />
              <Route path="/Velora/about" element={<About />} />
              <Route path="/Velora/contact" element={<Contact />} />
              <Route path="/Velora/login" element={<Login />}/>
              <Route path="/Velora/profile" element={<Dashboard />}/>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;