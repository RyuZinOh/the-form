import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUtensils, faTshirt, faLaptop, faSearch } from '@fortawesome/free-solid-svg-icons';

interface FooterProps {
  theme: 'light' | 'dark';
  user: boolean;
}

const Footer: React.FC<FooterProps> = ({ theme, user }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleSearchBar = () => {
    if (isSearchOpen) {
      setIsAnimating(true); 
      setTimeout(() => {
        setIsSearchOpen(false); 
        setIsAnimating(false);
      }, 300); 
    } else {
      setIsSearchOpen(true);
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      setIsAnimating(false); 
    }
  }, [isSearchOpen]);

  return (
    <>
      <footer
        className={`fixed bottom-0 left-0 right-0 p-4 ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-white'} border-t border-gray-300 shadow-md transition-shadow duration-300`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
          {user && (
            <div className="flex flex-wrap justify-between items-center w-full md:w-auto space-x-4">
              <div className="flex items-center space-x-4">
                <a
                  href="/home"
                  className="relative text-lg hover:text-blue-500 transition duration-300 transform hover:scale-110 hover:animate-pulse"
                  aria-label="Home"
                >
                  <FontAwesomeIcon icon={faHome} className="text-xl transition-transform duration-300" />
                </a>
                <a
                  href="/food"
                  className="relative text-lg hover:text-blue-500 transition duration-300 transform hover:scale-110 hover:animate-pulse"
                  aria-label="Food"
                >
                  <FontAwesomeIcon icon={faUtensils} className="text-xl transition-transform duration-300" />
                </a>
                <a
                  href="/clothes"
                  className="relative text-lg hover:text-blue-500 transition duration-300 transform hover:scale-110 hover:animate-pulse"
                  aria-label="Clothes"
                >
                  <FontAwesomeIcon icon={faTshirt} className="text-xl transition-transform duration-300" />
                </a>
                <a
                  href="/tech"
                  className="relative text-lg hover:text-blue-500 transition duration-300 transform hover:scale-110 hover:animate-pulse"
                  aria-label="Tech"
                >
                  <FontAwesomeIcon icon={faLaptop} className="text-xl transition-transform duration-300" />
                </a>
                <a
                  onClick={toggleSearchBar}
                  className="relative text-lg hover:text-blue-500 transition duration-300 transform hover:scale-110 hover:animate-pulse cursor-pointer"
                  aria-label="Search"
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={`text-xl ${isSearchOpen ? 'text-2xl' : 'text-xl'} transform transition-transform duration-300`}
                  />
                </a>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row w-full items-end md:items-end justify-end md:justify-end px-4 py-2">
            <div className="flex flex-col space-y-2 text-xs text-right">
              <p className="transition-opacity duration-300 hover:opacity-80">Contact IG: @happilli</p>
              <p className="transition-opacity duration-300 hover:opacity-80">About me</p>
              <p className="transition-opacity duration-300 hover:opacity-80">&copy; 2024 SAMAN</p>
            </div>
          </div>
        </div>
      </footer>
      {isSearchOpen || isAnimating ? (
        <div
          className={`fixed inset-0 z-50 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onClick={toggleSearchBar}
        >
          <div
            className={`relative w-full max-w-lg mx-auto mt-20 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${isAnimating ? 'scale-75 translate-y-12 opacity-0' : 'scale-100 translate-y-0 opacity-100'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} ${isSearchOpen ? 'animate-expand' : ''}`}
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className={`w-full border rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 ${theme === 'light' ? 'border-gray-300 bg-white focus:ring-gray-300' : 'border-gray-600 bg-gray-800 focus:ring-gray-500'} transition duration-300 ease-in-out`}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} transition-transform duration-300`}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Footer;
