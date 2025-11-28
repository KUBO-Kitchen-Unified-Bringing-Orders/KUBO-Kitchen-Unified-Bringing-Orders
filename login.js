// JavaScript file for login.html
// Handles switching between customer and rider login and create account functionality

document.addEventListener('DOMContentLoaded', function() {
    const customerBtn = document.querySelector('.login-type-btn[data-type="customer"]');
    const riderBtn = document.querySelector('.login-type-btn[data-type="rider"]');
    const loginDescription = document.getElementById('login-description');
    const loginForm = document.getElementById('login-form');
    const createAccountLink = document.getElementById('create-account-link');
    const createAccountForm = document.getElementById('create-account-form');
    const backToLoginLink = document.getElementById('back-to-login-link');
    
    let currentLoginType = 'customer'; // Track current login type
    
    // Function to get all customer accounts from localStorage
    function getCustomerAccounts() {
        const accounts = localStorage.getItem('customerAccounts');
        return accounts ? JSON.parse(accounts) : [];
    }
    
    // Function to save customer accounts to localStorage
    function saveCustomerAccounts(accounts) {
        localStorage.setItem('customerAccounts', JSON.stringify(accounts));
    }
    
    // Function to check if username already exists
    function usernameExists(username) {
        const accounts = getCustomerAccounts();
        return accounts.some(account => account.username === username);
    }
    
    // Function to find customer account by username and password
    function findCustomerAccount(username, password) {
        const accounts = getCustomerAccounts();
        return accounts.find(account => 
            account.username === username && account.password === password
        );
    }
    
    // Function to validate rider credentials
    function validateRiderCredentials(username, password) {
        // All rider credentials
        const riders = [
            { username: 'Baldesco', password: 'Rider1' },
            { username: 'Toribio', password: 'Rider2' },
            { username: 'Lasagas', password: 'Rider3' },
            { username: 'Dumana', password: 'Rider4' },
            { username: 'Figueroa', password: 'Rider5' }
        ];
        
        return riders.some(rider => 
            rider.username === username && rider.password === password
        );
    }
    
    // Function to get rider info
    function getRiderInfo(username) {
        const riders = {
            'Baldesco': {
                username: 'Baldesco',
                riderName: 'Arfrael Baldesco',
                riderNumber: 1
            },
            'Toribio': {
                username: 'Toribio',
                riderName: 'Enrick Jason Toribio',
                riderNumber: 2
            },
            'Lasagas': {
                username: 'Lasagas',
                riderName: 'Paul Kane Nicholas Lasagas',
                riderNumber: 3
            },
            'Dumana': {
                username: 'Dumana',
                riderName: 'Jasiel Dumana',
                riderNumber: 4
            },
            'Figueroa': {
                username: 'Figueroa',
                riderName: 'Alexander Dominic Figueroa',
                riderNumber: 5
            }
        };
        
        return riders[username] || null;
    }
    
    // Function to switch login type
    function switchLoginType(type) {
        currentLoginType = type;
        
        // Remove active class from both buttons
        customerBtn.classList.remove('active');
        riderBtn.classList.remove('active');
        
        // Add active class to selected button
        if (type === 'customer') {
            customerBtn.classList.add('active');
            loginDescription.textContent = 'Please enter your credentials to access your customer account.';
            // Show create account link for customers
            createAccountLink.style.display = 'block';
        } else {
            riderBtn.classList.add('active');
            loginDescription.textContent = 'Please enter your credentials to access the rider dashboard.';
            // Hide create account link for riders
            createAccountLink.style.display = 'none';
            // If create account form is visible, hide it when switching to rider
            if (createAccountForm.style.display === 'block') {
                showLoginForm();
            }
        }
        
        // Update form action or add hidden field to indicate login type
        // You can customize this based on your backend needs
        const existingTypeInput = document.getElementById('login-type');
        if (existingTypeInput) {
            existingTypeInput.value = type;
        } else {
            const typeInput = document.createElement('input');
            typeInput.type = 'hidden';
            typeInput.id = 'login-type';
            typeInput.name = 'login-type';
            typeInput.value = type;
            loginForm.appendChild(typeInput);
        }
    }
    
    // Function to show create account form
    function showCreateAccountForm() {
        loginForm.style.display = 'none';
        createAccountForm.style.display = 'block';
    }
    
    // Function to show login form
    function showLoginForm() {
        loginForm.style.display = 'block';
        createAccountForm.style.display = 'none';
    }
    
    // Add event listeners to buttons
    customerBtn.addEventListener('click', function() {
        switchLoginType('customer');
    });
    
    riderBtn.addEventListener('click', function() {
        switchLoginType('rider');
    });
    
    // Handle create account link click
    createAccountLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentLoginType === 'customer') {
            showCreateAccountForm();
        }
    });
    
    // Handle back to login link click
    backToLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
    
    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const loginType = document.getElementById('login-type')?.value || 'customer';
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate input
        if (!username || !password) {
            alert('Please enter both username and password!');
            return;
        }
        
        if (loginType === 'customer') {
            // Check customer credentials
            const account = findCustomerAccount(username, password);
            if (account) {
                // Save current logged-in user
                localStorage.setItem('currentCustomer', JSON.stringify(account));
                alert('Login successful! Welcome back, ' + account.firstName + '!');
                // Clear form
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password! Please try again.');
            }
        } else {
            // Rider login logic
            if (validateRiderCredentials(username, password)) {
                const riderInfo = getRiderInfo(username);
                // Save current logged-in rider
                localStorage.setItem('currentRider', JSON.stringify(riderInfo));
                alert('Login successful! Welcome, ' + riderInfo.riderName + '!');
                // Clear form
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                // Redirect to rider dashboard
                window.location.href = 'rider_dashboard.html';
            } else {
                alert('Invalid username or password! Please try again.');
            }
        }
    });
    
    // Handle create account form submission
    createAccountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const address = document.getElementById('address').value.trim();
        const username = document.getElementById('new-username').value.trim();
        const password = document.getElementById('new-password').value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        
        // Validate all fields are filled
        if (!firstName || !lastName || !address || !username || !password) {
            alert('Please fill in all fields!');
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }
        
        // Validate gender is selected
        if (!gender) {
            alert('Please select your gender!');
            return;
        }
        
        // Check if username already exists
        if (usernameExists(username)) {
            alert('Username already exists! Please choose a different username.');
            return;
        }
        
        // Create new account object
        const newAccount = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            username: username,
            password: password, // In production, this should be hashed
            gender: gender,
            createdAt: new Date().toISOString()
        };
        
        // Get existing accounts and add new one
        const accounts = getCustomerAccounts();
        accounts.push(newAccount);
        saveCustomerAccounts(accounts);
        
        // Show success message
        alert('Account created successfully! You can now login with your credentials.');
        
        // Clear form
        createAccountForm.reset();
        
        // Switch back to login form
        showLoginForm();
        
        // Pre-fill username in login form
        document.getElementById('username').value = username;
    });
    
    // Initialize: show create account link for customer (default)
    createAccountLink.style.display = 'block';
});

