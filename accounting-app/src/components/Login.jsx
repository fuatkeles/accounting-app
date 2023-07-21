import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../App.css';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setLoading(false);
        setIsAuthenticated(true); // Kullanıcı girişi başarılıysa isAuthenticated true 
        navigate('/'); // Ana sayfaya yönlendir
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError('Geçersiz e-posta veya şifre.');
      });
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // SignUp sayfasına yönlendir
  };

  return (
    <>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h1>Log In</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Log In'}
          </button>
          {error && <p>{error}</p>}
          <div className="mt-3">
            <p>
            Don't Have an Account?{' '}
              <button type="button" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
