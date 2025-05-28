import { Session } from '@/features/account/session';

// Device type detection from user agent
export const getDeviceType = (userAgent?: string, deviceInfo?: Record<string, any>): string => {
  if (!userAgent && !deviceInfo) return 'unknown';

  const ua = userAgent?.toLowerCase() || '';
  const isMobile = deviceInfo?.mobile || ua.includes('mobile');
  const isTablet = ua.includes('tablet') || ua.includes('ipad');

  if (isMobile && !isTablet) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

// Browser detection from user agent
export const getBrowserName = (userAgent?: string, deviceInfo?: Record<string, any>): string => {
  if (deviceInfo?.browser) return deviceInfo.browser;
  if (!userAgent) return 'Unknown Browser';

  const ua = userAgent.toLowerCase();

  if (ua.includes('chrome') && !ua.includes('edge')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
  if (ua.includes('edge')) return 'Edge';
  if (ua.includes('opera')) return 'Opera';

  return 'Unknown Browser';
};

// OS detection from user agent
export const getOperatingSystem = (
  userAgent?: string,
  deviceInfo?: Record<string, any>
): string => {
  if (deviceInfo?.os) return deviceInfo.os;
  if (!userAgent) return 'Unknown OS';

  const ua = userAgent.toLowerCase();

  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('mac os')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('ios')) return 'iOS';

  return 'Unknown OS';
};

// Format session location
export const formatSessionLocation = (session: Session): string => {
  if (session.location && session.location !== 'Unknown') {
    return session.location;
  }

  if (session.ip_address) {
    return session.ip_address;
  }

  return 'Unknown Location';
};

// Check if session is current/active
export const isCurrentSession = (session: Session, currentSessionId?: string): boolean => {
  if (currentSessionId) {
    return session.id === currentSessionId;
  }

  // Fallback: assume most recently accessed active session is current
  return session.is_active && !!session.last_access_at;
};

// Sort sessions by priority (current first, then by last access)
export const sortSessionsByPriority = (
  sessions: Session[],
  currentSessionId?: string
): Session[] => {
  return [...sessions].sort((a, b) => {
    // Current session first
    const aIsCurrent = isCurrentSession(a, currentSessionId);
    const bIsCurrent = isCurrentSession(b, currentSessionId);

    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;

    // Active sessions before inactive
    if (a.is_active && !b.is_active) return -1;
    if (!a.is_active && b.is_active) return 1;

    // Sort by last access time (most recent first)
    const aLastAccess = a.last_access_at || 0;
    const bLastAccess = b.last_access_at || 0;

    return bLastAccess - aLastAccess;
  });
};

// Session security score (for displaying security indicators)
export const getSessionSecurityScore = (session: Session): number => {
  let score = 0;

  // Recent activity
  if (session.last_access_at) {
    const daysSinceAccess = (Date.now() - session.last_access_at) / (1000 * 60 * 60 * 24);
    if (daysSinceAccess < 1) score += 3;
    else if (daysSinceAccess < 7) score += 2;
    else score += 1;
  }

  // Known device info
  if (session.device_info && Object.keys(session.device_info).length > 0) score += 2;

  // Login method security
  if (session.login_method) {
    if (session.login_method === 'email_code') score += 3;
    else if (session.login_method === 'password') score += 2;
    else score += 1;
  }

  // Location info available
  if (session.location && session.location !== 'Unknown') score += 1;

  return Math.min(score, 10); // Cap at 10
};

// Format session duration
export const formatSessionDuration = (session: Session): string => {
  if (!session.created_at) return 'Unknown';

  const now = Date.now();
  const created = session.created_at;
  const durationMs = now - created;

  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return 'Just now';
};

// Check if session is expired
export const isSessionExpired = (session: Session): boolean => {
  if (!session.expires_at) return false;
  return Date.now() > session.expires_at;
};

// Get session risk level
export const getSessionRiskLevel = (session: Session): 'low' | 'medium' | 'high' => {
  if (!session.is_active) return 'high';
  if (isSessionExpired(session)) return 'high';

  const securityScore = getSessionSecurityScore(session);

  if (securityScore >= 7) return 'low';
  if (securityScore >= 4) return 'medium';
  return 'high';
};
