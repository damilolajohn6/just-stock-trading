'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubscribed(true);
    toast.success('Welcome to the Just Stock Trading family!');
  };

  return (
    <section className="bg-primary py-16 text-primary-foreground lg:py-24">
      <Container size="sm">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Get 10% Off Your First Order</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80">
            Subscribe to our newsletter for exclusive drops, styling tips, and member-only
            discounts. Join 50,000+ thrift lovers!
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 text-lg">
              <CheckCircle2 className="h-6 w-6" />
              <span>You&apos;re in! Check your email for your discount code.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-white/20 bg-white/10 text-white placeholder:text-white/60"
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={isLoading}
                className="h-12 px-8"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="mt-4 text-sm text-primary-foreground/60">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </Container>
    </section>
  );
}
