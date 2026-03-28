import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `font-semibold transition-all duration-300 relative px-2 py-1 ${
      isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
    }`;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 tracking-tight">
            TechKraft
          </h1>
        </div>
        
        <div className="flex items-center space-x-8">
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => navigate('/')} className={navLinkClass('/')}>
              Home
            </button>
            <button onClick={() => navigate('/profile')} className={navLinkClass('/profile')}>
              My Profile
            </button>
            {user.role === 'admin' && (
              <button onClick={() => navigate('/admin-dashboard')} className={navLinkClass('/admin-dashboard')}>
                Admin Dashboard
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-gray-800 leading-tight">{user.name}</span>
              <span className="text-xs text-gray-500 font-medium">{user.role === 'admin' ? 'Administrator' : 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-semibold px-5 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
