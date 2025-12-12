let riderDashboardInterval = null;

function showPage(pageId) {
    // Clear intervals
    if (riderDashboardInterval) {
        clearInterval(riderDashboardInterval);
        riderDashboardInterval = null;
    }
    
    // Get current active page
    const currentPage = document.querySelector('.page-section[style*="block"]');
    const targetPage = document.getElementById('page-' + pageId);
    
    if (!targetPage) return;
    
    // Fade out current page, then fade in new page
    if (currentPage && currentPage !== targetPage) {
        currentPage.style.opacity = '0';
        currentPage.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            const allPages = document.querySelectorAll('.page-section');
            allPages.forEach(page => {
                page.style.display = 'none';
                page.style.opacity = '0';
                page.style.transform = 'translateY(10px)';
            });
            
            targetPage.style.display = 'block';
            // Trigger reflow
            targetPage.offsetHeight;
            targetPage.style.opacity = '1';
            targetPage.style.transform = 'translateY(0)';
            
            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 150);
    } else {
        // First load or same page
        const allPages = document.querySelectorAll('.page-section');
        allPages.forEach(page => {
            page.style.display = 'none';
            page.style.opacity = '0';
            page.style.transform = 'translateY(10px)';
        });
        
        targetPage.style.display = 'block';
        setTimeout(() => {
            targetPage.style.opacity = '1';
            targetPage.style.transform = 'translateY(0)';
        }, 10);
    }
    
    updateNavbarForLoginStatus();
    
    // Initialize page-specific functions
    if (pageId === 'home') {
        initHomePage();
    } else if (pageId === 'login') {
        initLoginPage();
    } else if (pageId === 'profile') {
        initProfilePage();
    } else if (pageId === 'rider-dashboard') {
        initRiderDashboard();
    } else if (pageId === 'rider-feedbacks') {
        initRiderFeedbacks();
    } else if (pageId.startsWith('rider-')) {
        const riderNum = pageId.split('-')[1];
        initRiderPage(riderNum);
    } else if (pageId === 'feedback') {
        initFeedbackPage();
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

function updateNavbarForLoginStatus() {
    const loginProfileLink = document.getElementById('login-profile-link');
    const homeLink = document.getElementById('home-link');
    const nav = document.querySelector('nav');
    
    // Remove existing logout button if present
    const existingLogout = document.getElementById('navbar-logout-button');
    if (existingLogout) {
        existingLogout.remove();
    }
    
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

        // Add logout button next to Dashboard
        const logoutButton = document.createElement('a');
        logoutButton.href = '#';
        logoutButton.id = 'navbar-logout-button';
        logoutButton.className = 'navbar-logout-button';
        logoutButton.textContent = 'Logout';
        logoutButton.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('currentRider');
            alert('You have been logged out successfully.');
            showPage('home');
            return false;
        };
        nav.appendChild(logoutButton);
    } else if (currentCustomer) {
        if (loginProfileLink) {
            loginProfileLink.textContent = 'Profile';
            loginProfileLink.onclick = function(e) { showPage('profile'); return false; };
        }
        if (homeLink) {
            homeLink.style.display = 'block';
        }

        // Add logout button next to Profile
        const logoutButton = document.createElement('a');
        logoutButton.href = '#';
        logoutButton.id = 'navbar-logout-button';
        logoutButton.className = 'navbar-logout-button';
        logoutButton.textContent = 'Logout';
        logoutButton.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('currentCustomer');
            alert('You have been logged out successfully.');
            showPage('home');
            return false;
        };
        nav.appendChild(logoutButton);
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

// HOME PAGE

function initHomePage() {
    const riderCards = document.querySelectorAll('.rider-card');
    riderCards.forEach((card) => {
        card.style.cursor = 'pointer';
    });
}

// LOGIN PAGE

let loginPageInitialized = false;

function initLoginPage() {

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

// PROFILE PAGE

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
    } else if (order.status === 'Delivered') {
        displayStatus = 'Delivered';
    }
    
    // Make delivered orders clickable
    const isDelivered = order.status === 'Delivered';
    const hasFeedback = order.feedbackSubmitted;
    
    if (isDelivered) {
        orderDiv.style.cursor = 'pointer';
        orderDiv.addEventListener('click', function() {
            showFeedbackPage(order);
        });
    }
    
    const statusClass = `status-${order.status.toLowerCase().replace(/ /g, '-')}`;

    orderDiv.innerHTML = `
        <p><strong>${order.note}</strong></p>
        <p><span class="order-status-badge ${statusClass}">${displayStatus}</span>${isDelivered && !hasFeedback ? ' (Click to rate)' : ''}${hasFeedback ? ' ✓ Feedback submitted' : ''}</p>
    `;
    
    return orderDiv;
}

// RIDER DASHBOARD PAGE

function initRiderDashboard() {
    const currentRider = localStorage.getItem('currentRider');
    
    if (!currentRider) {
        alert('Please login as a rider to access the dashboard.');
        showPage('login');
        return;
    }
    
    const rider = JSON.parse(currentRider);
    document.getElementById('rider-name-display').textContent = rider.riderName;
    
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
    
    if (riderDashboardInterval) {
        clearInterval(riderDashboardInterval);
    }
    riderDashboardInterval = setInterval(loadAllOrders, 5000);
    
    // Set up feedbacks button
    const feedbacksButton = document.getElementById('feedbacks-button');
    if (feedbacksButton && !feedbacksButton.hasAttribute('data-initialized')) {
        feedbacksButton.onclick = function() {
            showPage('rider-feedbacks');
        };
        feedbacksButton.setAttribute('data-initialized', 'true');
    }
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
    const canMarkDone = isAccepted && order.status === 'Out for delivery';
    
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
            ${canMarkDone ? `<button class="done-order-button" onclick="markOrderDone('${order.id}', '${order.customerUsername}')">Done</button>` : ''}
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

window.markOrderDone = function(orderId, customerUsername) {
    const currentRider = JSON.parse(localStorage.getItem('currentRider'));
    const ordersKey = 'customerOrders_' + customerUsername;
    const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    const orderIndex = orders.findIndex(o => o.id == orderId);
    
    if (orderIndex !== -1 && orders[orderIndex].acceptedBy === currentRider.username && orders[orderIndex].status === 'Out for delivery') {
        orders[orderIndex].status = 'Delivered';
        orders[orderIndex].completedAt = new Date().toISOString();
        localStorage.setItem(ordersKey, JSON.stringify(orders));
        alert('Order marked as delivered!');
        loadAllOrders();
    }
};

// RIDER PAGES

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

// UTILITY FUNCTIONS

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
// FEEDBACK PAGE
// ============================================

let currentFeedbackOrder = null;

function showFeedbackPage(order) {
    currentFeedbackOrder = order;
    showPage('feedback');
}

function initFeedbackPage() {
    if (!currentFeedbackOrder) {
        showPage('profile');
        return;
    }
    
    const orderInfo = document.getElementById('feedback-order-info');
    orderInfo.textContent = `Order ID: ${currentFeedbackOrder.id} | Rider: ${currentFeedbackOrder.riderName}`;
    
    // Reset ratings
    document.getElementById('rider-rating-value').value = '0';
    document.getElementById('kubo-rating-value').value = '0';
    document.getElementById('feedback-text').value = '';
    
    // Reset star displays
    resetStarRating('rider-rating');
    resetStarRating('kubo-rating');
    
    // Set up star rating handlers
    setupStarRating('rider-rating', 'rider-rating-value');
    setupStarRating('kubo-rating', 'kubo-rating-value');
    
    // Handle form submission
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.onsubmit = function(e) {
            e.preventDefault();
            submitFeedback();
        };
    }
}

function setupStarRating(ratingId, valueInputId) {
    const ratingContainer = document.getElementById(ratingId);
    const stars = ratingContainer.querySelectorAll('.star');
    const valueInput = document.getElementById(valueInputId);
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = parseInt(star.dataset.rating);
            valueInput.value = rating;
            highlightStars(ratingId, rating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(star.dataset.rating);
            highlightStars(ratingId, rating);
        });
    });
    
    ratingContainer.addEventListener('mouseleave', function() {
        const currentRating = parseInt(valueInput.value) || 0;
        highlightStars(ratingId, currentRating);
    });
}

function highlightStars(ratingId, rating) {
    const stars = document.querySelectorAll(`#${ratingId} .star`);
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function resetStarRating(ratingId) {
    const stars = document.querySelectorAll(`#${ratingId} .star`);
    stars.forEach(star => star.classList.remove('active'));
}

function submitFeedback() {
    const riderRating = parseInt(document.getElementById('rider-rating-value').value);
    const kuboRating = parseInt(document.getElementById('kubo-rating-value').value);
    const feedbackText = document.getElementById('feedback-text').value.trim();
    
    if (riderRating === 0 || kuboRating === 0) {
        alert('Please rate both the rider performance and KUBO services!');
        return;
    }
    
    const feedback = {
        orderId: currentFeedbackOrder.id,
        customerUsername: JSON.parse(localStorage.getItem('currentCustomer')).username,
        riderName: currentFeedbackOrder.riderName,
        riderRating: riderRating,
        kuboRating: kuboRating,
        feedbackText: feedbackText,
        submittedAt: new Date().toISOString()
    };
    
    // Save feedback
    const feedbacks = JSON.parse(localStorage.getItem('orderFeedbacks') || '[]');
    // Remove existing feedback for this order if any
    const filteredFeedbacks = feedbacks.filter(f => f.orderId !== currentFeedbackOrder.id);
    filteredFeedbacks.push(feedback);
    localStorage.setItem('orderFeedbacks', JSON.stringify(filteredFeedbacks));
    
    // Mark order as feedback submitted
    const customer = JSON.parse(localStorage.getItem('currentCustomer'));
    const ordersKey = 'customerOrders_' + customer.username;
    const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    const orderIndex = orders.findIndex(o => o.id === currentFeedbackOrder.id);
    if (orderIndex !== -1) {
        orders[orderIndex].feedbackSubmitted = true;
        localStorage.setItem(ordersKey, JSON.stringify(orders));
    }
    
    alert('Thank you for your feedback!');
    showPage('profile');
    currentFeedbackOrder = null;
}

// ============================================
// RIDER FEEDBACKS PAGE
// ============================================

function initRiderFeedbacks() {
    const currentRider = localStorage.getItem('currentRider');
    
    if (!currentRider) {
        alert('Please login as a rider to view feedbacks.');
        showPage('login');
        return;
    }
    
    const rider = JSON.parse(currentRider);
    document.getElementById('rider-feedbacks-name').textContent = rider.riderName;
    
    loadRiderFeedbacks(rider.riderName);
}

function loadRiderFeedbacks(riderName) {
    const feedbacksContainer = document.getElementById('feedbacks-container');
    if (!feedbacksContainer) return;
    
    feedbacksContainer.innerHTML = '';
    
    // Get all feedbacks
    const allFeedbacks = JSON.parse(localStorage.getItem('orderFeedbacks') || '[]');
    
    // Filter feedbacks for this specific rider
    const riderFeedbacks = allFeedbacks.filter(feedback => feedback.riderName === riderName);
    
    if (riderFeedbacks.length === 0) {
        feedbacksContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No feedbacks received yet.</p>';
        return;
    }
    
    // Sort by submission date (newest first)
    riderFeedbacks.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    // Display each feedback
    riderFeedbacks.forEach(feedback => {
        const feedbackElement = createFeedbackCard(feedback);
        feedbacksContainer.appendChild(feedbackElement);
    });
}

function createFeedbackCard(feedback) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback-card';
    
    // Get customer name
    const customerAccounts = JSON.parse(localStorage.getItem('customerAccounts') || '[]');
    const customer = customerAccounts.find(c => c.username === feedback.customerUsername);
    const customerName = customer ? customer.firstName + ' ' + customer.lastName : feedback.customerUsername;
    
    // Create star display for rider rating
    const riderStars = generateStars(feedback.riderRating);
    const kuboStars = generateStars(feedback.kuboRating);
    
    feedbackDiv.innerHTML = `
        <div class="feedback-header">
            <h4>Feedback from ${customerName}</h4>
            <span class="feedback-date">${formatDate(feedback.submittedAt)}</span>
        </div>
        <div class="feedback-details">
            <div class="feedback-rating">
                <p><strong>Rider Performance:</strong> ${riderStars} (${feedback.riderRating}/5)</p>
            </div>
            <div class="feedback-rating">
                <p><strong>KUBO Services:</strong> ${kuboStars} (${feedback.kuboRating}/5)</p>
            </div>
            ${feedback.feedbackText ? `<div class="feedback-text"><p><strong>Comment:</strong> ${feedback.feedbackText}</p></div>` : ''}
            <p style="margin-top: 10px; color: #666; font-size: 0.9em;"><strong>Order ID:</strong> ${feedback.orderId}</p>
        </div>
    `;
    
    return feedbackDiv;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star-display active">★</span>';
        } else {
            stars += '<span class="star-display">★</span>';
        }
    }
    return stars;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// INITIALIZATION

document.addEventListener('DOMContentLoaded', function() {

    showPage('home');
    
    updateNavbarForLoginStatus();
    
    const aboutLink = document.querySelector('nav a[onclick*="about"]');
    if (!aboutLink) {
        const nav = document.querySelector('nav');
        const aboutUsLink = nav.children[1];
        if (aboutUsLink) {
            aboutUsLink.onclick = function(e) { showPage('about'); return false; };
        }
    }
});
document.getElementById("sendBtn").addEventListener("click", function () {
    // Your message logic here
    
    alert("Message sent successfully!");
});

