document.addEventListener('DOMContentLoaded', () => {
    console.log('Story script loaded');
    
    // Story modal functionality
    const storyDetailsModal = document.getElementById('storyDetailsModal');
    const storyDetailsBtns = document.querySelectorAll('.story-details-btn');
    const storyCreateBtn = document.querySelector('.story-create-btn');
    
    // Check for modal
    if (!storyDetailsModal) {
        console.error('Story modal not found');
        return;
    }
    
    const closeStoryModal = storyDetailsModal.querySelector('.close');
    
    // Open story details modal - Fixed implementation
    storyDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Story button clicked');
            const storyId = btn.getAttribute('data-story');
            console.log('Story ID:', storyId);
            
            // Hide all story details first
            document.querySelectorAll('.story-details').forEach(details => {
                details.style.display = 'none';
            });
            
            // Show the selected story details
            const storyDetails = document.getElementById(`${storyId}-details`);
            if (storyDetails) {
                storyDetails.style.display = 'block';
                
                // Make sure modal is styled properly before showing
                const modalContent = storyDetailsModal.querySelector('.modal-content');
                modalContent.style.maxHeight = '90vh';
                modalContent.style.overflowY = 'auto';
                
                // Show the modal
                storyDetailsModal.style.display = 'block';
                
                // Reset scroll position to top
                setTimeout(() => {
                    modalContent.scrollTop = 0;
                }, 10);
            } else {
                console.error(`Story details not found for: ${storyId}`);
            }
        });
    });
    
    // Close story modal when clicking the X
    if (closeStoryModal) {
        closeStoryModal.addEventListener('click', () => {
            storyDetailsModal.style.display = 'none';
        });
    }
    
    // Close story modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === storyDetailsModal) {
            storyDetailsModal.style.display = 'none';
        }
    });
    
    // Start Adventure button functionality
    const startAdventureBtns = document.querySelectorAll('.start-adventure-btn');
    
    startAdventureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Close the modal first
            storyDetailsModal.style.display = 'none';
            
            // Open the create game modal to set up the adventure
            const createGameModal = document.getElementById('createGameModal');
            if (createGameModal) {
                createGameModal.style.display = 'block';
            }
        });
    });
    
    // Create Your Own story button
    if (storyCreateBtn) {
        storyCreateBtn.addEventListener('click', () => {
            const createGameModal = document.getElementById('createGameModal');
            if (createGameModal) {
                createGameModal.style.display = 'block';
            }
        });
    }
    
    // Make story cards visible on load
    document.querySelectorAll('.story-card').forEach(card => {
        card.classList.add('visible');
    });
    
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.add('visible');
    });
    
    document.querySelector('.map-preview').classList.add('visible');
});
