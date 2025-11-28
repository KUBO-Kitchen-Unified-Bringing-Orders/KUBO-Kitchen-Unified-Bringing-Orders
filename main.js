// Main JavaScript file for index.html
// Handles rider card click events and redirects to respective rider pages

document.addEventListener('DOMContentLoaded', function() {
    // Get all rider cards
    const riderCards = document.querySelectorAll('.rider-card');
    
    // Add click event listener to each rider card
    riderCards.forEach((card, index) => {
        // Add cursor pointer style
        card.style.cursor = 'pointer';
        
        // Add click event listener
        card.addEventListener('click', function() {
            // Get the rider number (index + 1)
            const riderNumber = index + 1;
            
            // Redirect to the corresponding rider page using JavaScript
            window.location.href = `rider_${riderNumber}.html`;
        });
    });
});

