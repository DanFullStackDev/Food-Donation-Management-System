// Food Donation Management System - JavaScript

// Global variables
let currentUser = null;
let donations = [];
let requests = [];
let availableFood = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
});

// Initialize the application
function initializeApp() {
    // Set minimum date for expiry date input to today
    const today = new Date().toISOString().split('T')[0];
    const expiryInputs = document.querySelectorAll('input[type="date"]');
    expiryInputs.forEach(input => {
        if (input.id === 'expiryDate') {
            input.min = today;
        }
    });

    // Initialize mobile navigation
    setupMobileNavigation();
    
    // Initialize smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Initialize form validation
    setupFormValidation();
}

// Setup event listeners
function setupEventListeners() {
    // Form submissions
    document.querySelector('.auth-form')?.addEventListener('submit', handleAuthSubmit);
    document.querySelector('.donation-form')?.addEventListener('submit', handleDonationSubmit);
    document.querySelector('.request-form')?.addEventListener('submit', handleRequestSubmit);
    document.querySelector('.contact-form')?.addEventListener('submit', handleContactSubmit);

    // Modal close on outside click
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });

    // Close modals when clicking close button
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            closeModal(modalId);
        });
    });
}

// Mobile Navigation Setup
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Validation Setup
function setupFormValidation() {
    // Real-time validation for email fields
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', validateEmail);
    });

    // Real-time validation for phone fields
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('blur', validatePhone);
    });

    // Real-time validation for required fields
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        input.addEventListener('blur', validateRequired);
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on first input if it exists
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Clear form if it exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            clearFormMessages(form);
        }
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function switchModal(fromModalId, toModalId) {
    closeModal(fromModalId);
    openModal(toModalId);
}

// Dashboard Tab Functions
function switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Load data for the selected tab
    loadTabData(tabName);
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'donations':
            displayDonations();
            break;
        case 'requests':
            displayRequests();
            break;
        case 'available':
            displayAvailableFood();
            break;
    }
}

// Form Handling Functions
function handleAuthSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    if (validateForm(form)) {
        // Simulate authentication
        showFormMessage(form, 'Logging in...', 'success');
        
        setTimeout(() => {
            if (form.classList.contains('auth-form')) {
                const email = form.querySelector('input[type="email"]').value;
                const password = form.querySelector('input[type="password"]').value;
                
                // Simple validation (in real app, this would be server-side)
                if (email && password) {
                    currentUser = {
                        email: email,
                        name: form.querySelector('input[type="text"]')?.value || 'User',
                        role: form.querySelector('input[name="role"]:checked')?.value || 'donor'
                    };
                    
                    showFormMessage(form, 'Authentication successful!', 'success');
                    setTimeout(() => {
                        closeModal(form.closest('.modal').id);
                        updateUIForUser();
                    }, 1500);
                } else {
                    showFormMessage(form, 'Please fill in all required fields.', 'error');
                }
            }
        }, 1000);
    }
}

function handleDonationSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    if (validateForm(form)) {
        const formData = new FormData(form);
        const donation = {
            id: Date.now(),
            foodType: formData.get('foodType'),
            quantity: formData.get('quantity'),
            expiryDate: formData.get('expiryDate'),
            pickupLocation: formData.get('pickupLocation'),
            description: formData.get('description'),
            contactPhone: formData.get('contactPhone'),
            status: 'pending',
            dateSubmitted: new Date().toISOString(),
            donor: currentUser?.name || 'Anonymous'
        };
        
        donations.push(donation);
        showFormMessage(form, 'Donation submitted successfully!', 'success');
        
        setTimeout(() => {
            closeModal('donationModal');
            if (currentUser) {
                updateDashboard();
            }
        }, 1500);
    }
}

function handleRequestSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    if (validateForm(form)) {
        const formData = new FormData(form);
        const request = {
            id: Date.now(),
            orgName: formData.get('orgName'),
            orgType: formData.get('orgType'),
            peopleCount: formData.get('peopleCount'),
            foodNeeds: formData.get('foodNeeds'),
            deliveryAddress: formData.get('deliveryAddress'),
            urgent: formData.get('urgent'),
            orgContact: formData.get('orgContact'),
            status: 'pending',
            dateSubmitted: new Date().toISOString(),
            organization: currentUser?.name || 'Anonymous'
        };
        
        requests.push(request);
        showFormMessage(form, 'Request submitted successfully!', 'success');
        
        setTimeout(() => {
            closeModal('requestModal');
            if (currentUser) {
                updateDashboard();
            }
        }, 1500);
    }
}

function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    if (validateForm(form)) {
        showFormMessage(form, 'Thank you for your message! We\'ll get back to you soon.', 'success');
        form.reset();
    }
}

// Form Validation Functions
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    // Date validation
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate < today) {
            showFieldError(field, 'Date cannot be in the past');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateEmail(event) {
    const field = event.target;
    validateField(field);
}

function validatePhone(event) {
    const field = event.target;
    validateField(field);
}

function validateRequired(event) {
    const field = event.target;
    validateField(field);
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#f44336';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Form Message Functions
function showFormMessage(form, message, type) {
    clearFormMessages(form);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    form.insertBefore(messageDiv, form.firstChild);
}

function clearFormMessages(form) {
    const messages = form.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
}

// Dashboard Functions
function displayDonations() {
    const grid = document.getElementById('donationsGrid');
    if (!grid) return;
    
    if (donations.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No donations yet. Start by making your first donation!</p>';
        return;
    }
    
    grid.innerHTML = donations.map(donation => `
        <div class="donation-card">
            <div class="card-header">
                <h4>${donation.foodType}</h4>
                <span class="card-status status-${donation.status}">${donation.status}</span>
            </div>
            <div class="card-details">
                <div class="card-detail">
                    <span>Quantity:</span>
                    <span>${donation.quantity}</span>
                </div>
                <div class="card-detail">
                    <span>Expiry:</span>
                    <span>${formatDate(donation.expiryDate)}</span>
                </div>
                <div class="card-detail">
                    <span>Location:</span>
                    <span>${donation.pickupLocation}</span>
                </div>
                <div class="card-detail">
                    <span>Submitted:</span>
                    <span>${formatDate(donation.dateSubmitted)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function displayRequests() {
    const grid = document.getElementById('requestsGrid');
    if (!grid) return;
    
    if (requests.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No requests yet. Start by making your first request!</p>';
        return;
    }
    
    grid.innerHTML = requests.map(request => `
        <div class="request-card">
            <div class="card-header">
                <h4>${request.orgName}</h4>
                <span class="card-status status-${request.status}">${request.status}</span>
            </div>
            <div class="card-details">
                <div class="card-detail">
                    <span>Type:</span>
                    <span>${request.orgType}</span>
                </div>
                <div class="card-detail">
                    <span>People:</span>
                    <span>${request.peopleCount}</span>
                </div>
                <div class="card-detail">
                    <span>Urgency:</span>
                    <span>${request.urgent}</span>
                </div>
                <div class="card-detail">
                    <span>Submitted:</span>
                    <span>${formatDate(request.dateSubmitted)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function displayAvailableFood() {
    const grid = document.getElementById('availableGrid');
    if (!grid) return;
    
    if (availableFood.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No food available at the moment. Check back later!</p>';
        return;
    }
    
    grid.innerHTML = availableFood.map(food => `
        <div class="available-card">
            <div class="card-header">
                <h4>${food.foodType}</h4>
                <span class="card-status status-${food.status}">${food.status}</span>
            </div>
            <div class="card-details">
                <div class="card-detail">
                    <span>Quantity:</span>
                    <span>${food.quantity}</span>
                </div>
                <div class="card-detail">
                    <span>Expiry:</span>
                    <span>${formatDate(food.expiryDate)}</span>
                </div>
                <div class="card-detail">
                    <span>Location:</span>
                    <span>${food.pickupLocation}</span>
                </div>
                <div class="card-detail">
                    <span>Donor:</span>
                    <span>${food.donor}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function updateUIForUser() {
    if (currentUser) {
        // Update navigation
        const authButtons = document.querySelectorAll('.btn[onclick*="Modal"]');
        authButtons.forEach(btn => {
            if (btn.onclick.toString().includes('loginModal')) {
                btn.textContent = `Welcome, ${currentUser.name}`;
                btn.onclick = () => openModal('dashboardModal');
            } else if (btn.onclick.toString().includes('signupModal')) {
                btn.textContent = 'Dashboard';
                btn.onclick = () => openModal('dashboardModal');
            }
        });
        
        // Update dashboard
        updateDashboard();
    }
}

function updateDashboard() {
    if (currentUser) {
        // Filter data based on user role
        if (currentUser.role === 'donor') {
            // Show user's donations and available food
            displayDonations();
            displayAvailableFood();
        } else {
            // Show user's requests and available food
            displayRequests();
            displayAvailableFood();
        }
    }
}

// Load Sample Data
function loadSampleData() {
    // Sample donations
    donations = [
        {
            id: 1,
            foodType: 'Fruits & Vegetables',
            quantity: '5 kg',
            expiryDate: '2024-02-15',
            pickupLocation: 'Central Market, Downtown',
            description: 'Fresh organic fruits and vegetables',
            contactPhone: '+1-555-0123',
            status: 'pending',
            dateSubmitted: '2024-01-20T10:00:00Z',
            donor: 'John Smith'
        },
        {
            id: 2,
            foodType: 'Grains & Bread',
            quantity: '10 loaves',
            expiryDate: '2024-01-25',
            pickupLocation: 'Bakery Corner, West Side',
            description: 'Fresh bread and pastries',
            contactPhone: '+1-555-0124',
            status: 'approved',
            dateSubmitted: '2024-01-19T14:30:00Z',
            donor: 'Sarah Johnson'
        }
    ];
    
    // Sample requests
    requests = [
        {
            id: 1,
            orgName: 'Hope Shelter',
            orgType: 'Homeless Shelter',
            peopleCount: 50,
            foodNeeds: 'Hot meals, fruits, and bread',
            deliveryAddress: '123 Hope Street, Downtown',
            urgent: 'high',
            orgContact: 'Mike Wilson - +1-555-0200',
            status: 'pending',
            dateSubmitted: '2024-01-20T09:00:00Z',
            organization: 'Hope Shelter'
        },
        {
            id: 2,
            orgName: 'Community Food Bank',
            orgType: 'Food Bank',
            peopleCount: 200,
            foodNeeds: 'Non-perishable items, canned goods',
            deliveryAddress: '456 Community Ave, East Side',
            urgent: 'medium',
            orgContact: 'Lisa Brown - +1-555-0201',
            status: 'approved',
            dateSubmitted: '2024-01-18T16:00:00Z',
            organization: 'Community Food Bank'
        }
    ];
    
    // Sample available food (combines all donations)
    availableFood = [...donations];
}

// Animation and Effects
function addLoadingState(element) {
    element.classList.add('loading');
}

function removeLoadingState(element) {
    element.classList.remove('loading');
}

// Statistics Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/,/g, ''));
        const increment = target / speed;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate counters when impact section is visible
                if (entry.target.id === 'impact') {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

// Initialize intersection observer when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupIntersectionObserver();
});

// Export functions for global access
window.openModal = openModal;
window.closeModal = closeModal;
window.switchModal = switchModal;
window.switchTab = switchTab;
