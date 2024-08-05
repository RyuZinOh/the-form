'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from './lib/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignOutAlt, faTimes, faSun, faMoon, faUser, faHome, faTshirt, faLaptop, faShoppingCart, faSearch, faUtensils, faCopyright } from '@fortawesome/free-solid-svg-icons';
import LoadingPage from './components/LoadingPage';
import { useAuth } from './auth/AuthContext';

const Page = () => {
  const { user, username, loading: authLoading } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoadingPage, setShowLoadingPage] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      setLoading(false);
      setShowLoadingPage(false);
    }
  }, [authLoading]);

  useEffect(() => {
    if (window.performance && performance.navigation.type === 1) {
      setShowLoadingPage(true);
    } else {
      setShowLoadingPage(false);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, emailOrUsername, password);
        await setDoc(doc(firestore, 'users', auth.currentUser?.uid || ''), { username: usernameInput, email: emailOrUsername });
        setSuccessMessage('Sign Up Successfully! Please log in.');
        setIsSignUp(false);
        setIsFormVisible(true);
        setEmailOrUsername('');
        setPassword('');
        setUsernameInput('');
      } else {
        const isEmail = emailOrUsername.includes('@');
        let userEmail;

        if (isEmail) {
          await signInWithEmailAndPassword(auth, emailOrUsername, password);
          router.push('/');
        } else {
          const userQuery = query(collection(firestore, 'users'), where('username', '==', emailOrUsername));
          const userSnap = await getDocs(userQuery);

          if (!userSnap.empty) {
            const userDoc = userSnap.docs[0];
            userEmail = userDoc.data().email;
            await signInWithEmailAndPassword(auth, userEmail, password);
            router.push('/');
          } else {
            setError('Username does not exist.');
          }
        }
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  if (showLoadingPage) return <LoadingPage />;

  const formClasses = `flex flex-col items-center border rounded-lg shadow-md p-4 ${theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-700 border-gray-600'}`;
  const inputClasses = `w-full p-2 mb-2 border rounded-lg ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}`;
  const buttonClasses = `w-full py-2 rounded-full shadow-md transition duration-200 ${theme === 'light' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-500'} text-white`;

  return (
    <div className={`font-poppins ${theme === 'light' ? 'text-gray-800 bg-gradient-to-b from-gray-100 to-gray-200' : 'text-white bg-gradient-to-b from-black to-gray-900'}`}>
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
    </h1>{user ? (
      <div className="flex items-center space-x-4">
        <span className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faUser} size="lg" />
          <span>{username || user.email}</span>
        </span>
        <button
          onClick={() => auth.signOut()}
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


      <main className="pt-16">
        {successMessage ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{successMessage}</h1>
            <p className="mt-4 text-lg">
              do <button
                onClick={() => {
                  setIsFormVisible(true);
                  setIsSignUp(false);
                  setSuccessMessage(null);
                }}
                className="text-blue-500 hover:underline"
              >
                refresh
              </button>.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            {!user ? (
              <div className="flex flex-col items-center w-full max-w-lg p-4">
                {isFormVisible && (
                  <form onSubmit={handleSubmit} className={formClasses}>
                    <div className="flex items-center mb-4">
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500 dark:text-gray-400" />
                      <input
                        type="text"
                        placeholder={isSignUp ? 'Username' : 'Username or Email'}
                        value={isSignUp ? usernameInput : emailOrUsername}
                        onChange={(e) => isSignUp ? setUsernameInput(e.target.value) : setEmailOrUsername(e.target.value)}
                        className={inputClasses}
                      />
                    </div>

                    {isSignUp && (
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-500 dark:text-gray-400" />
                        <input
                          type="text"
                          placeholder="Email"
                          value={emailOrUsername}
                          onChange={(e) => setEmailOrUsername(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                    )}

                    <div className="flex items-center mb-4">
                      <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-500 dark:text-gray-400" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <button type="submit" className={buttonClasses}>
                      {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(prev => !prev);
                        setError(null);
                      }}
                      className="mt-2 text-blue-500 hover:underline"
                    >
                      {isSignUp ? 'Already have an account? Log In' : 'Don’t have an account? Sign Up'}
                    </button>
                  </form>
                )}
                {!isFormVisible && !user && (
                  <div className="flex flex-col items-center justify-center w-full max-w-md p-4">
                    <p className={`text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Welcome to SAMAN. Please {isSignUp ? 'sign up' : 'log in'} to continue.
                    </p>
                    <button
                      onClick={() => setIsFormVisible(true)}
                      className={`mt-4 px-4 py-2 rounded-full border ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-100' : 'border-blue-500 text-blue-500 hover:bg-blue-600'} bg-transparent hover:bg-opacity-10 transition duration-200`}
                    >
                      {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-screen">
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Welcome back, {username || user.email}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className={`fixed bottom-0 left-0 right-0 p-4 ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-white'} border-t border-gray-300`}>
  <div className="flex justify-between items-center max-w-7xl mx-auto">
    <div className="flex items-center space-x-4">
      <a href="#home" className="text-lg hover:text-blue-500 transition duration-200">
        <FontAwesomeIcon icon={faHome} className="text-sm" />
      </a>
      <a href="#food" className="text-lg hover:text-blue-500 transition duration-200">
        <FontAwesomeIcon icon={faUtensils} className="text-sm" />
      </a>
      <a href="#clothes" className="text-lg hover:text-blue-500 transition duration-200">
        <FontAwesomeIcon icon={faTshirt} className="text-sm" />
      </a>
      <a href="#techs" className="text-lg hover:text-blue-500 transition duration-200">
        <FontAwesomeIcon icon={faLaptop} className="text-sm" />
      </a>
      <a href="#shopping" className="text-lg hover:text-blue-500 transition duration-200">
        <FontAwesomeIcon icon={faShoppingCart} className="text-sm" />
      </a>
      <a href="#search" className="text-lg hover:text-blue-500 transition duration-200">
        <FontAwesomeIcon icon={faSearch} className="text-sm" />
      </a>
    </div>
    <div className="flex items-center space-x-4">
    </div>
    <div className="text-center text-xs">
      <p>Contact us: info@saman.com</p>
      <p>About us</p>
      <p>&copy; 2024 SAMAN</p>
    </div>
  </div>
</footer>
  </div>
  );
};

export default Page;
