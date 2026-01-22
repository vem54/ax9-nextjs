import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Axent',
  description: 'Read the terms and conditions for using Axent website and services.',
};

export default function TermsPage() {
  return (
    <div className="container py-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-medium mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: January 2026</p>

        <div className="space-y-6 text-sm">
          <section>
            <h2 className="text-lg font-medium mb-3">Agreement to Terms</h2>
            <p className="text-gray-500">
              By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Use of Website</h2>
            <p className="text-gray-500 mb-3">
              You may use our website for lawful purposes only. You agree not to:
            </p>
            <ul className="text-gray-500 space-y-2">
              <li>Use the site in any way that violates applicable laws</li>
              <li>Attempt to gain unauthorized access to any part of the site</li>
              <li>Interfere with the proper functioning of the site</li>
              <li>Copy, reproduce, or distribute content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Products and Pricing</h2>
            <p className="text-gray-500 mb-3">
              We strive to display accurate product information and pricing. However, errors may occur. We reserve the right to:
            </p>
            <ul className="text-gray-500 space-y-2">
              <li>Correct any errors in pricing or product descriptions</li>
              <li>Cancel orders affected by pricing errors</li>
              <li>Limit quantities available for purchase</li>
              <li>Refuse or cancel orders at our discretion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Orders and Payment</h2>
            <p className="text-gray-500">
              All orders are subject to acceptance. We may refuse or cancel any order for any reason. Payment must be received in full before orders are shipped. We accept major credit cards and other payment methods as displayed at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Intellectual Property</h2>
            <p className="text-gray-500">
              All content on this website, including text, graphics, logos, images, and software, is the property of Axent or its content suppliers and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Limitation of Liability</h2>
            <p className="text-gray-500">
              To the fullest extent permitted by law, Axent shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website or products purchased.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Indemnification</h2>
            <p className="text-gray-500">
              You agree to indemnify and hold harmless Axent and its affiliates from any claims, damages, or expenses arising from your use of the website or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Changes to Terms</h2>
            <p className="text-gray-500">
              We may update these terms from time to time. Continued use of the website after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Contact</h2>
            <p className="text-gray-500">
              For questions about these terms, contact us at legal@axent.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
