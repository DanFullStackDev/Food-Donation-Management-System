// Supabase Configuration
// In production, these should be environment variables
const SUPABASE_CONFIG = {
    url: 'https://tksoxqulaxyaxvmethtt.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrc294cXVsYXh5YXh2bWV0aHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDY3MTcsImV4cCI6MjA3MjMyMjcxN30.P-6DVXzTrAYlrQwUSo866QJpSW5vBMiKdwa3CmtDwhc'
};

// For production, you would use environment variables like this:
// const SUPABASE_CONFIG = {
//     url: process.env.SUPABASE_URL || 'https://tksoxqulaxyaxvmethtt.supabase.co',
//     anonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key'
// };

export default SUPABASE_CONFIG;
