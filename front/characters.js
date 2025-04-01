// Character Class Interaction
document.addEventListener('DOMContentLoaded', function() {
    // Get all class cards and character details sections
    const classCards = document.querySelectorAll('.class-card');
    const characterDetails = document.querySelectorAll('.character-details');
    const viewCharactersButtons = document.querySelectorAll('.view-characters-btn');
    
    // Add click event to each class card
    classCards.forEach(card => {
        card.addEventListener('click', function() {
            const classType = this.getAttribute('data-class');
            showCharacterDetails(classType);
        });
    });
    
    // Add click event to view characters buttons
    viewCharactersButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the class card click event from firing
            const classType = this.closest('.class-card').getAttribute('data-class');
            showCharacterDetails(classType);
        });
    });
    
    // Function to show character details for a specific class
    function showCharacterDetails(classType) {
        // Hide all character details sections
        characterDetails.forEach(detail => {
            detail.style.display = 'none';
        });
        
        // Show the selected class's character details
        const selectedDetails = document.getElementById(`${classType}-characters`);
        if (selectedDetails) {
            selectedDetails.style.display = 'block';
            
            // Scroll to the character details
            selectedDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});
