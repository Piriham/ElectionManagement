'use client';
import Head from 'next/head';
import Navbar from "../../../components/Navbar";
import React, { useState } from 'react';

export default function DeleteParty() {
  const [partyName, setPartyName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartyName(e.target.value);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/deleteParty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partyName }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      console.log('Successfully deleted party');
      setPartyName(''); // Clear the input field after deletion
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
          <h2 className="text-black text-xl mb-4">Delete Party</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="partyName">
              Party Name
            </label>
            <input
              type="text"
              id="partyName"
              name="partyName"
              value={partyName}
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