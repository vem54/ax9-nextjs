'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { shopifyFetch } from '@/lib/shopify/client';
import { CUSTOMER_ACCESS_TOKEN_CREATE } from '@/lib/shopify/queries';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await shopifyFetch<{
        customerAccessTokenCreate: {
          customerAccessToken: { accessToken: string; expiresAt: string } | null;
          customerUserErrors: { message: string }[];
        };
      }>({
        query: CUSTOMER_ACCESS_TOKEN_CREATE,
        variables: {
          input: { email, password },
        },
        cache: 'no-store',
      });

      const result = response.data.customerAccessTokenCreate;

      if (result.customerUserErrors.length > 0) {
        setError(result.customerUserErrors[0].message);
        return;
      }

      if (result.customerAccessToken) {
        // Store the token (in a real app, use httpOnly cookies)
        localStorage.setItem('customerAccessToken', result.customerAccessToken.accessToken);
        router.push('/account');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-medium mb-6 text-center">Login</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to track orders, returns, and new drops.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/account/register" className="underline hover:no-underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
