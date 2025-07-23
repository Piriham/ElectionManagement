'use client';
import React, { createContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

// Define the User interface
interface User {
  aadharId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dob: string;
  age: string;
  state: string;
  phoneNumber: string;
  constituencyName: string;
  pollingBoothId: string;
  voterId: string;
  role: string;
  partyName?: string;
}

// Define the type for the AuthContext
interface AuthContextType {
  user: User | null; // User object or null if not logged in
  setUser: Dispatch<SetStateAction<User | null>>; // Function to update the user
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component for the context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;