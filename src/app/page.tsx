'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from './lib/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FaEnvelope, FaLock, FaLinkedin, FaGithub, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import LoadingPage from './components/LoadinPage'; 

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter(); 

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoggedIn || successMessage) return; 

    const fetchVideoUrl = async () => {
      try {
        const docRef = doc(firestore, '001', 'video-uwu');
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) throw new Error('No video found');
        
        const { videos } = docSnap.data() || {};
        if (!videos) throw new Error('Video URL is undefined or empty');

        const fileId = videos.match(/\/d\/(.*?)\//)?.[1];
        if (!fileId) throw new Error('Unable to extract file ID from URL');

        setVideoUrl(`https://drive.google.com/file/d/${fileId}/preview`);
      } catch (err) {
        setError((err as Error).message || 'An unexpected error occurred.');
      }
    };

    fetchVideoUrl();
  }, [isLoggedIn, successMessage]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      isSignUp
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
        
      if (isSignUp) {
        setSuccessMessage("Sign Up Successfully!"); 
        setIsLoggedIn(true);
        setIsFormVisible(false);
      } else {
        setIsLoggedIn(true);
        setIsFormVisible(false);
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  if (loading) return <LoadingPage />;

  const formClasses = `flex items-center border rounded-lg shadow-sm ${theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-700 border-gray-600'}`;
  const inputClasses = `flex-1 p-2 border-none rounded-lg ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}`;
  const buttonClasses = `w-full py-2 rounded-full shadow-md transition duration-200 ${theme === 'light' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-500'} text-white`;

  return (
    <div className={`font-poppins ${theme === 'light' ? 'text-gray-800 bg-gradient-to-b from-gray-100 to-gray-200' : 'text-white bg-gradient-to-b from-black to-gray-900'}`}>
      <header className={`fixed top-0 left-0 right-0 ${theme === 'light' ? 'bg-white text-gray-800 shadow-md' : 'bg-black text-white border-b border-gray-800'} shadow-md z-50`}>
        <nav className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">SAMAN</h1>
          <button
            onClick={() => {
              setIsSignUp(false);
              setIsFormVisible(prev => !prev);
            }}
            className={`px-4 py-2 rounded-full border ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-100' : 'border-blue-500 text-blue-500 hover:bg-blue-600'} bg-transparent hover:bg-opacity-10 transition duration-200`}
          >
            {isFormVisible ? <FaTimes size={20} /> : 'Log In'}
          </button>
        </nav>
      </header>

      <main className="pt-16">
        {successMessage ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {successMessage === "You have been cutely rickrolled!" && videoUrl && (
              <>
                <iframe
                  ref={iframeRef}
                  src={videoUrl}
                  width="800"
                  height="450"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Video"
                  className="rounded-lg shadow-md"
                />
                <h1 className={`text-3xl font-bold mt-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{successMessage}</h1>
              </>
            )}
            {successMessage === "Sign Up Successfully!" && (
              <>
                <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{successMessage}</h1>
                <button
                  onClick={() => router.back()} 
                  className={`px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 mt-4`}
                >
                  Go Back
                </button>
              </>
            )}
          </div>
        ) : isLoggedIn ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {videoUrl ? (
              <iframe
                ref={iframeRef}
                src={videoUrl}
                width="800"
                height="450"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Video"
                className="rounded-lg shadow-md"
              />
            ) : (
              <h1 className={`text-4xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>u Have been cutely rickrolled....</h1>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            {!isFormVisible ? (
              <h1 className={`text-4xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Welcome to Our Platform!</h1>
            ) : (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                <div className={`w-full max-w-md p-8 border rounded-lg shadow-lg ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-600'}`}>
                  <h1 className={`text-2xl font-bold text-center mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </h1>
                  {error && <p className={`text-red-500 text-center mb-4`}>{error}</p>}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className={formClasses}>
                      <div className={`flex items-center justify-center w-10 h-10 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        <FaEnvelope size={20} />
                      </div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputClasses}
                      />
                    </div>
                    <div className={formClasses}>
                      <div className={`flex items-center justify-center w-10 h-10 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        <FaLock size={20} />
                      </div>
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={inputClasses}
                      />
                    </div>
                    <button type="submit" className={buttonClasses}>
                      {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                  </form>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setIsSignUp(prev => !prev)}
                      className={`text-blue-500 hover:underline ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}
                    >
                      {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={`fixed bottom-0 left-0 right-0 py-4 ${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-800 text-white'}`}>
        <div className="flex flex-col items-center">
          <div className="text-center mb-4">
            <p className={`mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-white'}`}>© 2024 Safallama</p>
            <p className={`mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-white'}`}>Organization: Vercel</p>
            <p className={`mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-white'}`}>Creator: safal lama</p>
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white'}`}>Email: yoyuehappy@gmail.com</p>
          </div>
          <div className="flex gap-4 mb-4">
            <a href="mailto:contact@safallama.com" aria-label="Email Safallama" className={`hover:text-white ${theme === 'light' ? 'text-gray-600' : 'text-white'} transition-transform transform hover:scale-110`}>
              <FaEnvelope size={24} />
            </a>
            <a href="https://linkedin.com" aria-label="Safallama LinkedIn" className={`hover:text-white ${theme === 'light' ? 'text-gray-600' : 'text-white'} transition-transform transform hover:scale-110`}>
              <FaLinkedin size={24} />
            </a>
            <a href="https://github.com" aria-label="Safallama GitHub" className={`hover:text-white ${theme === 'light' ? 'text-gray-600' : 'text-white'} transition-transform transform hover:scale-110`}>
              <FaGithub size={24} />
            </a>
          </div>
          <div className="absolute bottom-4 right-4">
            <button
              aria-label="Toggle dark/light mode"
              onClick={toggleTheme}
              className={`flex items-center justify-center px-4 py-2 rounded-full border ${theme === 'light' ? 'border-gray-700 text-gray-700 hover:bg-gray-100' : 'border-gray-600 text-gray-600 hover:bg-gray-700'} bg-transparent hover:bg-opacity-10 transition-all`}
            >
              {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
