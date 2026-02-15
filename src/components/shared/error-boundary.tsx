'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary Caught:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-destructive/5 my-4">
          <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            {this.state.error?.message || 'An unexpected error occurred while loading this section.'}
          </p>
          <Button 
            variant="outline" 
            onClick={this.reset}
            className="border-destructive/20 hover:bg-destructive/10 text-destructive"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
