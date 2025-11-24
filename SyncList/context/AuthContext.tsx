import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  logIn: (newToken: string, name: string, profilePic: string) => Promise<void>;
  logOut: () => Promise<void>;
  name: string | null;
  profilePic: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('authToken');
        if (storedToken) {
          setToken(storedToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.error("Failed to load auth token", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const logIn = async (newToken: string, name: string, profilePic:string) => {
    setIsLoading(true);
    try {
      await SecureStore.setItemAsync('authToken', newToken);
      setToken(newToken);
      setName(name);
      setProfilePic(profilePic);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (e) {
      console.error("Failed to save auth token", e);
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync('authToken');
      setToken(null);
      setName(null);
      setProfilePic(null);
      delete axios.defaults.headers.common['Authorization'];
    } catch (e) {
      console.error("Failed to delete auth token", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, logIn, logOut, name, profilePic }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};