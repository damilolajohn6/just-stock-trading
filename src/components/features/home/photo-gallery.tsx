import Image from 'next/image';
import { Container } from '@/components/shared/container';
import { cn } from '@/utils/cn';

const photos = [
  {
    src: '/images/aaa.jpeg',
    alt: 'Bale of branded clothing with Missguided, Next, and Marvel tags',
    span: 'row-span-2',
  },
  {
    src: '/images/c.jpeg',
    alt: 'Large bale of branded clothing with Boohoo and House tags',
    span: '',
  },
  {
    src: '/images/dd.jpeg',
    alt: 'Close-up of stacked bales with Puma, Boohoo, and Next tags',
    span: '',
  },
  {
    src: '/images/d.jpeg',
    alt: 'Colourful bale of clothing with Superdry and George tags',
    span: 'row-span-2',
  },
  {
    src: '/images/cc.jpeg',
    alt: 'Open bag of mixed clothing items',
    span: '',
  },
  {
    src: '/images/ddd.jpeg',
    alt: 'Two bales of clothing with Pull&Bear, Adidas, and New Look tags',
    span: '',
  },
  {
    src: '/images/ccc.jpeg',
    alt: 'Bale of clothing with Reserved, Mohito, and M&S tags',
    span: 'row-span-2',
  },
  {
    src: '/images/aa.jpeg',
    alt: 'Cream Grade and New With Tags clothing promo',
    span: '',
  },
  {
    src: '/images/bbbb.jpeg',
    alt: 'Wall of stacked bales in warehouse',
    span: '',
  },
];

export function PhotoGallery() {
  return (
    <section className="overflow-hidden bg-zinc-950 py-16 text-white lg:py-24">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">See Our Stock</h2>
          <p className="mx-auto max-w-xl text-lg text-zinc-400">
            Thousands of bales packed with branded clothing, ready to ship.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[250px] sm:gap-4 md:grid-cols-3 lg:auto-rows-[300px]">
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className={cn(
                'group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl',
                photo.span
              )}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
