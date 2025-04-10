document.addEventListener('DOMContentLoaded', function() {
    console.log("Character icons fix loaded");
    
    // Fix FontAwesome icon classes that don't exist
    function fixFontAwesomeIcons() {
        // Check if we have character data
        if (!window.charactersByClass) return;
        
        // Fix icons that don't exist in FontAwesome
        for (const group in window.charactersByClass) {
            window.charactersByClass[group].forEach(character => {
                // Fix specific icons that don't exist in FontAwesome 6
                switch (character.icon) {
                    case 'fa-sword':
                        character.icon = 'fa-khanda';
                        break;
                    case 'fa-axe':
                        character.icon = 'fa-axe-battle';
                        break;
                    case 'fa-bow-arrow':
                        character.icon = 'fa-bullseye';
                        break;
                    case 'fa-pray':
                        character.icon = 'fa-hands';
                        break;
                }
            });
        }
        
        console.log("Fixed FontAwesome icon classes");
    }
    
    // Fix immediately if data is already loaded
    if (window.charactersByClass) {
        fixFontAwesomeIcons();
    }
    
    // Also wait for data to be loaded later
    const checkInterval = setInterval(() => {
        if (window.charactersByClass) {
            fixFontAwesomeIcons();
            clearInterval(checkInterval);
        }
    }, 500);
    
    // Additional helper to force regenerate the selection content
    window.refreshCharacterSelection = function() {
        if (typeof window.generateCharacterSelectionContent === 'function') {
            window.generateCharacterSelectionContent();
            console.log("Character selection content regenerated");
        } else {
            console.error("generateCharacterSelectionContent function not found");
        }
    };
    
    // Ensure modal shows clearly
    window.ensureModalVisible = function() {
        const modal = document.getElementById('characterSelectionModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.classList.add('show');
            console.log("Modal visibility enforced");
        }
    };
});
