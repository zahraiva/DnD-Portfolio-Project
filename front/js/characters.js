// Character Class Interaction
document.addEventListener('DOMContentLoaded', function() {
    // Get all character details sections
    const characterDetails = document.querySelectorAll('.character-details');
    
    // Get the class selection container
    const classSelection = document.querySelector('.class-selection');
    
    // Get all view characters buttons
    const viewCharactersButtons = document.querySelectorAll('.view-characters-btn');
    
    // Add click event only to view characters buttons
    viewCharactersButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent the class card click event from firing
            
            // Get the class type from the parent card
            const classCard = this.closest('.class-card');
            const classType = classCard.getAttribute('data-class');
            
            // Show character details
            showCharacterDetails(classType);
        });
    });
    
    // Create and add back buttons to all character details sections
    characterDetails.forEach(detailSection => {
        // Create back button if it doesn't exist
        if (!detailSection.querySelector('.back-to-classes-btn')) {
            const backButton = document.createElement('button');
            backButton.className = 'back-to-classes-btn';
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Classes';
            
            // Add click event to back button
            backButton.addEventListener('click', showClassSelection);
            
            // Insert at the beginning of the section
            detailSection.insertBefore(backButton, detailSection.firstChild);
        }
    });
    
    // Function to show character details for a specific class
    function showCharacterDetails(classType) {
        // Hide the class selection
        classSelection.style.display = 'none';
        
        // Hide all character details sections first
        characterDetails.forEach(detail => {
            detail.style.display = 'none';
        });
        
        // Show the selected class's character details
        const selectedDetails = document.getElementById(`${classType}-characters`);
        if (selectedDetails) {
            // Show the details
            selectedDetails.style.display = 'block';
            
            // Scroll to top of characters section
            const charactersSection = document.getElementById('characters');
            if (charactersSection) {
                charactersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
    
    // Function to show class selection and hide character details
    function showClassSelection() {
        // Hide all character details
        characterDetails.forEach(detail => {
            detail.style.display = 'none';
        });
        
        // Show class selection
        classSelection.style.display = 'block';
        
        // Scroll to the class selection
        classSelection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Prevent class cards from triggering clicks when buttons are pressed
    const classCards = document.querySelectorAll('.class-card');
    classCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only trigger if the click was directly on the card (not on a button)
            if (e.target === this || e.target.tagName !== 'BUTTON') {
                const classType = this.getAttribute('data-class');
                showCharacterDetails(classType);
            }
        });
    });
});
