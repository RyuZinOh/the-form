'use client'

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../auth/AuthContext';

const Food = () => {
  const { user } = useAuth(); // Assuming you use AuthContext for user state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

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
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Food</h1>
          <p className={`text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Discover our food offerings.
          </p>
        </div>
      </main>
      <Footer theme={theme} user={!!user} />
    </div>
  );
};

export default Food;
