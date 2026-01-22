'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { shopifyFetch, formatPrice } from '@/lib/shopify/client';
import { GET_CUSTOMER } from '@/lib/shopify/queries';
import { Customer } from '@/lib/shopify/types';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      const token = localStorage.getItem('customerAccessToken');

      if (!token) {
        router.push('/account/login');
        return;
      }

      try {
        const response = await shopifyFetch<{ customer: Customer }>({
          query: GET_CUSTOMER,
          variables: { customerAccessToken: token },
          cache: 'no-store',
        });

        if (response.data.customer) {
          setCustomer(response.data.customer);
        } else {
          localStorage.removeItem('customerAccessToken');
          router.push('/account/login');
        }
      } catch (error) {
        console.error('Failed to fetch customer:', error);
        router.push('/account/login');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('customerAccessToken');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const orders = customer.orders.edges.map((edge) => edge.node);

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-medium">
              Hello, {customer.firstName || 'there'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        {/* Orders */}
        <section>
          <h2 className="text-lg font-medium mb-4">Order History</h2>

          {orders.length === 0 ? (
            <div className="border border-gray-100 p-6 text-center">
              <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
              <Link href="/collections/all" className="btn-primary inline-block">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-100 p-4">
                  <div className="flex flex-wrap justify-between gap-4 mb-4">
                    <div>
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.processedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(
                          order.totalPrice.amount,
                          order.totalPrice.currencyCode
                        )}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {order.fulfillmentStatus.toLowerCase().replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Order items preview */}
                  <div className="flex gap-2 overflow-x-auto">
                    {order.lineItems.edges.slice(0, 4).map((edge, index) => {
                      const item = edge.node;
                      return (
                        <div key={index} className="shrink-0 w-16 h-[85px] bg-gray-100">
                          {item.variant?.image && (
                            <Image
                              src={item.variant.image.url}
                              alt={item.title}
                              width={64}
                              height={85}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                      );
                    })}
                    {order.lineItems.edges.length > 4 && (
                      <div className="shrink-0 w-16 h-[85px] bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-500">
                          +{order.lineItems.edges.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Address */}
        {customer.defaultAddress && (
          <section className="mt-8">
            <h2 className="text-lg font-medium mb-4">Default Address</h2>
            <div className="border border-gray-100 p-4">
              <p className="text-sm">
                {customer.defaultAddress.address1}
                {customer.defaultAddress.address2 && (
                  <>, {customer.defaultAddress.address2}</>
                )}
              </p>
              <p className="text-sm">
                {customer.defaultAddress.city}, {customer.defaultAddress.province}{' '}
                {customer.defaultAddress.zip}
              </p>
              <p className="text-sm">{customer.defaultAddress.country}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
