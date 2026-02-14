// Client-side
export { createClient, getClient } from './client';

// Server-side
export { 
  createClient as createServerClient,
  getSession,
  getUser,
  getUserWithProfile,
} from './server';

// Admin (server-only)
export { createAdminClient, isUserAdmin, getUserByEmail } from './admin';

// Middleware
export { createMiddlewareClient } from './middleware';
