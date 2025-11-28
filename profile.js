// JavaScript file for profile.html
// Displays customer profile information and handles logout

document.addEventListener('DOMContentLoaded', function() {
    // Check if customer is logged in
    const currentCustomer = localStorage.getItem('currentCustomer');
    
    if (!currentCustomer) {
        // If not logged in, redirect to login page
        alert('Please login to view your profile.');
        window.location.href = 'login.html';
        return;
    }
    
    // Parse customer data
    const customer = JSON.parse(currentCustomer);
    
    // Display customer information
    const fullName = customer.firstName + ' ' + customer.lastName;
    document.getElementById('profile-name').textContent = fullName;
    document.getElementById('profile-address').textContent = customer.address;
    document.getElementById('profile-gender').textContent = customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1);
    
    // Load and display orders
    loadOrders(customer.username);
    
    // Handle logout button
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', function() {
        // Remove current customer from localStorage
        localStorage.removeItem('currentCustomer');
        alert('You have been logged out successfully.');
        // Redirect to home page
        window.location.href = 'index.html';
    });
});

// Function to load orders for the customer
function loadOrders(username) {
    // Get orders from localStorage (if they exist)
    const orders = localStorage.getItem('customerOrders_' + username);
    const ordersList = document.getElementById('orders-list');
    
    if (orders) {
        const ordersArray = JSON.parse(orders);
        // Reverse to show newest first
        ordersArray.reverse().forEach(order => {
            const orderElement = createOrderElement(order);
            ordersList.appendChild(orderElement);
        });
    } else {
        // Show message if no orders exist
        const noOrdersMsg = document.createElement('p');
        noOrdersMsg.textContent = 'No orders yet. Click on a rider to place an order!';
        noOrdersMsg.style.textAlign = 'center';
        noOrdersMsg.style.color = '#666';
        noOrdersMsg.style.padding = '20px';
        ordersList.appendChild(noOrdersMsg);
    }
}

// Function to create an order element
function createOrderElement(order) {
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-entry';
    
    // Format status for display
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

