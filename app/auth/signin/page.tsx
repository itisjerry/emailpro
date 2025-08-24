'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        <div className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            onClick={async () => {
              setLoading(true);
              const res = await signIn('credentials', { email, password, callbackUrl: '/', redirect: false });
              setLoading(false);
              if (res?.error) setError(res.error || 'Sign in failed');
              else window.location.href = '/';
            }}
            className="w-full p-3 rounded bg-indigo-600 text-white"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        <p className="mt-4 text-sm">No account? <Link className="text-indigo-600" href="/auth/signup">Create one</Link></p>
      </div>
    </div>
  );
}
