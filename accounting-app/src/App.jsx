import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PdfRead from './components/PdfRead';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));

  // PrivateRoute bileşeni, kullanıcının giriş yapmış olup olmadığını kontrol edecek
  const PrivateRoute = ({ element, ...rest }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Eğer kullanıcı giriş yapmışsa Home, yapmamışsa Login sayfasını göster */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/pdf-read" element={<PrivateRoute element={<PdfRead />} />} />
      </Routes>
    </Router>
  );
};

export default App;
