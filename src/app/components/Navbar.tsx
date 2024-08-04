'use client';

import { useState } from 'react';
import AuthPage from '../page'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAuthPage = () => setIsOpen(prev => !prev);

  return (
    <>
      <nav className="fixed top-0 right-0 p-4 bg-gray-800 text-white w-full flex justify-between items-center">
        <h1 className="text-xl font-bold">My Website</h1>
        <button
          onClick={toggleAuthPage}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {isOpen ? 'Close' : 'Sign Up / Log In'}
        </button>
      </nav>
      {isOpen && <AuthPage />}
    </>
  );
};

export default Navbar;
