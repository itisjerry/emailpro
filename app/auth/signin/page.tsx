'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        <div className="space-y-3">
          <input className="w-full p-3 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full p-3 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={async()=>{ setLoading(true); await signIn('credentials', { email, password, callbackUrl: '/' }); setLoading(false);}}
            className="w-full p-3 rounded bg-indigo-600 text-white">{loading?'Signing in...':'Sign in'}</button>
        </div>
        <div className="mt-4 space-y-2">
          <button onClick={()=>signIn('google', { callbackUrl: '/' })} className="w-full p-3 rounded border">Sign in with Google</button>
          <button onClick={()=>signIn('azure-ad', { callbackUrl: '/' })} className="w-full p-3 rounded border">Sign in with Microsoft</button>
        </div>
        <p className="mt-4 text-sm">No account? <Link className="text-indigo-600" href="/auth/signup">Create one</Link></p>
      </div>
    </div>
  );
}
