import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto text-center">
        <p className="text-6xl font-medium mb-4">404</p>
        <h1 className="text-2xl font-medium mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/collections/all" className="btn-secondary">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
