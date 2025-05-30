// Public routes that don't require authentication
export const PUBLIC_ROUTES = ['/login', '/register', '/forget-password', '/logout'];

export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ROUTES.some(route => path.startsWith(route));
};
