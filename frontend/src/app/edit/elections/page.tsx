 'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';

interface Election {
  election_id: number;
  election_type: string;
  seats: number;
  dateofelection: string;
  winner: string;
}

const EditElections: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [newElection, setNewElection] = useState({
    election_type: '',
    seats: '',
    dateofelection: '',
    winner: '',
  });

  useEffect(() => {
    const fetchElections = async () => {
      const response = await fetch('http://127.0.0.1:5000/api/elections');
      const data = await response.json();
      setElections(data);
    };

    fetchElections();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewElection({ ...newElection, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/api/elections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newElection),
    });

    if (response.ok) {
      const data = await response.json();
      setElections([...elections, data]);
      setNewElection({ election_type: '', seats: '', dateofelection: '', winner: '' });
    }
  };

  return (
    <div>
      <Head>
        <title>Edit Elections</title>
      </Head>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Elections</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-2">
            <label className="block text-gray-700">Election Type</label>
            <input
              type="text"
              name="election_type"
              value={newElection.election_type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Seats</label>
            <input
              type="number"
              name="seats"
              value={newElection.seats}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded no-spinner"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Date of Election</label>
            <input
              type="date"
              name="dateofelection"
              value={newElection.dateofelection}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Winner</label>
            <input
              type="text"
              name="winner"
              value={newElection.winner}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Election
          </button>
        </form>
        <h2 className="text-xl font-bold mb-2">Existing Elections</h2>
        <ul>
          {elections.map((election) => (
            <li key={election.election_id} className="mb-2">
              {election.election_type} - Seats: {election.seats} - Date: {election.dateofelection} - Winner: {election.winner}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditElections;