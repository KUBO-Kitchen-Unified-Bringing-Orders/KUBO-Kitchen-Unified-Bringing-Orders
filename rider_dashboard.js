// JavaScript file for rider_dashboard.html
// Displays all customer orders and allows riders to accept/deliver them

document.addEventListener('DOMContentLoaded', function() {
    // Check if rider is logged in
    const currentRider = localStorage.getItem('currentRider');
    
    if (!currentRider) {
        alert('Please login as a rider to access the dashboard.');
        window.location.href = 'login.html';
        return;
    }
    
    const rider = JSON.parse(currentRider);
    document.getElementById('rider-name-display').textContent = rider.riderName;
    
    // Handle logout button
    const logoutButton = document.getElementById('rider-logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Remove current rider from localStorage
            localStorage.removeItem('currentRider');
            alert('You have been logged out successfully.');
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
    
    // Load and display all orders
    loadAllOrders();
    
    // Refresh orders every 5 seconds to see new orders
    setInterval(loadAllOrders, 5000);
});

// Function to load all orders from all customers
function loadAllOrders() {
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = '';
    
    // Get all customer accounts
    const customerAccounts = JSON.parse(localStorage.getItem('customerAccounts') || '[]');
    
    if (customerAccounts.length === 0) {
        ordersContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No orders available yet.</p>';
        return;
    }
    
    let allOrders = [];
    
    // Collect all orders from all customers
    customerAccounts.forEach(customer => {
        const ordersKey = 'customerOrders_' + customer.username;
        const customerOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
        
        customerOrders.forEach(order => {
            allOrders.push({
                ...order,
                customerUsername: customer.username,
                customerName: customer.firstName + ' ' + customer.lastName
            });
        });
    });
    
    // Sort by creation date (newest first)
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (allOrders.length === 0) {
        ordersContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No orders available yet.</p>';
        return;
    }
    
    // Display each order
    allOrders.forEach(order => {
        const orderElement = createOrderCard(order);
        ordersContainer.appendChild(orderElement);
    });
}

// Function to create an order card
function createOrderCard(order) {
    const currentRider = JSON.parse(localStorage.getItem('currentRider'));
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-card';
    orderDiv.dataset.orderId = order.id;
    orderDiv.dataset.customerUsername = order.customerUsername;
    
    const isAccepted = order.acceptedBy && order.acceptedBy === currentRider.username;
    const canAccept = !order.acceptedBy; // Can accept if no one has accepted yet
    const canDeliver = isAccepted && order.status === 'Pending';
    
    orderDiv.innerHTML = `
        <div class="order-header">
            <h4>Order from ${order.customerName}</h4>
            <span class="order-status-badge status-${order.status.toLowerCase().replace(' ', '-')}">${order.status}</span>
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

// Global function to accept an order
window.acceptOrder = function(orderId, customerUsername) {
    const currentRider = JSON.parse(localStorage.getItem('currentRider'));
    
    // Get customer orders
    const ordersKey = 'customerOrders_' + customerUsername;
    const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    
    // Find and update the order
    const orderIndex = orders.findIndex(o => o.id == orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].acceptedBy = currentRider.username;
        orders[orderIndex].status = 'Pending';
        orders[orderIndex].acceptedAt = new Date().toISOString();
        
        // Save updated orders
        localStorage.setItem(ordersKey, JSON.stringify(orders));
        
        alert('Order accepted successfully!');
        
        // Reload orders
        loadAllOrders();
    }
};

// Global function to deliver an order
window.deliverOrder = function(orderId, customerUsername) {
    const currentRider = JSON.parse(localStorage.getItem('currentRider'));
    
    // Get customer orders
    const ordersKey = 'customerOrders_' + customerUsername;
    const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    
    // Find and update the order
    const orderIndex = orders.findIndex(o => o.id == orderId);
    if (orderIndex !== -1 && orders[orderIndex].acceptedBy === currentRider.username) {
        orders[orderIndex].status = 'Out for delivery';
        orders[orderIndex].deliveredAt = new Date().toISOString();
        
        // Save updated orders
        localStorage.setItem(ordersKey, JSON.stringify(orders));
        
        alert('Order is now out for delivery!');
        
        // Reload orders
        loadAllOrders();
    }
};

