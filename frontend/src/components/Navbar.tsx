'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

interface User {
  aadhar_id: string;
  role: 'voter' | 'candidate' | 'party' | 'official';
}

const options = {
  electors: [
    { label: 'Voter Registration', link: '/register/voter' },
    { label: 'Voter Information', link: '/information/voter' },
    { label: 'Query Procedure', link: '/query/voter' },
    { label: 'Edit Voter', link: '/update/voter' },
  ],
  candidates: [
    { label: 'Candidate Registration', link: '/register/candidate' },
    { label: 'Candidate Information', link: '/information/candidate' },
    { label: 'Query Procedure', link: '/query/candidate' },
    { label: 'Edit Candidate', link: '/update/candidate' },
  ],
  parties: [
    { label: 'Party Registration', link: '/register/party' },
    { label: 'Party Information', link: '/information/party' },
    { label: 'Query Procedure', link: '/query' },
    { label: 'Edit Party', link: '/update/party' },
  ],
  officials: [
    { label: 'Official Registration', link: '/register/eci' },
    { label: 'Official Information', link: '/information/officials' },
    { label: 'Query Procedure', link: '/query/officials' },
    { label: 'Edit Constituency', link: '/edit/constituency' },
    { label: 'Edit Poll Booth', link: '/edit/pollbooth' },
    { label: 'Edit Elections', link: '/edit/elections' },
    { label: 'Edit Official', link: '/edit/official' },
    { label: 'Edit Party', link: '/update/party' },
  ],
};

const Navbar: React.FC = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user, setUser } = authContext;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setTimeout(() => router.push('/loginpage'), 0);
  };

  const toggleDropdown = (option: string) => {
    if (selectedOption === option) {
      setShowDropdown(false);
      setSelectedOption(null);
    } else {
      setShowDropdown(true);
      setSelectedOption(option);
    }
  };

  const renderDropdown = (option: string) => {
    if (showDropdown && selectedOption === option) {
      return (
        <div className="dropdown-content">
          {options[option as keyof typeof options].map(({ label, link }) => (
            <Link key={link} legacyBehavior href={link}>
              <a className="block text-sm p-2 hover:bg-gray-200">{label}</a>
            </Link>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <header className="w-full py-4 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" legacyBehavior>
            <a className="flex items-center">
              <Image
                src="/image.png"
                alt="Logo"
                width={80}
                height={80}
                className="mr-3"
              />
              <span className="text-2xl font-bold">Electoral DB</span>
            </a>
          </Link>
        </div>
        {/* Navigation Section */}
        <nav className="flex items-center space-x-4">
          {user && user.role === 'voter' && (
            <div className="dropdown">
              <a href="#" className={`text-xl ${selectedOption === 'electors' ? 'active' : ''}`} onClick={() => toggleDropdown('electors')}>
                Voter
              </a>
              {renderDropdown('electors')}
            </div>
          )}

          {user && user.role === 'candidate' && (
            <div className="dropdown">
              <a href="#" className={`text-xl ${selectedOption === 'candidates' ? 'active' : ''}`} onClick={() => toggleDropdown('candidates')}>
                Candidates
              </a>
              {renderDropdown('candidates')}
            </div>
          )}

          {user && user.role === 'party' && (
            <div className="dropdown">
              <a href="#" className={`text-xl ${selectedOption === 'parties' ? 'active' : ''}`} onClick={() => toggleDropdown('parties')}>
                Parties
              </a>
              {renderDropdown('parties')}
            </div>
          )}

          {user && user.role === 'official' && (
            <div className="dropdown">
              <a href="#" className={`text-xl ${selectedOption === 'officials' ? 'active' : ''}`} onClick={() => toggleDropdown('officials')}>
                ECI Officials
              </a>
              {renderDropdown('officials')}
            </div>
          )}
        </nav>

        {/* Navigation Section */}
        <nav className="flex items-center">
          {!user && (
            <Link href="/loginpage" legacyBehavior>
              <button className="ml-5 px-6 py-4 rounded-full bg-blue-200 hover:bg-blue-700">
                Login
              </button>
            </Link>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="ml-5 px-6 py-4 rounded-full bg-red-500 hover:bg-red-700 text-white"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;