document.addEventListener('DOMContentLoaded', function() {
    console.log("Add character button fix loaded");
    
    // Create character selection modal if it doesn't exist
    function ensureCharacterModalExists() {
        if (!document.getElementById('characterSelectionModal')) {
            console.log("Creating character selection modal");
            const modal = document.createElement('div');
            modal.id = 'characterSelectionModal';
            modal.className = 'character-selection-modal';
            modal.innerHTML = `
                <div class="character-selection-content">
                    <!-- Content will be populated by character-selection.js -->
                </div>
            `;
            document.body.appendChild(modal);
        }
    }
    
    // Ensure modal exists
    ensureCharacterModalExists();
    
    // Direct fix for the Add Character button
    const addCharacterBtn = document.querySelector('.add-character-btn');
    if (addCharacterBtn) {
        console.log("Found Add Character button, adding direct click handler");
        
        // Remove any existing event listeners by cloning the element
        const newBtn = addCharacterBtn.cloneNode(true);
        addCharacterBtn.parentNode.replaceChild(newBtn, addCharacterBtn);
        
        // Add new direct click handler
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = document.getElementById('characterSelectionModal');
            if (modal) {
                console.log("Showing character selection modal");
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
                
                // Ensure characters are loaded
                if (typeof loadCharacterSelections === 'function') {
                    loadCharacterSelections();
                }
            } else {
                console.error("Character selection modal not found!");
            }
        });
    } else {
        console.error("Add Character button not found in the DOM");
    }
    
    // Helper function for other scripts to call
    window.loadCharacterSelections = function() {
        // If character-selection.js has loaded the charactersByClass data
        if (window.charactersByClass || 
            (typeof generateCharacterSelectionContent === 'function')) {
            console.log("Character data available, generating content");
            if (typeof generateCharacterSelectionContent === 'function') {
                generateCharacterSelectionContent();
            }
        } else {
            console.log("No character data available, using fallback");
            // Create a minimal character selection interface
            createFallbackCharacterSelection();
        }
    };
    
    // Fallback character selection if the main one fails
    function createFallbackCharacterSelection() {
        const modal = document.getElementById('characterSelectionModal');
        if (!modal) return;
        
        const modalContent = modal.querySelector('.character-selection-content');
        if (!modalContent) return;
        
        console.log("Creating fallback character selection");
        
        // Basic character types
        const characterTypes = [
            { id: 'wizard', name: 'Wizard', icon: 'fa-hat-wizard', color: '#9c27b0' },
            { id: 'fighter', name: 'Fighter', icon: 'fa-shield-alt', color: '#e53935' },
            { id: 'rogue', name: 'Rogue', icon: 'fa-mask', color: '#546e7a' },
            { id: 'cleric', name: 'Cleric', icon: 'fa-pray', color: '#ffc107' }
        ];
        
        let html = '<h2>Add Character to Map</h2>';
        html += '<div class="character-grid">';
        
        characterTypes.forEach(char => {
            html += `
                <div class="character-type-option" data-id="${char.id}" data-name="${char.name}" data-color="${char.color}">
                    <div class="character-icon" style="background-color: ${char.color}">
                        <i class="fas ${char.icon}"></i>
                    </div>
                    <h3>${char.name}</h3>
                </div>
            `;
        });
        
        html += '</div>';
        html += '<button class="close-selection-btn">Cancel</button>';
        
        modalContent.innerHTML = html;
        
        // Add event listeners
        const characterOptions = modalContent.querySelectorAll('.character-type-option');
        characterOptions.forEach(option => {
            option.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const color = this.getAttribute('data-color');
                const icon = this.querySelector('i').className.replace('fas ', '');
                
                // Add character to map if function exists
                if (typeof window.addCharacterToMap === 'function') {
                    window.addCharacterToMap({
                        id,
                        name,
                        class: id,
                        color,
                        icon
                    });
                } else {
                    console.error("addCharacterToMap function not found");
                }
            });
        });
        
        // Add close button handler
        const closeBtn = modalContent.querySelector('.close-selection-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
        }
        
        // Add CSS for the fallback
        addFallbackStyles();
    }
    
    function addFallbackStyles() {
        // Only add if not already added
        if (document.getElementById('fallback-character-styles')) return;
        
        const styleElem = document.createElement('style');
        styleElem.id = 'fallback-character-styles';
        styleElem.textContent = `
            .character-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .character-type-option {
                background: rgba(10, 31, 18, 0.7);
                border: 1px solid rgba(122, 198, 125, 0.2);
                border-radius: 8px;
                padding: 1.5rem 1rem;
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .character-type-option:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                border-color: var(--accent);
            }
            
            .character-icon {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
            }
            
            .character-type-option h3 {
                margin: 0;
                color: var(--text-light);
                font-size: 1.1rem;
                font-family: 'Cinzel', serif;
            }
        `;
        document.head.appendChild(styleElem);
    }
    
    // Direct fix for closing the modal by clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('characterSelectionModal');
        if (modal && modal.classList.contains('show')) {
            // If clicking outside the modal content
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        }
    });
    
    // Fix for the showCharacterSelection global function
    if (!window.showCharacterSelection) {
        window.showCharacterSelection = function() {
            const modal = document.getElementById('characterSelectionModal');
            if (modal) {
                console.log("Showing character selection modal via global function");
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
                
                // Ensure content is loaded
                if (typeof loadCharacterSelections === 'function') {
                    loadCharacterSelections();
                }
            }
        };
    }
});
