document.addEventListener('DOMContentLoaded', function() {
    console.log("Character selection script loaded");
    
    // Character data organized by class
    const charactersByClass = {
        mages: [
            {
                id: 'kaazimir',
                name: 'Kaazimir Flamescale',
                class: 'sorcerer',
                race: 'Dragonborn',
                image: 'images/kaazimir.webp',
                icon: 'fa-hat-wizard',
                color: '#9c27b0'
            },
            {
                id: 'thorna',
                name: 'Thorna Wildroot',
                class: 'druid',
                race: 'Human',
                image: 'images/thorna.jpg',
                icon: 'fa-leaf',
                color: '#43a047'
            },
            {
                id: 'mephistus',
                name: 'Mephistus Darkthorn',
                class: 'warlock',
                race: 'Tiefling',
                image: 'images/mephistus.jpg',
                icon: 'fa-book',
                color: '#7e57c2'
            },
            {
                id: 'sylindra',
                name: 'Sylindra Starweaver',
                class: 'wizard',
                race: 'High-Elf',
                image: 'images/sylindra.jpg',
                icon: 'fa-hat-wizard',
                color: '#2196f3'
            },
            {
                id: 'gandalf',
                name: 'Gandalf the Grey',
                class: 'wizard',
                race: 'Maiar',
                image: 'images/gandalf.jpg',
                icon: 'fa-hat-wizard',
                color: '#607d8b'
            }
        ],
        warriors: [
            {
                id: 'gareth',
                name: 'Gareth Stormborn',
                class: 'fighter',
                race: 'Human',
                image: 'images/gareth.jpg',
                icon: 'fa-shield-alt',
                color: '#e53935'
            },
            {
                id: 'kord',
                name: 'Kord Thunderfury',
                class: 'barbarian',
                race: 'Human',
                image: 'images/kord.jpg',
                icon: 'fa-axe',
                color: '#d32f2f'
            },
            {
                id: 'aelindra',
                name: 'Aelindra Swiftblade',
                class: 'fighter',
                race: 'High-Elf',
                image: 'images/aelindra.jpg',
                icon: 'fa-shield-alt',
                color: '#e53935'
            },
            {
                id: 'pippin',
                name: 'Pippin Quickfoot',
                class: 'monk',
                race: 'Halfling',
                image: 'images/pippin.jpg',
                icon: 'fa-hand-rock',
                color: '#ff5722'
            }
        ],
        scoundrels: [
            {
                id: 'zaknafein',
                name: 'Zaknafein Do\'Urden',
                class: 'rogue',
                race: 'Drow',
                image: 'images/zaknafein.jpg',
                icon: 'fa-mask',
                color: '#546e7a'
            },
            {
                id: 'leshanna',
                name: 'Leshanna Silverleaf',
                class: 'ranger',
                race: 'Wood Elf',
                image: 'images/leshanna.png',
                icon: 'fa-bow-arrow',
                color: '#689f38'
            },
            {
                id: 'vaeris',
                name: 'Vaeris Moonwhisper',
                class: 'bard',
                race: 'Half-Elf',
                image: 'images/vaeris.png',
                icon: 'fa-music',
                color: '#9575cd'
            },
            {
                id: 'lidda',
                name: 'Lidda Nimblefingers',
                class: 'rogue',
                race: 'Halfling',
                image: 'images/lidda.jpg',
                icon: 'fa-mask',
                color: '#455a64'
            }
        ],
        healers: [
            {
                id: 'bruenor',
                name: 'Bruenor Stoneheart',
                class: 'cleric',
                race: 'Dwarf',
                image: 'images/bruenor.jpg',
                icon: 'fa-hands',
                color: '#ffc107'
            },
            {
                id: 'grommash',
                name: 'Grommash Healfist',
                class: 'paladin',
                race: 'Half-Orc',
                image: 'images/grommash.jpg',
                icon: 'fa-hammer',
                color: '#ffb300'
            },
            {
                id: 'elaria',
                name: 'Elaria Lightbringer',
                class: 'cleric',
                race: 'Human',
                image: 'images/elaria.webp',
                icon: 'fa-sun',
                color: '#fdd835'
            },
            {
                id: 'tristan',
                name: 'Tristan Valorheart',
                class: 'paladin',
                race: 'Human',
                image: 'images/tristan.jpg',
                icon: 'fa-shield-alt',
                color: '#ffb300'
            }
        ]
    };
    
    // Make the charactersByClass accessible globally for debugging and other scripts
    window.charactersByClass = charactersByClass;
    
    // Generate tabs and character selections
    function generateCharacterSelectionContent() {
        const modal = document.getElementById('characterSelectionModal');
        if (!modal) {
            console.error("Character selection modal not found");
            return;
        }
        
        const classGroups = Object.keys(charactersByClass);
        
        // Create tabs
        let tabsHtml = '<div class="selection-tabs">';
        classGroups.forEach((group, index) => {
            const activeClass = index === 0 ? 'active' : '';
            let tabIcon = '';
            switch(group) {
                case 'mages': tabIcon = 'fa-hat-wizard'; break;
                case 'warriors': tabIcon = 'fa-shield-alt'; break;
                case 'scoundrels': tabIcon = 'fa-mask'; break;
                case 'healers': tabIcon = 'fa-hands'; break;
            }
            tabsHtml += `<button class="selection-tab ${activeClass}" data-group="${group}">
                <i class="fas ${tabIcon}"></i> 
                ${group.charAt(0).toUpperCase() + group.slice(1)}
            </button>`;
        });
        tabsHtml += '</div>';
        
        // Create character panels for each tab
        let panelsHtml = '<div class="selection-panels">';
        classGroups.forEach((group, index) => {
            const activeClass = index === 0 ? 'active' : '';
            let charactersHtml = '';
            
            charactersByClass[group].forEach(character => {
                // Create a character option with improved visuals
                charactersHtml += `
                <div class="character-option" data-id="${character.id}" data-name="${character.name}" data-class="${character.class}" data-color="${character.color}">
                    <div class="character-option-portrait" style="border-color: ${character.color}">
                        <img src="${character.image}" alt="${character.name}">
                    </div>
                    <div class="character-option-info">
                        <h4>${character.name}</h4>
                        <p>${character.race} ${character.class.charAt(0).toUpperCase() + character.class.slice(1)}</p>
                    </div>
                    <div class="character-option-action">
                        <button class="add-to-map-btn" title="Add to Map">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>`;
            });
            
            panelsHtml += `<div class="selection-panel ${activeClass}" data-group="${group}">${charactersHtml}</div>`;
        });
        panelsHtml += '</div>';
        
        // Add content to modal
        const modalContent = modal.querySelector('.character-selection-content');
        if (modalContent) {
            modalContent.innerHTML = `
                <h2>Select a Character</h2>
                ${tabsHtml}
                ${panelsHtml}
                <button class="close-selection-btn">Cancel</button>
            `;
            
            // Add event listeners to tabs
            const tabs = modalContent.querySelectorAll('.selection-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    
                    // Remove active class from all tabs and panels
                    modalContent.querySelectorAll('.selection-tab').forEach(t => t.classList.remove('active'));
                    modalContent.querySelectorAll('.selection-panel').forEach(p => p.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding panel
                    tab.classList.add('active');
                    const group = tab.getAttribute('data-group');
                    modalContent.querySelector(`.selection-panel[data-group="${group}"]`).classList.add('active');
                });
            });
            
            // Add event listeners to character options
            const characterOptions = modalContent.querySelectorAll('.character-option');
            characterOptions.forEach(option => {
                // Listen for clicks on the option itself
                option.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    
                    // Only trigger if clicked directly on the option (not the button)
                    if (e.target.closest('.add-to-map-btn') === null) {
                        // Highlight the selected character
                        characterOptions.forEach(opt => opt.classList.remove('selected'));
                        option.classList.add('selected');
                    }
                });
                
                // Listen for clicks on the add button
                const addButton = option.querySelector('.add-to-map-btn');
                if (addButton) {
                    addButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        
                        const id = option.getAttribute('data-id');
                        const name = option.getAttribute('data-name');
                        const characterClass = option.getAttribute('data-class');
                        const color = option.getAttribute('data-color');
                        
                        console.log(`Adding character to map: ${name} (${characterClass})`);
                        
                        // Find the character data in our array
                        let characterData = null;
                        for (const group in charactersByClass) {
                            const character = charactersByClass[group].find(c => c.id === id);
                            if (character) {
                                characterData = character;
                                break;
                            }
                        }
                        
                        // Add character to map
                        if (typeof window.addCharacterToMap === 'function') {
                            window.addCharacterToMap({
                                id,
                                name,
                                class: characterClass,
                                color: color,
                                image: characterData ? characterData.image : null,
                                icon: characterData ? characterData.icon : null
                            });
                            
                            // Add visual feedback
                            addButton.classList.add('added');
                            setTimeout(() => {
                                addButton.classList.remove('added');
                            }, 1000);
                        } else {
                            console.error("addCharacterToMap function not found");
                        }
                    });
                }
            });
            
            // Add close button event listener
            const closeBtn = modalContent.querySelector('.close-selection-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                });
            }
        }
    }
    
    // Setup character selection modal events
    function setupCharacterSelectionModal() {
        const modal = document.getElementById('characterSelectionModal');
        if (!modal) return;
        
        // Close when clicking outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
        });
        
        // Ensure the modal content doesn't close the modal when clicked
        const modalContent = modal.querySelector('.character-selection-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop click from reaching modal background
            });
        }
    }
    
    // Create the character modal if it doesn't exist
    function createCharacterSelectionModal() {
        // Check if modal already exists
        if (document.getElementById('characterSelectionModal')) return;
        
        // Create the modal structure
        const modal = document.createElement('div');
        modal.id = 'characterSelectionModal';
        modal.className = 'character-selection-modal';
        modal.innerHTML = `
            <div class="character-selection-content">
                <!-- Content will be generated by JavaScript -->
            </div>
        `;
        
        // Append to body
        document.body.appendChild(modal);
        
        // Initialize the modal
        generateCharacterSelectionContent();
        setupCharacterSelectionModal();
    }
    
    // Make the function globally available
    window.showCharacterSelection = function() {
        // Create modal if it doesn't exist
        createCharacterSelectionModal();
        
        // Show the modal
        const modal = document.getElementById('characterSelectionModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }
    };
    
    // Make generate content function globally available
    window.generateCharacterSelectionContent = generateCharacterSelectionContent;
    
    // Initialize when document is ready
    createCharacterSelectionModal();
    
    // Handle the "Add Character" button click
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-character-btn')) {
            window.showCharacterSelection();
        }
    });
});
