const CONFIG = {
  SUPABASE_URL: 'https://pepyailhixwkzqbwidrp.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlcHlhaWxoaXh3a3pxYndpZHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTUyNDYsImV4cCI6MjA5NDc5MTI0Nn0.sI--EyXV4G-cx8r9B5ut1aGSTwy2KNsg-IU4owuj4WU',
  AI_ENDPOINT: '/.netlify/functions/ai',
  CREDITS: {
    NEW_USER: 200,
    PER_CORRECT: 10,
    COMPLETE_BONUS: 50
  },
  QUIZ_COUNT: 5,
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'cn', 'es', 'ko', 'vi']
};

const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
