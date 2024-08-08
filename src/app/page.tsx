'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from './lib/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import LoadingPage from './components/LoadingPage';
import { useAuth } from './auth/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import Image from 'next/image';

const Page = () => {
  const { user, loading: authLoading, updateUserProfile } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showLoadingPage, setShowLoadingPage] = useState(true);
  const { username } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      setShowLoadingPage(false);
    }
  }, [authLoading]);

  useEffect(() => {
    setShowLoadingPage(window.performance?.navigation?.type === 1);
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const { user } = await signInWithPopup(auth, provider);

      if (user && user.email) {
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
            username,
            email: user.email,
            photoURL: user.photoURL,
          });

          await updateUserProfile({
            username,
            photoURL: user.photoURL
          });
        }

        router.push('/');
      }
    } catch (error) {
      alert(`Error signing in with Google: ${(error as Error).message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, emailOrUsername, password);
        await setDoc(doc(firestore, 'users', auth.currentUser?.uid || ''), {
          username: usernameInput,
          email: emailOrUsername
        });
        setSuccessMessage('Sign Up Successfully! Please log in.');
        setIsSignUp(false);
        setEmailOrUsername('');
        setPassword('');
        setUsernameInput('');
      } else {
        const isEmail = emailOrUsername.includes('@');
        let userEmail;

        if (isEmail) {
          await signInWithEmailAndPassword(auth, emailOrUsername, password);
          setIsFormVisible(false); 
          router.push('/');
        } else {
          const userQuery = query(collection(firestore, 'users'), where('username', '==', emailOrUsername));
          const userSnap = await getDocs(userQuery);

          if (!userSnap.empty) {
            userEmail = userSnap.docs[0].data().email;
            await signInWithEmailAndPassword(auth, userEmail, password);
            setIsFormVisible(false); 
            router.push('/');
          } else {
            setError('Username does not exist.');
          }
        }
      }
    } catch (error) {
      setError(`Error: ${(error as Error).message}`);
    }
  };

  const toggleSignUp = () => setIsSignUp(prev => !prev);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  if (showLoadingPage) {
    return <LoadingPage />;
  }

  return (
    <div className={`font-poppins ${theme === 'light' ? ' text-gray-800 bg-gradient-to-b from-gray-100 to-gray-200' : 'text-white bg-gradient-to-b from-black to-gray-900'}`}>
      <Header
        theme={theme}
        user={user}
        toggleTheme={toggleTheme}
        setIsFormVisible={setIsFormVisible}
        isFormVisible={isFormVisible}
      />
      <main className={`pt-16 ${theme === 'light' ? 'bg-gradient-to-b from-gray-100 to-gray-200' : 'bg-[#1a1a1a]'}`}>
        {user ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <p className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Welcome back, {user.displayName || username || user.email}
            </p>
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User photo'}
                className="rounded-full mt-4"
                width={100}
                height={100}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Welcome to the App
            </h1>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Please log in or sign up to continue.
            </p>
            <button
              onClick={() => setIsFormVisible(prev => !prev)}
              className={`mt-4 px-4 py-2 rounded-full border ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-100' : 'border-blue-500 text-blue-500 hover:bg-blue-600'} bg-transparent hover:bg-opacity-10 transition duration-200`}
            >
              {isFormVisible ? 'Close Form' : 'Open Login Form'}
            </button>

            {successMessage && (
              <p className="mt-4 text-green-500">{successMessage}</p>
            )}
            {error && (
              <p className="mt-4 text-red-600">{error}</p>
            )}

            {isFormVisible && (
          <AuthForm
          isSignUp={isSignUp}
          emailOrUsername={emailOrUsername}
          password={password}
          usernameInput={usernameInput}
          error={error}
          theme={theme}
          onSubmit={handleSubmit}
          onChange={(e, field) => {
            if (field === 'usernameInput') setUsernameInput(e.target.value);
            if (field === 'emailOrUsername') setEmailOrUsername(e.target.value);
            if (field === 'password') setPassword(e.target.value);
          }}
          handleGoogleSignIn={handleGoogleSignIn}
          toggleSignUp={toggleSignUp}
        />
            )}
          </div>
        )}
      </main>
      <Footer theme={theme} user={!!user} />
    </div>
  );
};

export default Page;
