/**
 * Character Modal Fix - Ensures character selection modal works properly
 */
(function() {
    console.log("Character modal fix loaded");
    
    // Wait for document to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Direct approach to fix the add character button
        fixAddCharacterButton();
        
        // Ensure modal exists and has proper structure
        ensureModalExists();
        
        // Fix any event listener conflicts
        fixEventListeners();
        
        console.log("Character modal fixes applied");
    });
    
    // Direct fix for add character button 
    function fixAddCharacterButton() {
        const addCharBtn = document.querySelector('.add-character-btn');
        if (!addCharBtn) return;
        
        // Create a clean replacement button
        const newBtn = document.createElement('button');
        newBtn.className = 'map-control-btn add-character-btn';
        newBtn.innerHTML = '<i class="fas fa-user-plus"></i> Add Character';
        
        // Replace the existing button
        if (addCharBtn.parentNode) {
            addCharBtn.parentNode.replaceChild(newBtn, addCharBtn);
        }
        
        // Add a direct reliable click handler
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log("Add character button clicked - direct handler");
            
            // Force recreate the modal to ensure fresh state
            recreateModal();
            
            // Show the modal with delay to ensure DOM updates
            setTimeout(showCharacterModal, 50);
        });
        
        console.log("Add character button fixed with direct handler");
    }
    
    // Ensure modal exists with proper structure
    function ensureModalExists() {
        let modal = document.getElementById('characterSelectionModal');
        
        // Create modal if it doesn't exist
        if (!modal) {
            recreateModal();
        } else {
            // Make sure the modal has the proper content structure
            const modalContent = modal.querySelector('.character-selection-content');
            if (!modalContent || !modalContent.children.length) {
                recreateModal();
            }
        }
    }
    
    // Completely recreate the modal
    function recreateModal() {
        console.log("Recreating character selection modal");
        
        // Remove existing modal if it exists
        let existingModal = document.getElementById('characterSelectionModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create a new modal
        const modal = document.createElement('div');
        modal.id = 'characterSelectionModal';
        modal.className = 'character-selection-modal';
        modal.innerHTML = `
            <div class="character-selection-content">
                <!-- Content will be generated dynamically -->
                <h2>Loading Characters...</h2>
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(modal);
        
        // Initialize modal content with character data
        if (window.charactersByClass && typeof window.generateCharacterSelectionContent === 'function') {
            window.generateCharacterSelectionContent();
        } else {
            console.log("Using fallback character selection");
            createFallbackContent(modal);
        }
        
        // Add modal event listeners
        setupModalEvents(modal);
    }
    
    // Set up event listeners for the modal
    function setupModalEvents(modal) {
        // Close modal when clicking outside content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideCharacterModal();
            }
        });
        
        // Prevent clicks inside from closing
        const modalContent = modal.querySelector('.character-selection-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
        
        // Add close button handler
        const closeBtn = modal.querySelector('.close-selection-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                hideCharacterModal();
            });
        }
    }
    
    // Create fallback content if main content generation fails
    function createFallbackContent(modal) {
        const modalContent = modal.querySelector('.character-selection-content');
        if (!modalContent) return;
        
        // Basic character options by class
        const classes = [
            { id: 'mage', name: 'Mages', icon: 'fa-hat-wizard', color: '#9c27b0', 
              chars: ['Wizard', 'Sorcerer', 'Warlock', 'Druid'] },
            { id: 'warrior', name: 'Warriors', icon: 'fa-shield-alt', color: '#e53935',
              chars: ['Fighter', 'Barbarian', 'Monk', 'Paladin'] },
            { id: 'scoundrel', name: 'Scoundrels', icon: 'fa-mask', color: '#546e7a',
              chars: ['Rogue', 'Ranger', 'Bard'] },
            { id: 'healer', name: 'Healers', icon: 'fa-hands', color: '#ffc107',
              chars: ['Cleric', 'Druid', 'Paladin'] }
        ];
        
        // Create tabs
        let tabsHtml = '<div class="selection-tabs">';
        classes.forEach((cls, index) => {
            const activeClass = index === 0 ? 'active' : '';
            tabsHtml += `
                <button class="selection-tab ${activeClass}" data-class="${cls.id}">
                    <i class="fas ${cls.icon}"></i>
                    ${cls.name}
                </button>
            `;
        });
        tabsHtml += '</div>';
        
        // Create content panels
        let panelsHtml = '<div class="selection-panels">';
        classes.forEach((cls, index) => {
            const activeClass = index === 0 ? 'active' : '';
            let charsHtml = '';
            
            cls.chars.forEach((char, charIndex) => {
                const charId = `${cls.id}-${charIndex}`;
                charsHtml += `
                    <div class="character-option" data-id="${charId}" data-name="${char}" data-class="${char.toLowerCase()}" data-color="${cls.color}">
                        <div class="character-option-info">
                            <h4>${char}</h4>
                            <p>${cls.name}</p>
                        </div>
                        <div class="character-option-action">
                            <button class="add-to-map-btn" title="Add to Map">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            panelsHtml += `<div class="selection-panel ${activeClass}" data-class="${cls.id}">${charsHtml}</div>`;
        });
        panelsHtml += '</div>';
        
        // Add content to modal
        modalContent.innerHTML = `
            <h2>Select a Character</h2>
            ${tabsHtml}
            ${panelsHtml}
            <button class="close-selection-btn">Cancel</button>
        `;
        
        // Add tab switching functionality
        const tabs = modalContent.querySelectorAll('.selection-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const selectedClass = tab.getAttribute('data-class');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active panel
                const panels = modalContent.querySelectorAll('.selection-panel');
                panels.forEach(p => p.classList.remove('active'));
                modalContent.querySelector(`.selection-panel[data-class="${selectedClass}"]`).classList.add('active');
            });
        });
        
        // Add character add functionality
        const addButtons = modalContent.querySelectorAll('.add-to-map-btn');
        addButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const charOption = btn.closest('.character-option');
                const id = charOption.getAttribute('data-id');
                const name = charOption.getAttribute('data-name');
                const charClass = charOption.getAttribute('data-class');
                const color = charOption.getAttribute('data-color');
                
                if (typeof window.addCharacterToMap === 'function') {
                    window.addCharacterToMap({
                        id,
                        name,
                        class: charClass,
                        color: color,
                        icon: getIconForClass(charClass)
                    });
                    
                    // Visual feedback
                    btn.classList.add('added');
                    setTimeout(() => {
                        btn.classList.remove('added');
                        hideCharacterModal();
                    }, 500);
                }
            });
        });
    }
    
    // Helper to get icon for a class
    function getIconForClass(charClass) {
        switch(charClass.toLowerCase()) {
            case 'wizard': 
            case 'sorcerer': 
            case 'warlock': return 'fa-hat-wizard';
            case 'druid': return 'fa-leaf';
            case 'fighter': 
            case 'barbarian': return 'fa-shield-alt';
            case 'monk': return 'fa-hand-rock';
            case 'rogue': return 'fa-mask';
            case 'ranger': return 'fa-bullseye';
            case 'bard': return 'fa-music';
            case 'cleric': 
            case 'paladin': return 'fa-hands';
            default: return 'fa-user';
        }
    }
    
    // Fix any event listener conflicts
    function fixEventListeners() {
        // Prevent any bubbling issues with map controls
        const mapControls = document.querySelectorAll('.map-control-btn');
        mapControls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
        
        // Make sure global function is available
        window.showCharacterSelection = showCharacterModal;
    }
    
    // Show character modal
    function showCharacterModal() {
        const modal = document.getElementById('characterSelectionModal');
        if (!modal) {
            recreateModal();
            setTimeout(() => {
                const newModal = document.getElementById('characterSelectionModal');
                if (newModal) {
                    newModal.style.display = 'flex';
                    setTimeout(() => newModal.classList.add('show'), 10);
                }
            }, 50);
            return;
        }
        
        // Show modal with transition
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        
        console.log("Character selection modal shown");
    }
    
    // Hide character modal
    function hideCharacterModal() {
        const modal = document.getElementById('characterSelectionModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Match transition duration
        }
    }

    // Make functions available globally
    window.showCharacterModal = showCharacterModal;
    window.hideCharacterModal = hideCharacterModal;
    window.recreateCharacterModal = recreateModal;
})();
