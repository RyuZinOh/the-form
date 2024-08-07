import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { User } from 'firebase/auth'; 
import { useAuth } from '../auth/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase-config'; // Import auth from your firebase config

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

  return (
    <header className={`fixed top-0 left-0 right-0 p-4 ${theme === 'light' ? 'bg-white text-gray-800 shadow-md' : 'bg-black text-white border-b border-gray-800'} z-50`}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <span>SAMAN</span>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border ${theme === 'light' ? 'border-gray-300 hover:bg-gray-100' : 'border-gray-600 hover:bg-gray-700'} transition duration-200 bg-transparent flex items-center justify-center`}
          >
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </button>
        </h1>

        {user ? (
          <div className="flex items-center space-x-4">
            <Image
              src={user.photoURL || '/default-avatar.png'}
              alt={user.displayName || 'User photo'}
              width={30}
              height={30}
              className="rounded-full"
            />
            <span className="text-sm font-medium">
              {user.displayName || username || 'Anonymous'}
            </span>
            <button
              onClick={() => signOut(auth)} // Use signOut from Firebase
              className={`px-4 py-2 rounded-full border ${theme === 'light' ? 'border-red-600 text-red-600 hover:bg-red-100' : 'border-red-500 text-red-500 hover:bg-red-600'} bg-transparent hover:bg-opacity-10 transition duration-200`}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsFormVisible(prev => !prev)}
            className={`px-4 py-2 rounded-full border ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-100' : 'border-blue-500 text-blue-500 hover:bg-blue-600'} bg-transparent hover:bg-opacity-10 transition duration-200`}
          >
            {isFormVisible ? <FontAwesomeIcon icon={faTimes} size="lg" /> : 'Log In'}
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
