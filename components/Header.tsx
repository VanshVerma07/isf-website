import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SunIcon, MoonIcon, UserIcon } from './IconComponents';
import { useAuth } from './AuthContext';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();

  const activeLinkStyle = {
    color: '#00bfff',
    textShadow: '0 0 5px #00bfff',
  };

  return (
    <header className="sticky top-0 z-50 bg-white/30 dark:bg-black/30 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-800/20 shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
            <img src="./public/iete-logo.png" alt="IETE Logo" className="h-12 w-12 object-contain" />
            <span className="font-orbitron text-lg md:text-xl font-bold text-secondary dark:text-white">
            ISF <span className="text-primary">BKBIET</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 font-rajdhani font-bold text-lg">
          <NavLink to="/" style={({ isActive }) => (isActive ? activeLinkStyle : {})} className="hover:text-primary transition-colors">Home</NavLink>
          <NavLink to="/events" style={({ isActive }) => (isActive ? activeLinkStyle : {})} className="hover:text-primary transition-colors">Events</NavLink>
          <NavLink to="/team" style={({ isActive }) => (isActive ? activeLinkStyle : {})} className="hover:text-primary transition-colors">Team</NavLink>
          <NavLink to="/community" style={({ isActive }) => (isActive ? activeLinkStyle : {})} className="hover:text-primary transition-colors">Community</NavLink>
           {user?.role === 'admin' && (
              <NavLink to="/admin" style={({ isActive }) => (isActive ? activeLinkStyle : {})} className="hover:text-primary transition-colors">Admin</NavLink>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            {isDarkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-secondary" />}
          </button>
           
           {user ? (
             <div className="flex items-center space-x-2">
               <UserIcon className="h-6 w-6 text-primary"/>
               <span className="hidden sm:inline font-bold">{user.name.split(' ')[0]}</span>
               <button onClick={logout} className="px-3 py-1 text-xs font-bold text-white bg-secondary rounded-full hover:bg-opacity-80 transition-all">
                Logout
               </button>
             </div>
           ) : (
             <div className="hidden md:flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-primary rounded-full hover:bg-primary/10 transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-full hover:bg-opacity-80 transition-all">
                  Register
                </Link>
             </div>
           )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
