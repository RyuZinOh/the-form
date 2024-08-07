'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from './lib/firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { collection, doc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FaGoogle } from 'react-icons/fa'; 
import LoadingPage from './components/LoadingPage';
import { useAuth } from './auth/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Image from 'next/image';
import { getAuth } from 'firebase/auth';

const Page = () => {
  const { user, username, loading: authLoading, updateUserProfile } = useAuth();
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

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user || !user.email) {
        return;
      }

      const userDocRef = doc(firestore, 'googleusers', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        await updateUserProfile({
          username: user.displayName,
          photoURL: user.photoURL || userData.photoURL
        });
      } else {
        const username = user.displayName || 'New User';
        await setDoc(userDocRef, {
          username: username,
          email: user.email,
          photoURL: user.photoURL,
        });

        await updateUserProfile({
          username,
          photoURL: user.photoURL
        });
      }

      router.push('/');
    } catch (error) {
      alert('Error signing in with Google: ' + (error as Error).message);
    }
  };

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
<Header
        theme={theme}
        user={user} 
        toggleTheme={toggleTheme}
        setIsFormVisible={setIsFormVisible}
        isFormVisible={isFormVisible}
      />
      <main className="pt-16">
        {successMessage ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{successMessage}</h1>
            <p className="mt-4 text-lg">
              Please <button
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
                {!isFormVisible ? (
                  <div className="flex flex-col items-center justify-center w-full max-w-md p-4">
                    <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      SAMAN APP
                    </h1>
                    <p className={`text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Join us today
                    </p>
                    <button
                      onClick={() => setIsFormVisible(true)}
                      className={`mt-4 px-4 py-2 rounded-full border ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-100' : 'border-blue-500 text-blue-500 hover:bg-blue-600'} bg-transparent hover:bg-opacity-10 transition duration-200`}
                    >
                      {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                  </div>
                ) : (
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

                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className={`mt-4 w-full py-2 rounded-full shadow-md transition duration-200 ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-blue-400 hover:bg-blue-300'} text-white flex items-center justify-center`}
                      >
                        <FaGoogle className="mr-2" />
                        Continue with Google
                      </button>
                    )}

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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-screen">
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Welcome back, {user.displayName || user.email}
                </p>
                <Image
                  src={user.photoURL || ''}
                  alt={username || user.email || 'User photo'} 
                  width={100}
                  height={100}
                  className="rounded-full mt-4"
                />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer theme={theme} user={!!user} />
    </div>
  );
};

export default Page;
