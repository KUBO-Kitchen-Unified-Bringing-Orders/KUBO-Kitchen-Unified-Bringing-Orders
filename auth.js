// Shared authentication utility for all pages
// Handles login status checking and navbar updates

// Function to check login status and update navbar
function updateNavbarForLoginStatus() {
    const loginProfileLink = document.getElementById('login-profile-link');
    const homeLink = document.getElementById('home-link');
    
    const currentCustomer = localStorage.getItem('currentCustomer');
    const currentRider = localStorage.getItem('currentRider');
    
    if (currentRider) {
        // Rider is logged in, show Dashboard instead of Login
        if (loginProfileLink) {
            loginProfileLink.textContent = 'Dashboard';
            loginProfileLink.href = 'rider_dashboard.html';
        }
        // Hide Home link for riders
        if (homeLink) {
            homeLink.style.display = 'none';
        }
    } else if (currentCustomer) {
        // Customer is logged in, show Profile instead of Login
        if (loginProfileLink) {
            loginProfileLink.textContent = 'Profile';
            loginProfileLink.href = 'profile.html';
        }
        // Show Home link for customers
        if (homeLink) {
            homeLink.style.display = 'block';
        }
    } else {
        // No one is logged in, show Login
        if (loginProfileLink) {
            loginProfileLink.textContent = 'Login';
            loginProfileLink.href = 'login.html';
        }
        // Show Home link when not logged in
        if (homeLink) {
            homeLink.style.display = 'block';
        }
    }
}

// Call this function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateNavbarForLoginStatus();
});

