import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About',
  description: 'Axent curates contemporary Chinese streetwear and designer labels for a global audience.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cream">
        <div className="container py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="eyebrow mb-6">Our Story</p>
            <h1 className="display-hero mb-8">
              The next chapter of fashion is being written{' '}
              <span className="editorial-accent">in the East.</span>
            </h1>
            <div className="divider mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow mb-5">Our Mission</p>
            <h2 className="display-md mb-8">
              A tightly edited platform for{' '}
              <span className="editorial-accent">Chinese streetwear</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Axent focuses on brands with a clear point of view, sharp construction,
              and a strong local following. We bring them to a global audience with the
              right context.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              China is no longer only the factory floor. A new generation of designers is
              building culture-first labels with bold silhouettes, deliberate fabric choices,
              and a streetwear edge shaped by Shanghai, Beijing, and Chengdu.
            </p>
          </div>
          <div className="relative aspect-[4/5] bg-gray-100">
            <Image
              src="/images/editorial/atelier.jpg"
              alt="Designer atelier"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="bg-stone">
        <div className="container py-20 lg:py-28">
          <div className="max-w-4xl mx-auto">
            <p className="eyebrow mb-5 text-center">Curation</p>
            <h2 className="display-lg text-center mb-16">What We Look For</h2>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="font-serif text-6xl text-gray-300 mb-6">01</div>
                <h3 className="heading-lg mb-4">Material Integrity</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fabrics, trims, and finishes that feel considered. Quality you can touch.
                </p>
              </div>
              <div className="text-center">
                <div className="font-serif text-6xl text-gray-300 mb-6">02</div>
                <h3 className="heading-lg mb-4">Original Design</h3>
                <p className="text-gray-600 leading-relaxed">
                  Distinct silhouettes and a point of view that holds across seasons.
                </p>
              </div>
              <div className="text-center">
                <div className="font-serif text-6xl text-gray-300 mb-6">03</div>
                <h3 className="heading-lg mb-4">Cultural Signal</h3>
                <p className="text-gray-600 leading-relaxed">
                  Real demand in the local scene, not trend-chasing or hype-driven.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="container py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] bg-gray-100 order-2 lg:order-1">
            <Image
              src="/images/editorial/fabric.jpg"
              alt="Fabric detail"
              fill
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow mb-5">The Experience</p>
            <h2 className="display-md mb-8">
              Shop with <span className="editorial-accent">confidence</span>
            </h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="font-mono text-sm text-gray-400">→</span>
                <div>
                  <h4 className="heading-sm mb-2">Accurate Sizing</h4>
                  <p className="text-gray-600">Detailed measurements and fit notes for every piece.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-sm text-gray-400">→</span>
                <div>
                  <h4 className="heading-sm mb-2">Material Notes</h4>
                  <p className="text-gray-600">Composition, weight, and care instructions included.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-sm text-gray-400">→</span>
                <div>
                  <h4 className="heading-sm mb-2">Global Shipping</h4>
                  <p className="text-gray-600">Fast delivery worldwide with full tracking.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-sm text-gray-400">→</span>
                <div>
                  <h4 className="heading-sm mb-2">Easy Returns</h4>
                  <p className="text-gray-600">14-day return window on eligible items.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-black text-white">
        <div className="container py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="quote text-white mb-8">
              &ldquo;We believe the best fashion comes from designers who build for their own culture first, 
              then share it with the world.&rdquo;
            </blockquote>
            <p className="eyebrow text-gray-500">— The Axent Team</p>
          </div>
        </div>
      </section>
    </div>
  );
}
