'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { shopifyFetch } from '@/lib/shopify/client';
import { CUSTOMER_CREATE, CUSTOMER_ACCESS_TOKEN_CREATE } from '@/lib/shopify/queries';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create customer
      const createResponse = await shopifyFetch<{
        customerCreate: {
          customer: { id: string } | null;
          customerUserErrors: { message: string }[];
        };
      }>({
        query: CUSTOMER_CREATE,
        variables: {
          input: { firstName, lastName, email, password },
        },
        cache: 'no-store',
      });

      const createResult = createResponse.data.customerCreate;

      if (createResult.customerUserErrors.length > 0) {
        setError(createResult.customerUserErrors[0].message);
        return;
      }

      // Auto-login after registration
      const loginResponse = await shopifyFetch<{
        customerAccessTokenCreate: {
          customerAccessToken: { accessToken: string } | null;
          customerUserErrors: { message: string }[];
        };
      }>({
        query: CUSTOMER_ACCESS_TOKEN_CREATE,
        variables: {
          input: { email, password },
        },
        cache: 'no-store',
      });

      const loginResult = loginResponse.data.customerAccessTokenCreate;

      if (loginResult.customerAccessToken) {
        localStorage.setItem('customerAccessToken', loginResult.customerAccessToken.accessToken);
        router.push('/account');
      } else {
        router.push('/account/login');
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
        <h1 className="text-2xl font-medium mb-6 text-center">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
            minLength={8}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/account/login" className="underline hover:no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
