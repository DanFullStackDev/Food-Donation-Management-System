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
		attachEmailAuthHandlers();
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

// Email/password signup
async function signUpWithEmailPassword(email, password, metadata = {}) {
	try {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: metadata
			}
		});
		if (error) throw error;
		showNotification('Signup successful. Please check your email to confirm your account.', 'success');
		// If email confirmation is disabled, session may exist -> redirect
		if (data?.session) {
			redirectToDashboard();
		}
		return data;
	} catch (error) {
		console.error('Signup error:', error);
		showNotification(error.message || 'Signup failed. Please try again.', 'error');
		throw error;
	}
}

// Email/password login
async function signInWithEmailPassword(email, password) {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) throw error;
		showNotification('Logged in successfully!', 'success');
		redirectToDashboard();
		return data;
	} catch (error) {
		console.error('Login error:', error);
		showNotification(error.message || 'Login failed. Please check your credentials.', 'error');
		throw error;
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
		showNotification(error.message || 'Failed to sign out', 'error');
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
						<span class="user-provider">via ${currentUser.app_metadata?.provider || 'email'}</span>
					</div>
				</div>
				<button class="btn btn-outline" onclick="signOut()">
					<i class="fas fa-sign-out-alt"></i>
					Sign Out
				</button>
			</div>
		`;
		updateNavigationForUser();
	} else {
		// User is not authenticated - show email login entry point
		authContainer.innerHTML = `
			<button class="btn btn-primary" onclick="openModal('loginModal')">
				<i class="fas fa-sign-in-alt"></i>
				Login
			</button>
		`;
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
	const dashBtn = document.querySelector('.btn[onclick="openModal(\'dashboardModal\')"]');
	const profileBtn = document.querySelector('.btn[onclick="openModal(\'profileModal\')"]');
	if (dashBtn) {
		dashBtn.textContent = 'Login';
		dashBtn.onclick = () => openModal('loginModal');
		dashBtn.classList.remove('btn-secondary');
		dashBtn.classList.add('btn-primary');
	}
	if (profileBtn) {
		profileBtn.textContent = 'Sign Up';
		profileBtn.onclick = () => openModal('signupModal');
		profileBtn.classList.remove('btn-outline');
		profileBtn.classList.add('btn-secondary');
	}
}

// Helpers
function showNotification(message, type = 'info') {
	const existing = document.querySelector('.notification');
	if (existing) existing.remove();
	const el = document.createElement('div');
	el.className = `notification notification-${type}`;
	el.innerHTML = `
		<div class="notification-content">
			<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
			<span>${message}</span>
		</div>
		<button class="notification-close" onclick="this.parentElement.remove()">
			<i class="fas fa-times"></i>
		</button>
	`;
	document.body.appendChild(el);
	setTimeout(() => { if (el.parentElement) el.remove(); }, 5000);
}

function getCurrentUser() { return currentUser; }
function isAuthenticated() { return !!currentUser; }

function redirectToDashboard() {
	try { closeModal('loginModal'); } catch(_) {}
	try { closeModal('signupModal'); } catch(_) {}
	setTimeout(() => { try { openModal('dashboardModal'); } catch(_) {} }, 300);
}

// Attach handlers to existing login/signup forms
function attachEmailAuthHandlers() {
	// Login form
	const loginEmail = document.getElementById('loginEmail');
	const loginPassword = document.getElementById('loginPassword');
	if (loginEmail && loginPassword) {
		const loginForm = loginEmail.closest('form');
		if (loginForm && !loginForm.__supabaseBound) {
			loginForm.addEventListener('submit', async (e) => {
				e.preventDefault();
				const email = loginEmail.value.trim();
				const password = loginPassword.value;
				if (!email || !password) {
					showNotification('Please provide email and password.', 'error');
					return;
				}
				await signInWithEmailPassword(email, password).catch(() => {});
			});
			loginForm.__supabaseBound = true;
		}
	}
	// Signup form
	const signupEmail = document.getElementById('signupEmail');
	const signupPassword = document.getElementById('signupPassword');
	if (signupEmail && signupPassword) {
		const signupForm = signupEmail.closest('form');
		if (signupForm && !signupForm.__supabaseBound) {
			signupForm.addEventListener('submit', async (e) => {
				e.preventDefault();
				const email = signupEmail.value.trim();
				const password = signupPassword.value;
				const nameInput = document.getElementById('signupName');
				const roleInput = document.querySelector('input[name="role"]:checked');
				const metadata = { full_name: nameInput?.value || '', role: roleInput?.value || '' };
				if (!email || !password) {
					showNotification('Please provide email and password.', 'error');
					return;
				}
				await signUpWithEmailPassword(email, password, metadata).catch(() => {});
			});
			signupForm.__supabaseBound = true;
		}
	}
}

// Export functions for global access
window.supabase = supabase;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.showNotification = showNotification;
window.signUpWithEmailPassword = signUpWithEmailPassword;
window.signInWithEmailPassword = signInWithEmailPassword;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAuth);

export {
	supabase,
	signOut,
	signUpWithEmailPassword,
	signInWithEmailPassword,
	getCurrentUser,
	isAuthenticated,
	currentUser
};
