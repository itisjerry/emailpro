'use client';
import { useState } from 'react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const signup = async () => {
    setError('');
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || 'Failed');
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Check your email</h1>
          <p>We sent you a verification link. Click it to activate your account, then sign in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create account</h1>
        <div className="space-y-3">
          <input className="w-full p-3 border rounded" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full p-3 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full p-3 border rounded" placeholder="Password (min 6)" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button onClick={signup} className="w-full p-3 rounded bg-indigo-600 text-white">Create account</button>
        </div>
      </div>
    </div>
  );
}
