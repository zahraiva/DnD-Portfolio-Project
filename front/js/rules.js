document.addEventListener('DOMContentLoaded', function() {
    const rulesBtn = document.getElementById('rulesBtn');
    
    if (rulesBtn) {
        rulesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // You can replace this with the actual URL to your rules document
            // For now, it just shows an alert
            alert("Game rules will be available here!");
            
            // Alternative: Open a modal with rules content
            // if (typeof showModal === 'function') {
            //     showModal('rulesModal');
            // }
            
            // Alternative: Navigate to a rules page
            // window.showPage('rules');
        });
    }
});
