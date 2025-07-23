'use client';
import React, { useState, useContext, useEffect } from 'react';
import Link from "next/link";
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import AuthContext from '@/components/AuthContext';
import Navbar from '@/components/Navbar';

export default function Login() {
  const [formData, setFormData] = useState({ aadharID: '', password: '' });
  const authContext = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user, setUser } = authContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data)); // Store user in local storage
        setMessage('Login successful');
        setTimeout(() => router.push('/'), 3000);
      } else {
        const data = await res.json();
        setMessage(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser); // Rehydrate user state from local storage
    }
  }, [setUser]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <Head>
        <title>ELECTION DB</title>
      </Head>
      <Navbar />
      <div className="w-full max-w-lg mx-auto">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <h2 className="text-black text-xl mb-4">Voter Login Form</h2>
          {message && <p className="text-red-500">{message}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Aadhar ID
            </label>
            <input
              id="aadharID"
              name="aadharID"
              type="number"
              value={formData.aadharID}
              onChange={handleChange}
              className="no-spinner shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
        <div className='my-2 py-2 flex items-center justify-center'>
          <h2 className="text-xl pr-3">
            Don't Have An Account? <br />
            <div className='my-2 py-2 mx-7 px-7'>
              <Link href='/registeruser'>
                <button className="bg-black text-white py-2 px-5 rounded focus:outline-none focus:shadow-outline">Register</button>
              </Link>
            </div>
          </h2>
        </div>
      </div>
    </div>
  );
}