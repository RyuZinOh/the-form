import React from 'react';
import Image from 'next/image';
import {
  faUser,
  faMoon,
  faSun,
  faSignOutAlt,
  faTimes,
  faSignInAlt
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
    <header className={`fixed top-0 left-0 right-0 p-4 ${isDarkMode ? ' bg-[#121213]  text-white border-b border-gray-700' : 'bg-gray-100 text-gray-900 border-b border-gray-300'} z-50 transition-colors duration-300 ease-in-out`}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 md:space-x-6">
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <span className="transition-transform duration-300 ease-in-out hover:scale-105">SAMAN</span>
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-200'} transition duration-200 ease-in-out bg-transparent flex items-center justify-center`}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className={`transition-transform duration-300 ease-in-out ${isDarkMode ? 'text-yellow-400' : 'text-blue-500'}`} />
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
                  className={`text-${isDarkMode ? 'white' : 'gray-800'} rounded-full bg-${isDarkMode ? 'transparent' : 'gray-200'} transition-transform duration-300 ease-in-out`}
                  size="2x"
                />
              )}
              <span className="text-sm font-medium transition-opacity duration-300 ease-in-out opacity-100">
                {user.displayName || username || 'Anonymous'}
              </span>
              <button
                onClick={() => signOut(auth)}
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className={`text-${isDarkMode ? 'white' : 'gray-800'}`} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className={`flex items-center space-x-2 p-2 rounded-full transition duration-300 ease-in-out ${
                isFormVisible
                  ? `bg-red-500 text-white hover:bg-red-600`
                  : `bg-blue-500 text-white hover:bg-blue-600`
              }`}
            >
              <FontAwesomeIcon icon={isFormVisible ? faTimes : faSignInAlt} size="lg" />
              <span className="text-base font-medium">
                {isFormVisible ? 'Cancel' : 'Sign In'}
              </span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
