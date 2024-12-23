import { APP_CONFIG } from '@/config/constants';

export function createSafeUrl(urlString: string): URL | null {
  if (!urlString) return null;
  
  try {
    // Remove any trailing slashes
    const cleanUrl = urlString.replace(/\/+$/, '');
    
    // If already a complete URL, use it directly
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return new URL(cleanUrl);
    }
    
    // Add https:// prefix if missing
    return new URL(`https://${cleanUrl}`);
  } catch {
    return null;
  }
}

export function getShareUrl(questionId: string): string {
  const baseUrl = APP_CONFIG.baseUrl || window.location.origin;
  return `${baseUrl}/questions/${questionId}`;
}