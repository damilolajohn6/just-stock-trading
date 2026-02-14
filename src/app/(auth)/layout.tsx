import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Just Stock Trading </span>
          </Link>

          {children}
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-thrift-sage/90" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4">
              Sustainable Fashion, Incredible Prices
            </h2>
            <p className="text-lg opacity-90">
              Join thousands of thrift lovers discovering unique, pre-loved fashion 
              that&apos;s good for your wallet and the planet.
            </p>

            <div className="mt-8 flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm opacity-75">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-75">Items Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-75">Sustainable</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
