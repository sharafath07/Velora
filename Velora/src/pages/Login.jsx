import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeClosed } from 'lucide-react';
import '../styles/login.css';
import authService from "../api/authService.js";
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { user, loginUser, registerUser } = useAuth();
  const [isloading, setIsLoading] = useState(false);

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const loginForm = useRef(null);
  const signupForm = useRef(null);
    
  
  useEffect(() => {
    if (user) navigate('/Velora');
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;

    try {
      const res = await authService.login(email, password);
      alert("Login successful!");
      localStorage.setItem("token", res.data.token); // Store JWT token
      console.log(res.data);
      navigate('/Velora');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Invalid credentials!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const name = signupForm.current.name.value;
    const email = signupForm.current.email.value;
    const password1 = signupForm.current.password1.value;
    const password2 = signupForm.current.password2.value;

    const formData = { name, email, password: password1 };

    if (password1 !== password2) {
      alert('⚠️ Passwords do not match!');
      return;
    }
    try {
      const res = await API.post("/auth/register", formData);
      alert("Signup successful!");
      console.log(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Signup failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-main">
      {isloading && <LoadingSpinner />}
      <div className={`login-container ${isSignUpMode ? 'right-panel-active' : ''}`} id="container">
        
        {/* -------- Sign In Form -------- */}
        <div className="form-container sign-in-container">
          <form ref={loginForm} onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <input type="email" placeholder="Email" name="email" required />
            <div className="password">
              <input
                type={showPasswordLogin ? 'text' : 'password'}
                placeholder="Password"
                name="password"
                required
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPasswordLogin(!showPasswordLogin)}
              >
                {showPasswordLogin ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Link to="/Velora/forgot-password" style={{ fontSize: "12px" }}>
              Forgot your password?
            </Link>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* -------- Sign Up Form -------- */}
        <div className="form-container sign-up-container">
          <form ref={signupForm} onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input type="text" placeholder="Name" name="name" required />
            <input type="email" placeholder="Email" name="email" required />

            <div className="password">
              <input
                type={showPassword1 ? 'text' : 'password'}
                placeholder="Password"
                name="password1"
                required
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPassword1(!showPassword1)}
              >
                {showPassword1 ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="password">
              <input
                type={showPassword2 ? 'text' : 'password'}
                placeholder="Confirm Password"
                name="password2"
                required
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* -------- Overlay -------- */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={() => setIsSignUpMode(false)}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your details and start your journey with us</p>
              <button className="ghost" onClick={() => setIsSignUpMode(true)}>
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
