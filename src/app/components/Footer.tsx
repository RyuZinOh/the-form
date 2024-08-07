// src/app/components/Footer.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUtensils, faTshirt, faLaptop, faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';

interface FooterProps {
  theme: 'light' | 'dark';
  user: boolean;
}

const Footer: React.FC<FooterProps> = ({ theme, user }) => {
  return (
    <footer className={`fixed bottom-0 left-0 right-0 p-4 ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-white'} border-t border-gray-300`}>
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        {!user ? (
          <div className="text-center text-xs">
            <p>Contact us: info@saman.com</p>
            <p>About us</p>
            <p>&copy; 2024 SAMAN</p>
          </div>
        ) : (
          <div className="flex justify-between items-center w-full max-w-4xl">
            <div className="flex items-center space-x-4">
              <a href="/home" className="text-lg hover:text-blue-500 transition duration-200">
                <FontAwesomeIcon icon={faHome} className="text-sm" />
              </a>
              <a href="/food" className="text-lg hover:text-blue-500 transition duration-200">
                <FontAwesomeIcon icon={faUtensils} className="text-sm" />
              </a>
              <a href="#clothes" className="text-lg hover:text-blue-500 transition duration-200">
                <FontAwesomeIcon icon={faTshirt} className="text-sm" />
              </a>
              <a href="/test" className="text-lg hover:text-blue-500 transition duration-200">
                <FontAwesomeIcon icon={faLaptop} className="text-sm" />
              </a>
              <a href="#shopping" className="text-lg hover:text-blue-500 transition duration-200">
                <FontAwesomeIcon icon={faShoppingCart} className="text-sm" />
              </a>
              <a href="#search" className="text-lg hover:text-blue-500 transition duration-200">
                <FontAwesomeIcon icon={faSearch} className="text-sm" />
              </a>
            </div>
            <div className="text-center text-xs">
              <p>Contact us: info@saman.com</p>
              <p>About us</p>
              <p>&copy; 2024 SAMAN</p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
