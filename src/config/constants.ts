export const APP_CONFIG = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  baseUrl: import.meta.env.VITE_APP_URL || '',
  pagination: {
    defaultLimit: 10,
  },
  dateFormat: {
    locale: 'zh-CN',
  },
} as const;