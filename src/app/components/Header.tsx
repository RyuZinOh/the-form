import React from 'react';
import Image from 'next/image';
import {
  faUser,
  faMoon,
  faSun,
  faSignOutAlt,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from 'firebase/auth'; 
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase-config'; 
import { useAuth } from '../auth/AuthContext';

interface HeaderProps {
  theme: 'light' | 'dark';
  user: User | null;   
  toggleTheme: () => void;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFormVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  user,
  toggleTheme,
  setIsFormVisible,
  isFormVisible
}) => {
  const { username } = useAuth();
  const isDarkMode = theme === 'dark';

  return (
    <header className={`fixed top-0 left-0 right-0 p-4 ${isDarkMode ? 'bg-gray-900 text-white border-b border-gray-700' : 'bg-gray-100 text-gray-900 border-b border-gray-300'} z-50 transition-colors duration-300 ease-in-out`}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 md:space-x-6">
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <span className="transition-transform duration-300 ease-in-out hover:scale-105">SAMAN</span>
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-200'} transition duration-200 ease-in-out bg-transparent flex items-center justify-center`}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className={`transition-transform duration-300 ease-in-out ${isDarkMode ? 'text-yellow-500' : 'text-blue-500'}`} />
          </button>
        </div>

        <div className="flex items-center space-x-4 md:ml-auto">
          {user ? (
            <>
              {user.photoURL ? (
                <div className="transition-opacity duration-300 ease-in-out opacity-100">
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User photo'}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                </div>
              ) : (
                <FontAwesomeIcon
                  icon={faUser}
                  className={`text-${isDarkMode ? 'gray-200' : 'gray-800'} rounded-full bg-${isDarkMode ? 'gray-800' : 'gray-200'} transition-transform duration-300 ease-in-out`}
                  size="2x"
                />
              )}
              <span className="text-sm font-medium transition-opacity duration-300 ease-in-out opacity-100">
                {user.displayName || username || 'Anonymous'}
              </span>
              <button
                onClick={() => signOut(auth)}
                className={`px-4 py-2 rounded-full border ${isDarkMode ? 'border-red-500 text-red-500 hover:bg-red-600' : 'border-red-600 text-red-600 hover:bg-red-100'} bg-transparent hover:bg-opacity-10 transition duration-200 ease-in-out`}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsFormVisible(prev => !prev)}
              className={`px-4 py-2 rounded-full border ${isDarkMode ? 'border-blue-500 text-blue-500 hover:bg-blue-600' : 'border-blue-600 text-blue-600 hover:bg-blue-100'} bg-transparent hover:bg-opacity-10 transition duration-200 ease-in-out`}
            >
              {isFormVisible ? <FontAwesomeIcon icon={faTimes} size="lg" /> : 'Log In'}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
