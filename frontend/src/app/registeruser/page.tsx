'use client';
import React, { useState } from 'react';
import Link from "next/link";
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function Register() {
  const [formData, setFormData] = useState({ aadharID: '', password: '', confirmPassword: '', role: '', party: '' });   
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
    try {
      const res = await fetch(' http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadharID: formData.aadharID, password: formData.password, role: formData.role, party: formData.party }),
      });

      if (res.ok) {
        setMessage('User registered successfully, You will be redirected to the login page');
        setTimeout(() => router.push('/loginpage'), 3000);
      } 
      else {
        const data = await res.json();
        setMessage(data.message || 'Error registering user');
      }
    } catch (error) {
      setMessage('Server error');
    }
  };


  return (
    <div className="bg-white text-black">
      <Head>
        <title>ELECTION DB</title>
      </Head>
      <Navbar />
      <div className="w-full max-w-lg mx-auto">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <h2 className="text-black text-xl mb-4">Voter Registration Form</h2>
          {message && <p>{message}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Aadhar ID</label>
            <input
              type="number"
              id="aadharID"
              name="aadharID"
              value={formData.aadharID}
              onChange={handleChange}
              className="no-spinner shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:cursor-pointer"
            >
            <option value="">Select Your Role</option>
            <option value="voter">Voter</option>
            <option value="candidate">Candidate</option>
            <option value="official">Official</option>
          </select>
          </div>
          {formData.role === 'candidate' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Party</label>
              <input
                type='text'
                id="party"
                name='party'
                value={formData.party}
                onChange={handleChange}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">Re-Enter Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
        </form>
        <div className='my-2 py-2 flex items-center justify-center'>
          <h2 className="text-xl pr-3">
            Already Have An Account? <br />
            <div className='my-2 py-2 mx-7 px-7'>
              <Link href='/loginpage'>
                <button className="bg-black text-white py-2 px-5 rounded focus:outline-none focus:shadow-outline">Login</button>
              </Link>
            </div>
          </h2>
        </div>
      </div>
    </div>
  );
}