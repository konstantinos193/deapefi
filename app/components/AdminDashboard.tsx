"use client";

import { useState } from 'react';

// Mock data for metrics
const mockMetrics = {
  loans: 0,
  TVL: 0,
  cashMade: 0,
};

export default function AdminDashboard() {
  const [metrics] = useState(mockMetrics);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '12345678') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const takeSnapshot = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_FRONTEND_API_KEY;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiKey || !apiUrl) {
        throw new Error('API URL or API key is not defined');
      }

      const response = await fetch(`${apiUrl}/api/leaderboard`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();

      const lastUpdated = data.lastUpdated;
      const formattedDate = new Date(lastUpdated).toISOString().split('T')[0];

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `staking_snapshot_${formattedDate}.json`;
      a.click();
      URL.revokeObjectURL(url);

      console.log('Snapshot taken successfully!');
    } catch (error) {
      console.error('Error taking snapshot:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Admin Login</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black placeholder-gray-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black placeholder-gray-500"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Metrics</h2>
        <ul className="list-disc pl-5 text-gray-800">
          <li>Loans: {metrics.loans}</li>
          <li>TVL: ${metrics.TVL.toLocaleString('en-US')}</li>
          <li>Cash Made: ${metrics.cashMade.toLocaleString('en-US')}</li>
        </ul>
        <button
          onClick={takeSnapshot}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Take Snapshot
        </button>
      </div>
    </div>
  );
} 