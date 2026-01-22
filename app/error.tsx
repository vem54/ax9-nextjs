'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container py-10">
      <div className="text-center">
        <h1 className="text-2xl font-medium mb-3">Something went wrong</h1>
        <p className="text-sm text-gray-500 mb-6">
          Please try again. If the issue persists, contact support.
        </p>
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  );
}
