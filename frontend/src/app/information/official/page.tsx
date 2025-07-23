'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface OfficialData {
  aadharId: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: string;
  dob: string;
  age: string;
  phoneNumber: string;
  constituencyAssigned: string;
  pollBoothAssigned: string;
  officialId: string;
  officialRank: string;
  higherRankId: string;
}

const Registration: React.FC = () => {
  const [data, setData] = useState<OfficialData | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const aadhar_id = user.aadhar_id;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://127.0.0.1:5000/getofficialinformation?aadharId=${aadhar_id}`);
      const data: OfficialData = await response.json();
      setData(data);
    };

    fetchData();
  }, [aadhar_id]);

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
              <th className="py-2">Aadhar ID</th>
              <th className="py-2">First Name</th>
              <th className="py-2">Last Name</th>
              <th className="py-2">Middle Name</th>
              <th className="py-2">Gender</th>
              <th className="py-2">DOB</th>
              <th className="py-2">Age</th>
              <th className="py-2">Phone Number</th>
              <th className="py-2">Constituency Assigned</th>
              <th className="py-2">Poll Booth Assigned</th>
              <th className="py-2">Official ID</th>
              <th className="py-2">Official Rank</th>
              <th className="py-2">Higher Rank ID</th>
            </tr>
          </thead>
          <tbody>
            {data && (
              <tr>
                <td className="border px-4 py-2">{data.aadharId}</td>
                <td className="border px-4 py-2">{data.firstName}</td>
                <td className="border px-4 py-2">{data.lastName}</td>
                <td className="border px-4 py-2">{data.middleName}</td>
                <td className="border px-4 py-2">{data.gender}</td>
                <td className="border px-4 py-2">{data.dob}</td>
                <td className="border px-4 py-2">{data.age}</td>
                <td className="border px-4 py-2">{data.phoneNumber}</td>
                <td className="border px-4 py-2">{data.constituencyAssigned}</td>
                <td className="border px-4 py-2">{data.pollBoothAssigned}</td>
                <td className="border px-4 py-2">{data.officialId}</td>
                <td className="border px-4 py-2">{data.officialRank}</td>
                <td className="border px-4 py-2">{data.higherRankId}</td>
              </tr>
            )}
          </tbody>
        </table>
        <Link legacyBehavior href="/update/official">
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update
          </button>
        </Link>
        <Link legacyBehavior href="/update/official">
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Registration;