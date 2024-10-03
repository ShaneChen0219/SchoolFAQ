import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold">Welcome to School Faq</h1>
      <p className="mt-4 text-lg">Please Login or Create new user</p>

      <Link href="/login">
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">
          Go to Login
        </button>
      </Link>
      <Link href="/signup">
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">
          Sign Up
        </button>
      </Link>
    </div>
  );
}
