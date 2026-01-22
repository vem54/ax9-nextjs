import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-20">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-medium mb-4">404</h1>
        <p className="text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Return Home
        </Link>
      </div>
    </div>
  );
}
