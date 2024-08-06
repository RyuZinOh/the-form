'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, firestore } from '../lib/firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  username: string | null;
  loading: boolean;
  updateUserProfile: (profile: { username?: string | null; photoURL?: string | null }) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  username: null,
  loading: true,
  updateUserProfile: () => {}, 
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user); // Debugging

      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data()?.username || null);
        } else {
          setUsername(null);
        }
      } else {
        setUsername(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserProfile = async (profile: { username?: string | null; photoURL?: string | null }) => {
    try {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, { 
          username: profile.username || null, 
          photoURL: profile.photoURL || null 
        }, { merge: true });
  
        setUsername(profile.username || username || null);
  
        console.log("Profile updated with:", {
          username: profile.username,
          photoURL: profile.photoURL,
        }); 
      } else {
        console.log("No user logged in for profile update"); // Suppress error
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };
  
  
  return (
    <AuthContext.Provider value={{ user, username, loading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
