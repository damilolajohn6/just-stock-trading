import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';

const instagramPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80',
    likes: 234,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
    likes: 189,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
    likes: 312,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80',
    likes: 156,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80',
    likes: 278,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
    likes: 421,
  },
];

export function InstagramFeed() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Follow Our Journey
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Join our community on Instagram for daily inspiration and new drops
          </p>
          <Button asChild variant="outline">
            <Link
              href="https://instagram.com/thriftfactory"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="mr-2 h-4 w-4" />
              @thriftfactory
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {instagramPosts.map((post) => (
            <Link
              key={post.id}
              href="https://instagram.com/thriftfactory"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={post.image}
                alt="Instagram post"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center">
                  <Instagram className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">{post.likes} likes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
