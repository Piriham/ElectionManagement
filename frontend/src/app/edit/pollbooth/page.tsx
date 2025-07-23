'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';

interface PollBooth {
  poll_booth_id: number;
  poll_booth_address: string;
  voter_count: number;
  evm_vvpat_no: number;
  constituency_id: number;
}

const EditPollBooth: React.FC = () => {
  const [pollBooths, setPollBooths] = useState<PollBooth[]>([]);
  const [newPollBooth, setNewPollBooth] = useState({
    poll_booth_address: '',
    evm_vvpat_no: '',
    constituency_id: '',
  });

  useEffect(() => {
    const fetchPollBooths = async () => {
      const response = await fetch('http://127.0.0.1:5000/api/pollbooths');
      const data = await response.json();
      setPollBooths(data);
    };

    fetchPollBooths();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPollBooth({ ...newPollBooth, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/api/pollbooths', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPollBooth),
    });

    if (response.ok) {
      const data = await response.json();
      setPollBooths([...pollBooths, data]);
      setNewPollBooth({ poll_booth_address: '', evm_vvpat_no: '', constituency_id: '' });
    }
  };

  return (
    <div>
      <Head>
        <title>Edit Poll Booth</title>
      </Head>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Poll Booth</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-2">
            <label className="block text-gray-700">Poll Booth Address</label>
            <input
              type="text"
              name="poll_booth_address"
              value={newPollBooth.poll_booth_address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">EVM VVPAT No</label>
            <input
              type="number"
              name="evm_vvpat_no"
              value={newPollBooth.evm_vvpat_no}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Constituency ID</label>
            <input
              type="text"
              name="constituency_id"
              value={newPollBooth.constituency_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Poll Booth
          </button>
        </form>
        <h2 className="text-xl font-bold mb-2">Existing Poll Booths</h2>
        <ul>
          {pollBooths.map((pollBooth) => (
            <li key={pollBooth.poll_booth_id} className="mb-2">
              {pollBooth.poll_booth_address} - EVM VVPAT No: {pollBooth.evm_vvpat_no} - Constituency ID: {pollBooth.constituency_id} (Voters: {pollBooth.voter_count})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditPollBooth;