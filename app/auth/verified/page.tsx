export default function VerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Verified!</h1>
        <p>Your email is verified. You can now sign in.</p>
        <a href="/auth/signin" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Go to sign in</a>
      </div>
    </div>
  );
}
