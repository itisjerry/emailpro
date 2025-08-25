'use client';

import Link from 'next/link';

export default function Auth() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome to EmailPro</h1>
      <p className="mb-6">
        Please{' '}
        <Link href="/auth/signin" className="underline">
          sign in
        </Link>{' '}
        or{' '}
        <Link href="/auth/signup" className="underline">
          create an account
        </Link>
        .
      </p>
    </div>
  );
}
