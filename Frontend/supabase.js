import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
import SUPABASE_CONFIG from './config.js';

// Initialize Supabase client
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Authentication state management
let currentUser = null;
let authListener = null;

// Initialize authentication listener
function initializeAuth() {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
        currentUser = session?.user || null;
        updateAuthUI();
    });

    // Listen for auth changes
    authListener = supabase.auth.onAuthStateChange((event, session) => {
        currentUser = session?.user || null;
        updateAuthUI();
        
        if (event === 'SIGNED_IN') {
            showNotification('Successfully signed in!', 'success');
        } else if (event === 'SIGNED_OUT') {
            showNotification('Signed out successfully', 'info');
        }
    });
}

// GitHub OAuth sign in
async function signInWithGitHub() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
        
        showNotification('Redirecting to GitHub...', 'info');
    } catch (error) {
        console.error('Error signing in with GitHub:', error);
        showNotification('Failed to sign in with GitHub', 'error');
    }
}

// Sign out
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        currentUser = null;
        updateAuthUI();
    } catch (error) {
        console.error('Error signing out:', error);
        showNotification('Failed to sign out', 'error');
    }
}

// Update authentication UI
function updateAuthUI() {
    const authContainer = document.getElementById('authContainer');
    if (!authContainer) return;

    if (currentUser) {
        // User is authenticated
        authContainer.innerHTML = `
            <div class="auth-user">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <span class="user-email">${currentUser.email}</span>
                        <span class="user-provider">via ${currentUser.app_metadata?.provider || 'GitHub'}</span>
                    </div>
                </div>
                <button class="btn btn-outline" onclick="signOut()">
                    <i class="fas fa-sign-out-alt"></i>
                    Sign Out
                </button>
            </div>
        `;
        
        // Update navigation buttons
        updateNavigationForUser();
    } else {
        // User is not authenticated
        authContainer.innerHTML = `
            <button class="btn btn-github" onclick="signInWithGitHub()">
                <i class="fab fa-github"></i>
                Login with GitHub
            </button>
        `;
        
        // Reset navigation buttons
        resetNavigation();
    }
}

// Update navigation for authenticated user
function updateNavigationForUser() {
    const loginBtn = document.querySelector('.btn[onclick="openModal(\'loginModal\')"]');
    const signupBtn = document.querySelector('.btn[onclick="openModal(\'signupModal\')"]');
    
    if (loginBtn) {
        loginBtn.textContent = 'Dashboard';
        loginBtn.onclick = () => openModal('dashboardModal');
        loginBtn.classList.remove('btn-primary');
        loginBtn.classList.add('btn-secondary');
    }
    
    if (signupBtn) {
        signupBtn.textContent = 'Profile';
        signupBtn.onclick = () => openModal('profileModal');
        signupBtn.classList.remove('btn-secondary');
        signupBtn.classList.add('btn-outline');
    }
}

// Reset navigation to default state
function resetNavigation() {
    const loginBtn = document.querySelector('.btn[onclick="openModal(\'dashboardModal\')"]');
    const signupBtn = document.querySelector('.btn[onclick="openModal(\'profileModal\')"]');
    
    if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => openModal('loginModal');
        loginBtn.classList.remove('btn-secondary');
        loginBtn.classList.add('btn-primary');
    }
    
    if (signupBtn) {
        signupBtn.textContent = 'Sign Up';
        signupBtn.onclick = () => openModal('signupModal');
        signupBtn.classList.remove('btn-outline');
        signupBtn.classList.add('btn-secondary');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Check if user is authenticated
function isAuthenticated() {
    return !!currentUser;
}

// Export functions for global access
window.supabase = supabase;
window.signInWithGitHub = signInWithGitHub;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.showNotification = showNotification;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAuth);

export {
    supabase,
    signInWithGitHub,
    signOut,
    getCurrentUser,
    isAuthenticated,
    currentUser
};
