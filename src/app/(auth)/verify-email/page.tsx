'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { resendVerificationEmail } from '@/actions/auth';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error('No email address provided');
      return;
    }

    setIsResending(true);
    
    try {
      const result = await resendVerificationEmail(email);
      
      if (result.success) {
        toast.success('Verification email sent!');
      } else {
        toast.error(result.error || 'Failed to send email');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-6 w-6 text-primary" />
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
      
      <p className="text-muted-foreground mt-2 mb-6">
        We&apos;ve sent a verification link to{' '}
        {email ? (
          <span className="font-medium text-foreground">{email}</span>
        ) : (
          'your email address'
        )}
        . Please check your inbox and click the link to activate your account.
      </p>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or
        </p>
        
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isResending || !email}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Resend verification email'
          )}
        </Button>
      </div>

      <p className="mt-8">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
