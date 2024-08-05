'use client';

import { useState } from 'react';
import AuthPage from '../page';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, username } = useAuth();

  const toggleAuthPage = () => setIsOpen(prev => !prev);
  const toggleProfileMenu = () => setIsProfileOpen(prev => !prev);

  return (
    <nav className="fixed top-0 right-0 p-4 bg-gray-800 text-white w-full flex justify-between items-center">
      <h1 className="text-xl font-bold">SAMAN</h1>
      {user ? (
        <div className="relative flex items-center">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center p-2 rounded-full hover:bg-gray-700 transition duration-200"
          >
            <FaUserCircle size={24} />
            {username && <span className="ml-2">{username}</span>}
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-lg">
              <button
                onClick={() => {
                  // Add logout functionality here
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-800"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={toggleAuthPage}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {isOpen ? 'Close' : 'Sign Up / Log In'}
        </button>
      )}
      {isOpen && <AuthPage />}
    </nav>
  );
};

export default Navbar;
