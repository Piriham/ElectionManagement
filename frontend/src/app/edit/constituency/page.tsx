'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';

interface Constituency {
  id: number;
  name: string;
  voter_count: number;
  state: string;
}

const EditConstituency: React.FC = () => {
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [newConstituency, setNewConstituency] = useState({ name: '', state: '' });

  useEffect(() => {
    const fetchConstituencies = async () => {
      const response = await fetch('http://127.0.0.1:5000/api/constituencies');
      const data = await response.json();
      setConstituencies(data);
    };

    fetchConstituencies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewConstituency({ ...newConstituency, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/api/constituencies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newConstituency),
    });

    if (response.ok) {
      const data = await response.json();
      setConstituencies([...constituencies, data]);
      setNewConstituency({ name: '', state: '' });
    }
  };

  return (
    <div>
      <Head>
        <title>Edit Constituency</title>
      </Head>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Constituency</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-2">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={newConstituency.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={newConstituency.state}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Constituency
          </button>
        </form>
        <h2 className="text-xl font-bold mb-2">Existing Constituencies</h2>
        <ul>
          {constituencies.map((constituency) => (
            <li key={constituency.id} className="mb-2">
              {constituency.name} - {constituency.state} (Voters: {constituency.voter_count})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditConstituency;