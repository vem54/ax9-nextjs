import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Axent curates contemporary Chinese streetwear and designer labels for a global audience.',
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
              Axent is a tightly edited platform for Chinese streetwear and contemporary
              designers. We focus on brands with a clear point of view, sharp construction,
              and a strong local following. We bring them to a global audience with the
              right context.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">Why Chinese Fashion</h2>
            <p className="text-gray-500 leading-relaxed">
              China is no longer only the factory floor. A new generation of designers is
              building culture-first labels with bold silhouettes, deliberate fabric choices,
              and a streetwear edge shaped by Shanghai, Beijing, and Chengdu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">What We Look For</h2>
            <ul className="text-gray-500 leading-relaxed space-y-2">
              <li>
                <strong className="text-black">Material integrity</strong> - Fabrics, trims,
                and finishes that feel considered.
              </li>
              <li>
                <strong className="text-black">Original design</strong> - Distinct silhouettes
                and a point of view that holds.
              </li>
              <li>
                <strong className="text-black">Cultural signal</strong> - Real demand in the
                local scene, not trend-chasing.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">The Experience</h2>
            <p className="text-gray-500 leading-relaxed">
              Every product includes accurate sizing guidance, material notes, and detailed
              photography. We handle international shipping and support so you can shop with
              confidence.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
