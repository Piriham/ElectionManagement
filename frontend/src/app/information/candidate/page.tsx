'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface CandidateData {
  aadharId: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: string;
  dob: string;
  age: string;
  phoneNumber: string;
  constituencyFighting: string;
  candidateId: string;
  partyRep: string;
}

export default function Registration() {
  const [data, setData] = useState<CandidateData | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const aadhar_id = user.aadhar_id;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://127.0.0.1:5000/getcandidateinformation?aadharId=${aadhar_id}`);
      const data: CandidateData = await response.json();
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
        <table>
          <thead>
            <tr>
              <th>Aadhar ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Middle Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Age</th>
              <th>Phone Number</th>
              <th>Constituency Fighting</th>
              <th>Candidate ID</th>
              <th>Party Representative</th>
            </tr>
          </thead>
          <tbody>
            {data && (
              <tr>
                <td>{data.aadharId}</td>
                <td>{data.firstName}</td>
                <td>{data.lastName}</td>
                <td>{data.middleName}</td>
                <td>{data.gender}</td>
                <td>{data.dob}</td>
                <td>{data.age}</td>
                <td>{data.phoneNumber}</td>
                <td>{data.constituencyFighting}</td>
                <td>{data.candidateId}</td>
                <td>{data.partyRep}</td>
              </tr>
            )}
          </tbody>
        </table>
        <Link legacyBehavior href="/update/candidate">
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update
          </button>
        </Link>
        <Link legacyBehavior href="/update/candidate">
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
        </Link>
      </div>
    </div>
  );
}