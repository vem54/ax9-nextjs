'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // In a real app, you'd send this to an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-medium mb-4">Thank You</h1>
          <p className="text-gray-500 mb-6">
            We&apos;ve received your message and will get back to you within 24-48 hours.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="secondary">
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-medium mb-2 text-center">Contact Us</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Questions about an order or product? We&apos;re here to help.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div>
            <label className="block text-sm mb-2">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-3 text-sm border border-black bg-white"
              required
            >
              <option value="">Select a subject</option>
              <option value="order">Order Inquiry</option>
              <option value="shipping">Shipping Question</option>
              <option value="returns">Returns & Exchanges</option>
              <option value="product">Product Question</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-3 py-3 text-sm border border-black bg-white resize-none"
              required
            />
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Send Message
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Need immediate help?
          </p>
          <a
            href="mailto:support@axent.com"
            className="text-sm underline hover:no-underline"
          >
            support@axent.com
          </a>
        </div>
      </div>
    </div>
  );
}
