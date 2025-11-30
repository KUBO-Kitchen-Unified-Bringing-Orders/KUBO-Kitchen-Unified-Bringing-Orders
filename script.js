// ============================================
// KUBO - Consolidated JavaScript File
// All functionality in one file
// ============================================

// ============================================
// ROUTING SYSTEM
// ============================================

// Global variables for interval management
let riderDashboardInterval = null;

function showPage(pageId) {
    // Clear any running intervals when switching pages
    if (riderDashboardInterval) {
        clearInterval(riderDashboardInterval);
        riderDashboardInterval = null;
    }
    
    // Hide all pages
    const allPages = document.querySelectorAll('.page-section');
    allPages.forEach(page => page.style.display = 'none');
    
    // Show requested page
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
    }
    
    // Update navbar
    updateNavbarForLoginStatus();
    
    // Initialize page-specific functionality
    if (pageId === 'home') {
        initHomePage();
    } else if (pageId === 'login') {
        initLoginPage();
    } else if (pageId === 'profile') {
        initProfilePage();
    } else if (pageId === 'rider-dashboard') {
        initRiderDashboard();
    } else if (pageId.startsWith('rider-')) {
        const riderNum = pageId.split('-')[1];
        initRiderPage(riderNum);
    }
}

function handleAuthClick(event) {
    const currentCustomer = localStorage.getItem('currentCustomer');
    const currentRider = localStorage.getItem('currentRider');
    
    if (currentRider) {
        showPage('rider-dashboard');
    } else if (currentCustomer) {
        showPage('profile');
    } else {
        showPage('login');
    }
}

// ============================================
// AUTHENTICATION & NAVBAR
// ============================================

function updateNavbarForLoginStatus() {
    const loginProfileLink = document.getElementById('login-profile-link');
    const homeLink = document.getElementById('home-link');
    
    const currentCustomer = localStorage.getItem('currentCustomer');
    const currentRider = localStorage.getItem('currentRider');
    
    if (currentRider) {
        if (loginProfileLink) {
            loginProfileLink.textContent = 'Dashboard';
            loginProfileLink.onclick = function(e) { showPage('rider-dashboard'); return false; };
        }
        if (homeLink) {
            homeLink.style.display = 'none';
        }
    } else if (currentCustomer) {
        if (loginProfileLink) {
            loginProfileLink.textContent = 'Profile';
            loginProfileLink.onclick = function(e) { showPage('profile'); return false; };
        }
        if (homeLink) {
            homeLink.style.display = 'block';
        }
    } else {
        if (loginProfileLink) {
            loginProfileLink.textContent = 'Login';
            loginProfileLink.onclick = function(e) { showPage('login'); return false; };
        }
        if (homeLink) {
            homeLink.style.display = 'block';
        }
    }
}

// ============================================
// HOME PAGE
// ============================================

function initHomePage() {
    const riderCards = document.querySelectorAll('.rider-card');
    riderCards.forEach((card) => {
        card.style.cursor = 'pointer';
    });
}

// ============================================
// LOGIN PAGE
// ============================================

// Track if login page is initialized
let loginPageInitialized = false;

function initLoginPage() {
    // Prevent multiple initializations
    if (loginPageInitialized) return;
    
    const customerBtn = document.querySelector('.login-type-btn[data-type="customer"]');
    const riderBtn = document.querySelector('.login-type-btn[data-type="rider"]');
    const loginDescription = document.getElementById('login-description');
    const loginForm = document.getElementById('login-form');
    const createAccountLink = document.getElementById('create-account-link');
    const createAccountForm = document.getElementById('create-account-form');
    const backToLoginLink = document.getElementById('back-to-login-link');
    
    if (!customerBtn || !riderBtn || !loginForm) return;
    
    let currentLoginType = 'customer';
    
    function switchLoginType(type) {
        currentLoginType = type;
        customerBtn.classList.remove('active');
        riderBtn.classList.remove('active');
        
        if (type === 'customer') {
            customerBtn.classList.add('active');
            loginDescription.textContent = 'Please enter your credentials to access your customer account.';
            createAccountLink.style.display = 'block';
        } else {
            riderBtn.classList.add('active');
            loginDescription.textContent = 'Please enter your credentials to access the rider dashboard.';
            createAccountLink.style.display = 'none';
            if (createAccountForm.style.display === 'block') {
                showLoginForm();
            }
        }
        
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
    
    function showCreateAccountForm() {
        loginForm.style.display = 'none';
        createAccountForm.style.display = 'block';
    }
    
    function showLoginForm() {
        loginForm.style.display = 'block';
        createAccountForm.style.display = 'none';
    }
    
    customerBtn.addEventListener('click', () => switchLoginType('customer'));
    riderBtn.addEventListener('click', () => switchLoginType('rider'));
    
    createAccountLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentLoginType === 'customer') {
            showCreateAccountForm();
        }
    });
    
    backToLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const loginType = document.getElementById('login-type')?.value || 'customer';
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Please enter both username and password!');
            return;
        }
        
        if (loginType === 'customer') {
            const account = findCustomerAccount(username, password);
            if (account) {
                localStorage.setItem('currentCustomer', JSON.stringify(account));
                alert('Login successful! Welcome back, ' + account.firstName + '!');
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                showPage('home');
            } else {
                alert('Invalid username or password! Please try again.');
            }
        } else {
            if (validateRiderCredentials(username, password)) {
                const riderInfo = getRiderInfo(username);
                localStorage.setItem('currentRider', JSON.stringify(riderInfo));
                alert('Login successful! Welcome, ' + riderInfo.riderName + '!');
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                showPage('rider-dashboard');
            } else {
                alert('Invalid username or password! Please try again.');
            }
        }
    });
    
    createAccountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const address = document.getElementById('address').value.trim();
        const username = document.getElementById('new-username').value.trim();
        const password = document.getElementById('new-password').value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        
        if (!firstName || !lastName || !address || !username || !password) {
            alert('Please fill in all fields!');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }
        
        if (!gender) {
            alert('Please select your gender!');
            return;
        }
        
        if (usernameExists(username)) {
            alert('Username already exists! Please choose a different username.');
            return;
        }
        
        const newAccount = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            username: username,
            password: password,
            gender: gender,
            createdAt: new Date().toISOString()
        };
        
        const accounts = getCustomerAccounts();
        accounts.push(newAccount);
        saveCustomerAccounts(accounts);
        
        alert('Account created successfully! You can now login with your credentials.');
        createAccountForm.reset();
        showLoginForm();
        document.getElementById('username').value = username;
    });
    
    createAccountLink.style.display = 'block';
    
    loginPageInitialized = true;
}

// ============================================
// PROFILE PAGE
// ============================================

// Track if profile page logout is initialized
let profileLogoutInitialized = false;

function initProfilePage() {
    const currentCustomer = localStorage.getItem('currentCustomer');
    
    if (!currentCustomer) {
        alert('Please login to view your profile.');
        showPage('login');
        return;
    }
    
    const customer = JSON.parse(currentCustomer);
    const fullName = customer.firstName + ' ' + customer.lastName;
    document.getElementById('profile-name').textContent = fullName;
    document.getElementById('profile-address').textContent = customer.address;
    document.getElementById('profile-gender').textContent = customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1);
    
    loadOrders(customer.username);
    
    // Only add logout listener once
    if (!profileLogoutInitialized) {
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                localStorage.removeItem('currentCustomer');
                alert('You have been logged out successfully.');
                showPage('home');
            });
            profileLogoutInitialized = true;
        }
    }
}

function loadOrders(username) {
    const orders = localStorage.getItem('customerOrders_' + username);
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';
    
    if (orders) {
        const ordersArray = JSON.parse(orders);
        ordersArray.reverse().forEach(order => {
            const orderElement = createOrderElement(order);
            ordersList.appendChild(orderElement);
        });
    } else {
        const noOrdersMsg = document.createElement('p');
        noOrdersMsg.textContent = 'No orders yet. Click on a rider to place an order!';
        noOrdersMsg.style.textAlign = 'center';
        noOrdersMsg.style.color = '#666';
        noOrdersMsg.style.padding = '20px';
        ordersList.appendChild(noOrdersMsg);
    }
}

function createOrderElement(order) {
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-entry';
    
    let displayStatus = order.status;
    if (order.status === 'Waiting for rider') {
        displayStatus = 'Waiting for rider';
    } else if (order.status === 'Pending') {
        displayStatus = 'Pending';
    } else if (order.status === 'Out for delivery') {
        displayStatus = 'Out for delivery';
    }
    
    orderDiv.innerHTML = `
        <p><strong>${order.note}</strong></p>
        <p><strong>${displayStatus}</strong></p>
    `;
    
    return orderDiv;
}

// ============================================
// RIDER DASHBOARD PAGE
// ============================================

function initRiderDashboard() {
    const currentRider = localStorage.getItem('currentRider');
    
    if (!currentRider) {
        alert('Please login as a rider to access the dashboard.');
        showPage('login');
        return;
    }
    
    const rider = JSON.parse(currentRider);
    document.getElementById('rider-name-display').textContent = rider.riderName;
    
    // Only set up logout button once
    const logoutButton = document.getElementById('rider-logout-button');
    if (logoutButton && !logoutButton.hasAttribute('data-initialized')) {
        logoutButton.onclick = function() {
            localStorage.removeItem('currentRider');
            alert('You have been logged out successfully.');
            showPage('home');
        };
        logoutButton.setAttribute('data-initialized', 'true');
    }
    
    loadAllOrders();
    
    // Clear existing interval before creating a new one
    if (riderDashboardInterval) {
        clearInterval(riderDashboardInterval);
    }
    riderDashboardInterval = setInterval(loadAllOrders, 5000);
}

function loadAllOrders() {
    const ordersContainer = document.getElementById('orders-container');
    if (!ordersContainer) return;
    
    ordersContainer.innerHTML = '';
    
    const currentRider = localStorage.getItem('currentRider');
    if (!currentRider) {
        ordersContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Please login as a rider.</p>';
        return;
    }
    
    const rider = JSON.parse(currentRider);
    const riderNumber = rider.riderNumber;
    
    const customerAccounts = JSON.parse(localStorage.getItem('customerAccounts') || '[]');
    
    if (customerAccounts.length === 0) {
        ordersContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No orders available yet.</p>';
        return;
    }
    
    let allOrders = [];
    
    customerAccounts.forEach(customer => {
        const ordersKey = 'customerOrders_' + customer.username;
        const customerOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
        
        customerOrders.forEach(order => {
            if (order.riderNumber === riderNumber) {
                allOrders.push({
                    ...order,
                    customerUsername: customer.username,
                    customerName: customer.firstName + ' ' + customer.lastName
                });
            }
        });
    });
    
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (allOrders.length === 0) {
        ordersContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No orders available for you yet.</p>';
        return;
    }
    
    allOrders.forEach(order => {
        const orderElement = createOrderCard(order);
        ordersContainer.appendChild(orderElement);
    });
}

function createOrderCard(order) {
    const currentRider = JSON.parse(localStorage.getItem('currentRider'));
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-card';
    orderDiv.dataset.orderId = order.id;
    orderDiv.dataset.customerUsername = order.customerUsername;
    
    const isAccepted = order.acceptedBy && order.acceptedBy === currentRider.username;
    const canAccept = !order.acceptedBy;
    const canDeliver = isAccepted && order.status === 'Pending';
    
    orderDiv.innerHTML = `
        <div class="order-header">
            <h4>Order from ${order.customerName}</h4>
            <span class="order-status-badge status-${order.status.toLowerCase().replace(/ /g, '-')}">${order.status}</span>
        </div>
        <div class="order-details">
            <p><strong>Note:</strong> ${order.note}</p>
            <p><strong>Rider Requested:</strong> ${order.riderName}</p>
            ${order.acceptedBy ? `<p><strong>Accepted by:</strong> ${order.acceptedBy}</p>` : ''}
            <p><strong>Order ID:</strong> ${order.id}</p>
        </div>
        <div class="order-actions">
            ${canAccept ? `<button class="accept-button" onclick="acceptOrder('${order.id}', '${order.customerUsername}')">Accept Order</button>` : ''}
            ${canDeliver ? `<button class="deliver-button" onclick="deliverOrder('${order.id}', '${order.customerUsername}')">Deliver</button>` : ''}
            ${isAccepted && order.status === 'Out for delivery' ? '<p style="color: #376C9B; font-weight: 600;">You are delivering this order</p>' : ''}
        </div>
    `;
    
    return orderDiv;
}

window.acceptOrder = function(orderId, customerUsername) {
    const currentRider = JSON.parse(localStorage.getItem('currentRider'));
    const ordersKey = 'customerOrders_' + customerUsername;
    const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    const orderIndex = orders.findIndex(o => o.id == orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].acceptedBy = currentRider.username;
        orders[orderIndex].status = 'Pending';
        orders[orderIndex].acceptedAt = new Date().toISOString();
        localStorage.setItem(ordersKey, JSON.stringify(orders));
        alert('Order accepted successfully!');
        loadAllOrders();
    }
};

window.deliverOrder = function(orderId, customerUsername) {
    const currentRider = JSON.parse(localStorage.getItem('currentRider'));
    const ordersKey = 'customerOrders_' + customerUsername;
    const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    const orderIndex = orders.findIndex(o => o.id == orderId);
    
    if (orderIndex !== -1 && orders[orderIndex].acceptedBy === currentRider.username) {
        orders[orderIndex].status = 'Out for delivery';
        orders[orderIndex].deliveredAt = new Date().toISOString();
        localStorage.setItem(ordersKey, JSON.stringify(orders));
        alert('Order is now out for delivery!');
        loadAllOrders();
    }
};

// ============================================
// RIDER PAGES
// ============================================

const riderData = {
    1: { name: 'Arfrael Baldesco', number: 1 },
    2: { name: 'Enrick Jason Toribio', number: 2 },
    3: { name: 'Paul Kane Nicholas Lasagas', number: 3 },
    4: { name: 'Jasiel Dumana', number: 4 },
    5: { name: 'Alexander Dominic Figueroa', number: 5 }
};

function initRiderPage(riderNum) {
    const currentCustomer = localStorage.getItem('currentCustomer');
    
    if (!currentCustomer) {
        alert('Please login to place an order.');
        showPage('login');
        return;
    }
    
    const customer = JSON.parse(currentCustomer);
    const rider = riderData[riderNum];
    const noteTextarea = document.getElementById(`rider-note-${riderNum}`);
    const doneButton = document.querySelector(`button[data-rider="${riderNum}"]`);
    
    if (doneButton) {
        doneButton.onclick = function() {
            const note = noteTextarea.value.trim();
            
            if (!note) {
                alert('Please add a note for your order!');
                return;
            }
            
            const order = {
                id: Date.now(),
                note: note,
                riderName: rider.name,
                riderNumber: rider.number,
                status: 'Waiting for rider',
                acceptedBy: null,
                createdAt: new Date().toISOString()
            };
            
            const ordersKey = 'customerOrders_' + customer.username;
            const existingOrders = localStorage.getItem(ordersKey);
            const orders = existingOrders ? JSON.parse(existingOrders) : [];
            orders.push(order);
            localStorage.setItem(ordersKey, JSON.stringify(orders));
            
            alert('Order placed successfully!');
            noteTextarea.value = '';
        };
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getCustomerAccounts() {
    const accounts = localStorage.getItem('customerAccounts');
    return accounts ? JSON.parse(accounts) : [];
}

function saveCustomerAccounts(accounts) {
    localStorage.setItem('customerAccounts', JSON.stringify(accounts));
}

function usernameExists(username) {
    const accounts = getCustomerAccounts();
    return accounts.some(account => account.username === username);
}

function findCustomerAccount(username, password) {
    const accounts = getCustomerAccounts();
    return accounts.find(account => 
        account.username === username && account.password === password
    );
}

function validateRiderCredentials(username, password) {
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

function getRiderInfo(username) {
    const riders = {
        'Baldesco': { username: 'Baldesco', riderName: 'Arfrael Baldesco', riderNumber: 1 },
        'Toribio': { username: 'Toribio', riderName: 'Enrick Jason Toribio', riderNumber: 2 },
        'Lasagas': { username: 'Lasagas', riderName: 'Paul Kane Nicholas Lasagas', riderNumber: 3 },
        'Dumana': { username: 'Dumana', riderName: 'Jasiel Dumana', riderNumber: 4 },
        'Figueroa': { username: 'Figueroa', riderName: 'Alexander Dominic Figueroa', riderNumber: 5 }
    };
    
    return riders[username] || null;
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Show home page by default
    showPage('home');
    
    // Update navbar
    updateNavbarForLoginStatus();
    
    // Set up About Us link
    const aboutLink = document.querySelector('nav a[onclick*="about"]');
    if (!aboutLink) {
        const nav = document.querySelector('nav');
        const aboutUsLink = nav.children[1];
        if (aboutUsLink) {
            aboutUsLink.onclick = function(e) { showPage('about'); return false; };
        }
    }
});

