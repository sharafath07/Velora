import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeClosed } from 'lucide-react';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const { user, loginUser, registerUser } = useAuth();

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const loginForm = useRef(null);
  const signupForm = useRef(null);

  useEffect(() => {
    if (user) navigate('/Velora');
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;
    loginUser(email, password);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const name = signupForm.current.name.value;
    const email = signupForm.current.email.value;
    const password1 = signupForm.current.password1.value;
    const password2 = signupForm.current.password2.value;

    if (password1 !== password2) {
      alert('⚠️ Passwords do not match!');
      return;
    }

    registerUser({ name, email, password1 });
  };

  return (
    <div className="login-main">
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
