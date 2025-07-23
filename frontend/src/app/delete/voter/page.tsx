'use client';
import Head from 'next/head';
import Navbar from "../../../components/Navbar"
import React, { useState } from 'react';

export default function DeleteVoter() {
  const [aadharId, setAadharId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAadharId(e.target.value);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/deleteVoter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadharId }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      console.log('Successfully deleted voter');
      setAadharId(''); // Clear the input field after deletion
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white text-black">
      <Head>
        <title>ELECTORAL DB</title>
      </Head>
      <Navbar />
      <div className="w-full max-w-lg mx-auto">
        <form onSubmit={handleDelete} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-black text-xl mb-4">Delete Voter</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aadharId">
              Aadhar ID
            </label>
            <input
              type="number"
              id="aadharId"
              name="aadharId"
              value={aadharId}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}