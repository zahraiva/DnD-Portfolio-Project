// Character modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('characterModal');
    const modalImage = document.getElementById('modalCharacterImage');
    const modalName = document.getElementById('modalCharacterName');
    const modalClass = document.getElementById('modalCharacterClass').querySelector('span');
    const modalRace = document.getElementById('modalCharacterRace').querySelector('span');
    const modalLevel = document.getElementById('modalCharacterLevel').querySelector('span');
    const modalSpecialty = document.getElementById('modalCharacterSpecialty').querySelector('span');
    const modalBackground = document.getElementById('modalCharacterBackground').querySelector('span');
    const closeButton = document.querySelector('.character-modal-close');
    
    // Get all character cards
    const characterCards = document.querySelectorAll('.character-detail-card');
    
    // Add click event to each character card
    characterCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get character data from the card
            const portrait = this.querySelector('.character-portrait img');
            const name = this.querySelector('.character-info h4').textContent;
            const classInfo = this.querySelector('.character-info p:nth-child(2)').textContent.split(':')[1].trim();
            const race = this.querySelector('.character-info p:nth-child(3)').textContent.split(':')[1].trim();
            const level = this.querySelector('.character-info p:nth-child(4)').textContent.split(':')[1].trim();
            const specialty = this.querySelector('.character-info p:nth-child(5)').textContent.split(':')[1].trim();
            const background = this.querySelector('.character-info p:nth-child(6)').textContent.split(':')[1].trim();
            
            // Set modal content
            modalImage.src = portrait.src;
            modalImage.alt = portrait.alt;
            modalName.textContent = name;
            modalClass.textContent = classInfo;
            modalRace.textContent = race;
            modalLevel.textContent = level;
            modalSpecialty.textContent = specialty;
            modalBackground.textContent = background;
            
            // Show modal
            modal.classList.add('show');
            
            // Prevent scrolling on body
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal when clicking close button
    closeButton.addEventListener('click', function() {
        closeModal();
    });
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Function to close modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});
