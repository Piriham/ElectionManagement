'use client';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface VoterData {
  aadharId: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: string;
  dob: string;
  age: string;
  state: string;
  phoneNumber: string;
  constituencyName: string;
  pollingBoothId: string;
  voterId: string;
}

export default function VoterInformation() {
  const [data, setData] = useState<VoterData | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const aadhar_id = user.aadharId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/getvoterinformation`);
        if (response.ok) {
          const data: VoterData = await response.json();
          setData(data);
        } else {
          console.error('Failed to fetch voter information');
        }
      } catch (error) {
        console.error('Error fetching voter information:', error);
      }
    };

    fetchData();
  }, [aadhar_id]);

  return (
    <div className="bg-white text-black">
      <Head>
        <title>ELECTORAL DB</title>
      </Head>
      <Navbar />
      <div className="w-full max-w-screen-xl mx-auto pb-96">
        {data ? (
          <table className="w-full">
            <thead>
              <tr>
                <th>Aadhar ID</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>Age</th>
                <th>State</th>
                <th>Phone Number</th>
                <th>Constituency Name</th>
                <th>Polling Booth ID</th>
                <th>Voter ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.aadharId}</td>
                <td>{data.firstName}</td>
                <td>{data.middleName}</td>
                <td>{data.lastName}</td>
                <td>{data.gender}</td>
                <td>{data.dob}</td>
                <td>{data.age}</td>
                <td>{data.state}</td>
                <td>{data.phoneNumber}</td>
                <td>{data.constituencyName}</td>
                <td>{data.pollingBoothId}</td>
                <td>{data.voterId}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}