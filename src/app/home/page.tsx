'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../auth/AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase-config';

const Home = () => {
  const { user, username, updateUserProfile } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

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
      }
    } catch (error) {
      setError(`Error signing in with Google: ${(error as Error).message}`);
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
        } else {
          const userQuery = query(collection(firestore, 'users'), where('username', '==', emailOrUsername));
          const userSnap = await getDocs(userQuery);

          if (!userSnap.empty) {
            userEmail = userSnap.docs[0].data().email;
            await signInWithEmailAndPassword(auth, userEmail, password);
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

  useEffect(() => {
    if (user) {
      setIsFormVisible(false);
    }
  }, [user]);

  return (
    <div className={`font-poppins ${theme === 'light' ? 'text-gray-800 bg-white' : 'text-white bg-[#1a1a1a]'}`}>
      <Header
        theme={theme}
        user={user}
        toggleTheme={toggleTheme}
        setIsFormVisible={setIsFormVisible}
        isFormVisible={isFormVisible}
      />
      <main className="pt-16">
        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Home
            </h1>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Welcome to the Home page!
            </p>
            <button
              onClick={() => setIsFormVisible(prev => !prev)}
              className={`mt-4 px-4 py-2 rounded-full border ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-100' : 'border-blue-500 text-blue-500 hover:bg-blue-600'} bg-transparent hover:bg-opacity-10 transition duration-200`}
            >
              {isFormVisible ? 'Close Form' : 'Open Login Form'}
            </button>

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
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Welcome
            </h1>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              THIS IS HOME PAGE
            </p>
          </div>
        )}
      </main>
      <Footer theme={theme} user={!!user} />
    </div>
  );
};

export default Home;
