import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Axent - Curated Chinese fashion for the global market.',
};

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-medium mb-8 text-center">About Axent</h1>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-medium mb-4">Our Mission</h2>
            <p className="text-gray-500 leading-relaxed">
              Axent is a curated marketplace for Chinese fashion brands. We believe Chinese
              designers have mastered both quality and design, and what&apos;s popular domestically
              will resonate globally. We&apos;re the bridge.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">Why Chinese Fashion</h2>
            <p className="text-gray-500 leading-relaxed">
              China isn&apos;t just the world&apos;s manufacturer anymore. A new generation of designers
              trained at Central Saint Martins, Parsons, and top Chinese academies are creating
              original work that rivals anything coming out of Paris or Milan. We discover,
              vet, and bring these brands to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">What We Look For</h2>
            <ul className="text-gray-500 leading-relaxed space-y-2">
              <li>
                <strong className="text-black">Quality materials</strong> - Premium fabrics,
                proper construction, attention to detail.
              </li>
              <li>
                <strong className="text-black">Original design</strong> - Not knockoffs.
                Designers with a clear point of view.
              </li>
              <li>
                <strong className="text-black">Proven demand</strong> - Already successful in
                China&apos;s competitive market.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">The Experience</h2>
            <p className="text-gray-500 leading-relaxed">
              Every product includes detailed materials information, accurate sizing charts,
              and high-quality photography. We handle international shipping and customer
              service so you can shop with confidence.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
