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
    toast.success('Welcome to the Thrift Factory family!');
  };

  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <Container size="sm">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get 10% Off Your First Order
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for exclusive drops, styling tips, 
            and member-only discounts. Join 50,000+ thrift lovers!
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 text-lg">
              <CheckCircle2 className="h-6 w-6" />
              <span>You&apos;re in! Check your email for your discount code.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12"
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

          <p className="text-sm text-primary-foreground/60 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </Container>
    </section>
  );
}
