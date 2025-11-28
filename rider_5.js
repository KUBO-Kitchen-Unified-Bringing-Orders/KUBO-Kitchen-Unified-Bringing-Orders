// JavaScript file for Rider 5 page
// Handles order creation when user adds a note and clicks Done

document.addEventListener('DOMContentLoaded', function() {
    // Check if customer is logged in
    const currentCustomer = localStorage.getItem('currentCustomer');
    
    if (!currentCustomer) {
        alert('Please login to place an order.');
        window.location.href = 'login.html';
        return;
    }
    
    const customer = JSON.parse(currentCustomer);
    const riderName = 'Alexander Dominic Figueroa';
    const riderNumber = 5;
    
    // Handle the Done button click
    const doneButton = document.querySelector('.done-button');
    if (doneButton) {
        doneButton.addEventListener('click', function() {
            const note = document.getElementById('rider-note').value.trim();
            
            if (!note) {
                alert('Please add a note for your order!');
                return;
            }
            
            // Create order object
            const order = {
                id: Date.now(),
                note: note,
                riderName: riderName,
                riderNumber: riderNumber,
                status: 'Waiting for rider',
                acceptedBy: null,
                createdAt: new Date().toISOString()
            };
            
            // Get existing orders for this customer
            const ordersKey = 'customerOrders_' + customer.username;
            const existingOrders = localStorage.getItem(ordersKey);
            const orders = existingOrders ? JSON.parse(existingOrders) : [];
            
            // Add new order
            orders.push(order);
            localStorage.setItem(ordersKey, JSON.stringify(orders));
            
            alert('Order placed successfully!');
            
            // Clear the note field
            document.getElementById('rider-note').value = '';
        });
    }
});

