'use client';

import { useState, useEffect, useRef } from 'react';
import { auth, firestore } from './lib/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchVideoUrl = async () => {
        try {
          const docRef = doc(firestore, '001', 'video-uwu');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const fetchedVideoUrl = data?.videos;
            if (fetchedVideoUrl) {
              const fileId = fetchedVideoUrl.match(/\/d\/(.*?)\//)?.[1];
              if (fileId) {
                const directUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                setVideoUrl(directUrl);
              } else {
                throw new Error('Unable to extract file ID from URL');
              }
            } else {
              throw new Error('Video URL is undefined or empty');
            }
          } else {
            throw new Error('No video found');
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unexpected error occurred.');
          }
        }
      };

      fetchVideoUrl();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (iframeRef.current && videoUrl) {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo' }),
          '*'
        );
      };
    }
  }, [videoUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Sign Up Successful');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setIsLoggedIn(true);
        setIsFormVisible(false);
        alert('Sign In Successful');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="flex items-center justify-end p-4">
          {!isLoggedIn && (
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {isFormVisible ? 'Close Form' : 'Sign Up / Log In'}
            </button>
          )}
        </nav>
      </header>

      <main className="pt-16">
        {isLoggedIn ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Enjoy the Video!</h1>
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
                className="rounded-lg"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold text-gray-800">Loading Video...</h1>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            {!isFormVisible ? (
              <h1 className="text-4xl font-bold text-white">A place where u can buy things, somehow </h1>
            ) : (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="w-full max-w-md p-8 bg-white bg-opacity-60 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg">
                  <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </h1>
                  {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                    >
                      {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                  </form>
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-blue-600 hover:underline"
                    >
                      {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
