'use client';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import React, { useState, FC } from 'react';
import AuthContext from '@/components/AuthContext';

// Define the User type
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

const Home: FC = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="bg-white text-black">
        <Head>
          <h1>ELECTORAL DB</h1>
        </Head>
        <Navbar />
        <div className='flex justify-center align-center'>
          <Image src="/india logo.png" alt="Logo" width={700} height={700} />
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default Home;