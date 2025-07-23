'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface ConstituencyData {
  constituencyName: string;
  maleCount: number;
  femaleCount: number;
  pollBoothCount: number;
}

const Registration: React.FC = () => {
  const [data, setData] = useState<ConstituencyData[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/getConstDeets');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setData(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white text-black">
      <Head>
        <title>ELECTORAL DB</title>
      </Head>
      <Navbar />
      <div className="w-full max-w-lg mx-auto pb-96">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Constituency Name</th>
              <th className="py-2">Male Count</th>
              <th className="py-2">Female Count</th>
              <th className="py-2">Poll Booth Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.constituencyName}</td>
                <td className="border px-4 py-2">{item.maleCount}</td>
                <td className="border px-4 py-2">{item.femaleCount}</td>
                <td className="border px-4 py-2">{item.pollBoothCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Registration;