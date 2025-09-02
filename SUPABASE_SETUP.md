# Supabase Integration Setup Guide

This guide will help you set up Supabase with GitHub OAuth authentication for your FoodShare application.

## 🚀 Quick Start

### 1. Supabase Project Setup

1. **Go to [Supabase](https://supabase.com)** and sign in
2. **Create a new project** or use your existing one
3. **Note your project URL and anon key** from Settings > API

### 2. GitHub OAuth Setup

1. **Go to GitHub Settings > Developer settings > OAuth Apps**
2. **Create a new OAuth App** with these settings:
   - **Application name**: FoodShare (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `https://tksoxqulaxyaxvmethtt.supabase.co/auth/v1/callback`

3. **Copy the Client ID and Client Secret**

### 3. Configure Supabase Auth

1. **In your Supabase dashboard**, go to **Authentication > Providers**
2. **Enable GitHub provider**
3. **Enter your GitHub OAuth credentials**:
   - Client ID: Your GitHub OAuth App Client ID
   - Client Secret: Your GitHub OAuth App Client Secret

### 4. Update Configuration

1. **Open `config.js`** and update with your credentials:
```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

## 📁 File Structure

```
Frontend/
├── index.html          # Main application with Supabase integration
├── demo.html           # Demo page for testing authentication
├── config.js           # Supabase configuration (secure)
├── supabase.js         # Supabase client and auth functions
├── styles.css          # Updated styles for auth UI
├── script.js           # Your existing application logic
└── SUPABASE_SETUP.md   # This setup guide
```

## 🔧 Configuration Details

### Environment Variables (Production)

For production, use environment variables instead of hardcoded values:

```javascript
// config.js (production)
const SUPABASE_CONFIG = {
    url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key'
};
```

### Local Development

For local development, you can use the current setup with your credentials.

## 🎯 Features Implemented

### ✅ Authentication
- **GitHub OAuth** integration
- **Automatic session management**
- **Real-time auth state updates**
- **Secure token handling**

### ✅ User Interface
- **Dynamic auth container** in navigation
- **Beautiful GitHub login button**
- **User profile display** when authenticated
- **Smooth sign out functionality**

### ✅ Notifications
- **Toast notifications** for auth events
- **Success/Error/Info** message types
- **Auto-dismiss** after 5 seconds
- **Responsive design**

## 🧪 Testing the Integration

### 1. Open the Demo Page
- Navigate to `demo.html` in your browser
- This page is specifically designed to test authentication

### 2. Test Authentication Flow
1. **Click "Login with GitHub"**
2. **Authorize the application** on GitHub
3. **Verify you're redirected back** to your app
4. **Check the authentication status** updates

### 3. Test Sign Out
1. **Click "Sign Out"** when authenticated
2. **Verify the UI updates** to show login button
3. **Check notifications** appear correctly

## 🔒 Security Considerations

### Current Implementation
- ✅ **Client-side validation**
- ✅ **Secure OAuth flow**
- ✅ **No hardcoded secrets** in production
- ✅ **HTTPS redirects** for production

### Production Recommendations
- 🔒 **Use environment variables**
- 🔒 **Enable HTTPS** on your domain
- 🔒 **Set up proper redirect URLs**
- 🔒 **Monitor authentication logs**

## 🐛 Troubleshooting

### Common Issues

#### 1. "Invalid redirect URL" Error
- **Check your GitHub OAuth App** callback URL
- **Verify Supabase project URL** matches
- **Ensure HTTPS** for production URLs

#### 2. Authentication Not Working
- **Check browser console** for errors
- **Verify Supabase credentials** in config.js
- **Check GitHub OAuth App** settings

#### 3. UI Not Updating
- **Refresh the page** after authentication
- **Check JavaScript console** for errors
- **Verify all script files** are loaded

### Debug Mode

Enable debug logging by adding this to your browser console:

```javascript
localStorage.setItem('supabase.debug', 'true');
```

## 📱 Mobile Testing

### Responsive Design
- **Test on mobile devices**
- **Check hamburger menu** functionality
- **Verify auth container** responsiveness
- **Test touch interactions**

### Browser Compatibility
- **Chrome** (recommended for development)
- **Firefox** (test OAuth flow)
- **Safari** (test on iOS)
- **Edge** (test on Windows)

## 🚀 Next Steps

### 1. Database Integration
- **Create user profiles table**
- **Store user preferences**
- **Link donations/requests** to users

### 2. Advanced Features
- **Email verification**
- **Password reset**
- **Social login options** (Google, Facebook)
- **Two-factor authentication**

### 3. Production Deployment
- **Set up environment variables**
- **Configure custom domain**
- **Enable SSL certificates**
- **Set up monitoring**

## 📞 Support

### Supabase Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

### GitHub OAuth
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [GitHub Developer Settings](https://github.com/settings/developers)

## 🎉 Success!

Once you've completed this setup, you'll have:
- ✅ **Working GitHub authentication**
- ✅ **Beautiful, responsive UI**
- ✅ **Secure credential management**
- ✅ **Professional user experience**

Your FoodShare application is now ready for real users with secure authentication!

---

**Need help?** Check the troubleshooting section above or reach out to the Supabase community.
