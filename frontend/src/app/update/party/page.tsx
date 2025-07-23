'use client';
import Head from 'next/head';
import Navbar from "../../../components/Navbar";
import React, { useState } from 'react';
import Link from 'next/link';

export default function PartyUpdate() {
  const [formData, setFormData] = useState({
    partyName: '',
    partySymbol: '',
    president: '',
    partyFunds: '',
    headquarters: '',
    partyMemberCount: ''
  });

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
      const response = await fetch('http://127.0.0.1:5000/updateParty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      console.log('Successfully updated Party');
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
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-black text-xl mb-4">Party Update Form</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="partyName">
              Party Name
            </label>
            <input
              type="text"
              id="partyName"
              name="partyName"
              value={formData.partyName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="partySymbol">
              Party Symbol
            </label>
            <input
              type="text"
              id="partySymbol"
              name="partySymbol"
              value={formData.partySymbol}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="president">
              President
            </label>
            <input
              type="text"
              id="president"
              name="president"
              value={formData.president}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="partyFunds">
              Party Funds
            </label>
            <input
              type="text"
              id="partyFunds"
              name="partyFunds"
              value={formData.partyFunds}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="headquarters">
              Headquarters
            </label>
            <input
              type="text"
              id="headquarters"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="partyMemberCount">
              Party Member Count
            </label>
            <input
              type="text"
              id="partyMemberCount"
              name="partyMemberCount"
              value={formData.partyMemberCount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
        <Link href="/deleteParty">
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
        </Link>
      </div>
    </div>
  );
}