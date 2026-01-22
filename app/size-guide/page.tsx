import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Size Guide',
  description: 'Find your perfect fit with Axent size charts and measurement guides.',
};

export default function SizeGuidePage() {
  return (
    <div className="container py-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-medium mb-6">Size Guide</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-medium mb-3">How to Measure</h2>
            <p className="text-sm text-gray-500 mb-4">
              For the most accurate fit, measure over light clothing. Use a soft tape and keep it parallel to the floor.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100">
                <h3 className="text-sm font-medium mb-2">Chest</h3>
                <p className="text-sm text-gray-500">
                  Measure around the fullest part of your chest, keeping the tape under your arms.
                </p>
              </div>
              <div className="p-4 bg-gray-100">
                <h3 className="text-sm font-medium mb-2">Waist</h3>
                <p className="text-sm text-gray-500">
                  Measure around your natural waistline, keeping the tape comfortably loose.
                </p>
              </div>
              <div className="p-4 bg-gray-100">
                <h3 className="text-sm font-medium mb-2">Hips</h3>
                <p className="text-sm text-gray-500">
                  Measure around the fullest part of your hips, approximately 20 cm below your waist.
                </p>
              </div>
              <div className="p-4 bg-gray-100">
                <h3 className="text-sm font-medium mb-2">Shoulder</h3>
                <p className="text-sm text-gray-500">
                  Measure from the edge of one shoulder to the other across your back.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Tops Size Chart</h2>
            <div className="border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-3 text-left font-medium">Size</th>
                    <th className="p-3 text-left font-medium">Chest (cm)</th>
                    <th className="p-3 text-left font-medium">Shoulder (cm)</th>
                    <th className="p-3 text-left font-medium">Length (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-500">
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-black">S</td>
                    <td className="p-3">96-100</td>
                    <td className="p-3">44-46</td>
                    <td className="p-3">68-70</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-black">M</td>
                    <td className="p-3">100-104</td>
                    <td className="p-3">46-48</td>
                    <td className="p-3">70-72</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-black">L</td>
                    <td className="p-3">104-108</td>
                    <td className="p-3">48-50</td>
                    <td className="p-3">72-74</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-black">XL</td>
                    <td className="p-3">108-112</td>
                    <td className="p-3">50-52</td>
                    <td className="p-3">74-76</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Bottoms Size Chart</h2>
            <div className="border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-3 text-left font-medium">Size</th>
                    <th className="p-3 text-left font-medium">Waist (cm)</th>
                    <th className="p-3 text-left font-medium">Hips (cm)</th>
                    <th className="p-3 text-left font-medium">Inseam (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-500">
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-black">S / 28</td>
                    <td className="p-3">72-76</td>
                    <td className="p-3">92-96</td>
                    <td className="p-3">76</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-black">M / 30</td>
                    <td className="p-3">76-80</td>
                    <td className="p-3">96-100</td>
                    <td className="p-3">77</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-black">L / 32</td>
                    <td className="p-3">80-84</td>
                    <td className="p-3">100-104</td>
                    <td className="p-3">78</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-black">XL / 34</td>
                    <td className="p-3">84-88</td>
                    <td className="p-3">104-108</td>
                    <td className="p-3">79</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Fit Notes</h2>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>Our pieces follow Asian sizing and may run smaller than Western sizing.</li>
              <li>If you are between sizes, size up.</li>
              <li>Product pages include measurements when provided by the brand.</li>
              <li>Many pieces are intentionally oversized or relaxed.</li>
            </ul>
          </section>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Need sizing advice?{' '}
              <Link href="/contact" className="underline hover:no-underline">
                Contact us
              </Link>{' '}
              with the product name and your measurements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
