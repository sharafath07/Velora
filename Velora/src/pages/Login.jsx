import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/Velora/';

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    formType === 'signin'
      ? setSignInData({ ...signInData, [name]: value })
      : setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(signInData.email, signInData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(signUpData.email, signUpData.password, signUpData.name);
      setIsSignUpMode(false);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login-main'>
      <div className={`login-container ${isSignUpMode ? 'right-panel-active' : ''}`} id="container">
        {/* Sign Up */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            {/* <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span> */}
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={signUpData.name}
              onChange={(e) => handleChange(e, 'signup')}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={signUpData.email}
              onChange={(e) => handleChange(e, 'signup')}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={signUpData.password}
              onChange={(e) => handleChange(e, 'signup')}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Sign In */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn}>
            <h1>Sign in</h1>
            {/* <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your account</span> */}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={signInData.email}
              onChange={(e) => handleChange(e, 'signin')}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={signInData.password}
              onChange={(e) => handleChange(e, 'signin')}
              required
            />
            <Link to="/Velora/forgot-password">Forgot your password?</Link>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={() => setIsSignUpMode(false)}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp" onClick={() => setIsSignUpMode(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
