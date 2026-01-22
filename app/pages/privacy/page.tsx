import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Axent',
  description: 'Learn how Axent collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="container py-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-medium mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: January 2026</p>

        <div className="space-y-6 text-sm">
          <section>
            <h2 className="text-lg font-medium mb-3">Information We Collect</h2>
            <p className="text-gray-500 mb-3">
              When you visit our site, we collect basic device data such as browser type, IP address, time zone, and cookies used to run the storefront.
            </p>
            <p className="text-gray-500">
              When you place an order, we collect your name, billing and shipping address, payment information, email address, and phone number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">How We Use Your Information</h2>
            <ul className="text-gray-500 space-y-2">
              <li>To fulfill orders and process payments</li>
              <li>To communicate with you about your order</li>
              <li>To send marketing communications (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Information Sharing</h2>
            <p className="text-gray-500">
              We share information only with partners that help us process payments, fulfill orders, and provide support. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Cookies</h2>
            <p className="text-gray-500">
              We use cookies to remember preferences, keep items in your cart, and understand site usage. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Data Retention</h2>
            <p className="text-gray-500">
              We retain order information for our records unless you ask us to delete it. Account information is retained while your account is active.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Your Rights</h2>
            <p className="text-gray-500 mb-3">
              Depending on your location, you may have the right to:
            </p>
            <ul className="text-gray-500 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Security</h2>
            <p className="text-gray-500">
              We implement appropriate security measures to protect your personal information. Payment transactions are encrypted using SSL technology.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Contact</h2>
            <p className="text-gray-500">
              For questions about this privacy policy or your personal data, contact us at privacy@axent.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
