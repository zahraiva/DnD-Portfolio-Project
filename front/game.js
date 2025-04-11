document.addEventListener('DOMContentLoaded', function() {
    console.log("Game script loaded");
    
    // Get DOM elements
    const createGameBtn = document.getElementById('createGameBtn');
    const createGameModal = document.getElementById('createGameModal');
    const createGameForm = document.getElementById('createGameForm');
    const charactersList = document.getElementById('charactersList');
    const addCharacterBtn = document.getElementById('addCharacterBtn');
    
    // Map story IDs to map IDs
    const storyToMapMapping = {
        'curse-strahd': 'barovia',
        'lost-mines': 'phandelver',
        'witchlight': 'witchlight'
    };
    
    // Open modal when Create Game button is clicked
    if (createGameBtn && createGameModal) {
        createGameBtn.addEventListener('click', function() {
            createGameModal.style.display = 'block';
        });
        
        // Close modal when X is clicked
        const closeBtn = createGameModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                createGameModal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target == createGameModal) {
                createGameModal.style.display = 'none';
            }
        });
    }
    
    // Add a new character field
    if (addCharacterBtn) {
        addCharacterBtn.addEventListener('click', function() {
            addCharacterField();
        });
    }
    
    // Handle form submission
    if (createGameForm) {
        createGameForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createGame();
        });
    }
    
    // Add character field function
    function addCharacterField() {
        const characterCount = charactersList.querySelectorAll('.character-entry').length;
        
        const characterEntry = document.createElement('div');
        characterEntry.className = 'character-entry';
        
        // Create a unique ID for this character entry
        const characterId = 'character-' + Date.now();
        characterEntry.setAttribute('data-character-id', characterId);
        
        // Populate with input fields
        characterEntry.innerHTML = `
            <input type="text" name="characterName" placeholder="Character Name">
            <select name="characterClass" class="character-class">
                <option value="">Select Class</option>
                <option value="warrior">Warrior</option>
                <option value="mage">Mage</option>
                <option value="rogue">Rogue</option>
                <option value="cleric">Cleric</option>
            </select>
            <div class="character-buttons">
                <button type="button" class="add-details-btn">Add Skills</button>
                <button type="button" class="add-items-btn">Add Items</button>
            </div>
            <button type="button" class="delete-character-btn"><i class="fas fa-times"></i></button>
        `;
        
        // Add to the list
        charactersList.appendChild(characterEntry);
        
        // Add event listener to delete button
        const deleteBtn = characterEntry.querySelector('.delete-character-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                characterEntry.remove();
            });
        }
        
        // Add event listeners for skills and items buttons
        const addDetailsBtn = characterEntry.querySelector('.add-details-btn');
        const addItemsBtn = characterEntry.querySelector('.add-items-btn');
        
        if (addDetailsBtn) {
            addDetailsBtn.addEventListener('click', function() {
                openSkillsModal(characterId);
            });
        }
        
        if (addItemsBtn) {
            addItemsBtn.addEventListener('click', function() {
                openItemsModal(characterId);
            });
        }
    }
    
    // Function to open the skills modal
    function openSkillsModal(characterId) {
        const modal = document.getElementById('characterDetailsModal');
        if (!modal) return;
        
        // Store the character ID in the modal for reference
        modal.setAttribute('data-target-character', characterId);
        
        // Clear previous content
        const textarea = document.getElementById('skillsTextarea');
        if (textarea) {
            textarea.value = '';
            
            // Check if character already has skills
            const characterEntry = document.querySelector(`.character-entry[data-character-id="${characterId}"]`);
            if (characterEntry) {
                const skillsData = characterEntry.getAttribute('data-skills');
                if (skillsData) {
                    textarea.value = skillsData.split(',').join('\n');
                }
            }
            
            updateSkillsPreview();
        }
        
        // Show modal
        modal.style.display = 'block';
    }
    
    // Function to open the items modal
    function openItemsModal(characterId) {
        const modal = document.getElementById('characterItemsModal');
        if (!modal) return;
        
        // Store the character ID in the modal for reference
        modal.setAttribute('data-target-character', characterId);
        
        // Clear previous content
        const textarea = document.getElementById('itemsTextarea');
        if (textarea) {
            textarea.value = '';
            
            // Check if character already has items
            const characterEntry = document.querySelector(`.character-entry[data-character-id="${characterId}"]`);
            if (characterEntry) {
                const itemsData = characterEntry.getAttribute('data-items');
                if (itemsData) {
                    textarea.value = itemsData.split(',').join('\n');
                }
            }
            
            updateItemsPreview();
        }
        
        // Show modal
        modal.style.display = 'block';
    }
    
    // Set up skills modal
    const skillsTextarea = document.getElementById('skillsTextarea');
    const skillsPreview = document.getElementById('skillsPreview');
    const saveSkillsBtn = document.getElementById('saveSkillsBtn');
    
    if (skillsTextarea) {
        skillsTextarea.addEventListener('input', updateSkillsPreview);
    }
    
    if (saveSkillsBtn) {
        saveSkillsBtn.addEventListener('click', saveSkills);
    }
    
    // Set up items modal
    const itemsTextarea = document.getElementById('itemsTextarea');
    const itemsPreview = document.getElementById('itemsPreview');
    const saveItemsBtn = document.getElementById('saveItemsBtn');
    
    if (itemsTextarea) {
        itemsTextarea.addEventListener('input', updateItemsPreview);
    }
    
    if (saveItemsBtn) {
        saveItemsBtn.addEventListener('click', saveItems);
    }
    
    // Update skills preview as user types
    function updateSkillsPreview() {
        if (!skillsTextarea || !skillsPreview) return;
        
        const skills = skillsTextarea.value.trim().split('\n').filter(skill => skill.trim() !== '');
        
        if (skills.length === 0) {
            skillsPreview.innerHTML = '<div class="no-skills">No skills added yet</div>';
            return;
        }
        
        skillsPreview.innerHTML = '';
        skills.forEach(skill => {
            if (skill.trim() === '') return;
            
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.textContent = skill.trim();
            skillsPreview.appendChild(skillItem);
        });
    }
    
    // Update items preview as user types
    function updateItemsPreview() {
        if (!itemsTextarea || !itemsPreview) return;
        
        const items = itemsTextarea.value.trim().split('\n').filter(item => item.trim() !== '');
        
        if (items.length === 0) {
            itemsPreview.innerHTML = '<div class="no-items">No items added yet</div>';
            return;
        }
        
        itemsPreview.innerHTML = '';
        items.forEach(item => {
            if (item.trim() === '') return;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'item-element';
            itemElement.textContent = item.trim();
            itemsPreview.appendChild(itemElement);
        });
    }
    
    // Save skills to character
    function saveSkills() {
        const modal = document.getElementById('characterDetailsModal');
        if (!modal) return;
        
        const characterId = modal.getAttribute('data-target-character');
        if (!characterId) return;
        
        const characterEntry = document.querySelector(`.character-entry[data-character-id="${characterId}"]`);
        if (!characterEntry) return;
        
        const skills = skillsTextarea.value.trim().split('\n').filter(skill => skill.trim() !== '');
        
        // Store skills as data attribute
        characterEntry.setAttribute('data-skills', skills.join(','));
        
        // Update UI to show skills are added
        let skillsStatus = characterEntry.querySelector('.skills-status');
        
        if (skills.length > 0) {
            if (!skillsStatus) {
                skillsStatus = document.createElement('div');
                skillsStatus.className = 'skills-status';
                skillsStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${skills.length} skills`;
                
                // Add to buttons container
                const buttonsContainer = characterEntry.querySelector('.character-buttons');
                if (buttonsContainer) {
                    buttonsContainer.appendChild(skillsStatus);
                }
                
                // Add click handler to open skills modal
                skillsStatus.addEventListener('click', function() {
                    openSkillsModal(characterId);
                });
            } else {
                skillsStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${skills.length} skills`;
            }
        } else if (skillsStatus) {
            skillsStatus.remove();
        }
        
        // Close modal
        modal.style.display = 'none';
    }
    
    // Save items to character
    function saveItems() {
        const modal = document.getElementById('characterItemsModal');
        if (!modal) return;
        
        const characterId = modal.getAttribute('data-target-character');
        if (!characterId) return;
        
        const characterEntry = document.querySelector(`.character-entry[data-character-id="${characterId}"]`);
        if (!characterEntry) return;
        
        const items = itemsTextarea.value.trim().split('\n').filter(item => item.trim() !== '');
        
        // Store items as data attribute
        characterEntry.setAttribute('data-items', items.join(','));
        
        // Update UI to show items are added
        let itemsStatus = characterEntry.querySelector('.items-status');
        
        if (items.length > 0) {
            if (!itemsStatus) {
                itemsStatus = document.createElement('div');
                itemsStatus.className = 'items-status';
                itemsStatus.innerHTML = `<i class="fas fa-box-open"></i> ${items.length} items`;
                
                // Add to buttons container
                const buttonsContainer = characterEntry.querySelector('.character-buttons');
                if (buttonsContainer) {
                    buttonsContainer.appendChild(itemsStatus);
                }
                
                // Add click handler to open items modal
                itemsStatus.addEventListener('click', function() {
                    openItemsModal(characterId);
                });
            } else {
                itemsStatus.innerHTML = `<i class="fas fa-box-open"></i> ${items.length} items`;
            }
        } else if (itemsStatus) {
            itemsStatus.remove();
        }
        
        // Close modal
        modal.style.display = 'none';
    }
    
    // Create game function
    function createGame() {
        // Get form data
        const gameNameInput = createGameForm.querySelector('input[name="gameName"]');
        const gameDescInput = createGameForm.querySelector('textarea[name="gameDescription"]');
        const storySelect = document.getElementById('storySelect');
        
        if (!gameNameInput || !storySelect) {
            alert('Missing required form elements');
            return;
        }
        
        const gameName = gameNameInput.value.trim();
        const gameDesc = gameDescInput ? gameDescInput.value.trim() : '';
        const storyId = storySelect.value;
        
        if (!gameName) {
            alert('Please enter a game name');
            return;
        }
        
        if (!storyId) {
            alert('Please select a story');
            return;
        }
        
        // Collect character data
        const characters = [];
        const characterEntries = charactersList.querySelectorAll('.character-entry');
        
        characterEntries.forEach(entry => {
            const nameInput = entry.querySelector('input[name="characterName"]');
            const classSelect = entry.querySelector('select[name="characterClass"]');
            
            if (!nameInput || !classSelect) return;
            
            const name = nameInput.value.trim();
            const characterClass = classSelect.value;
            
            if (!name || !characterClass) return; // Skip incomplete characters
            
            const characterData = {
                name: name,
                class: characterClass
            };
            
            // Add skills if present
            const skillsData = entry.getAttribute('data-skills');
            if (skillsData) {
                characterData.skills = skillsData.split(',');
            }
            
            // Add items if present
            const itemsData = entry.getAttribute('data-items');
            if (itemsData) {
                characterData.items = itemsData.split(',');
            }
            
            characters.push(characterData);
        });
        
        // Create the game object
        const game = {
            name: gameName,
            description: gameDesc,
            story: storyId,
            characters: characters,
            createdAt: new Date().toISOString(),
            lastPlayedAt: new Date().toISOString()
        };
        
        // Save the game
        saveGame(game);
        
        // Get the appropriate map ID for this story
        const mapId = storyToMapMapping[storyId] || 'barovia';
        
        // Close the modal
        createGameModal.style.display = 'none';
        
        // Reset the form
        createGameForm.reset();
        
        // Show success message
        showNotification('Game created successfully!', 'success');
        
        // Navigate to the map page with the selected map
        if (typeof window.showPage === 'function') {
            window.showPage('map', { mapId: mapId });
            
            // Add character tokens to map
            setTimeout(() => {
                addCharactersToMap(characters);
            }, 500);
        }
    }
    
    // Save game to localStorage
    function saveGame(game) {
        // Get existing games
        const savedGamesJSON = localStorage.getItem('savedGames');
        const savedGames = savedGamesJSON ? JSON.parse(savedGamesJSON) : [];
        
        // Add new game
        savedGames.push(game);
        
        // Save back to localStorage
        localStorage.setItem('savedGames', JSON.stringify(savedGames));
        
        console.log('Game saved:', game);
    }
    
    // Function to add characters to map
    function addCharactersToMap(characters) {
        if (!characters || characters.length === 0) return;
        
        // Get active map
        const activeMap = document.querySelector('.game-map.active');
        if (!activeMap) return;
        
        const markersContainer = activeMap.querySelector('.map-markers');
        if (!markersContainer) return;
        
        // Add each character as a marker
        characters.forEach((character, index) => {
            // Create new marker
            const marker = document.createElement('div');
            marker.className = 'character-marker draggable';
            marker.dataset.character = character.class;
            marker.dataset.characterName = character.name;
            marker.dataset.characterClass = character.class;
            
            // Position marker in different places around center (spiral pattern)
            const angle = index * 0.5 * Math.PI;
            const distance = 10 + (index * 5); // Distance from center in percentage
            const x = 50 + distance * Math.cos(angle);
            const y = 50 + distance * Math.sin(angle);
            
            marker.style.left = `${x}%`;
            marker.style.top = `${y}%`;
            
            // Add icon based on class
            let iconClass = 'fa-user-circle'; // Default icon
            
            switch (character.class) {
                case 'warrior':
                    iconClass = 'fa-shield-alt';
                    break;
                case 'mage':
                    iconClass = 'fa-hat-wizard';
                    break;
                case 'rogue':
                    iconClass = 'fa-mask';
                    break;
                case 'cleric':
                    iconClass = 'fa-pray';
                    break;
            }
            
            marker.innerHTML = `<i class="fas ${iconClass}"></i>`;
            
            // Add marker to the map
            markersContainer.appendChild(marker);
        });
        
        // Initialize draggable functionality for new markers
        if (window.makeMarkersDraggable && typeof window.makeMarkersDraggable === 'function') {
            window.makeMarkersDraggable();
        }
        
        showNotification(`Added ${characters.length} characters to the map`, 'success');
    }
    
    // Initialize modal events
    function initModalEvents() {
        // Close modals when clicking on close buttons
        const closeButtons = document.querySelectorAll('.modal .close');
        closeButtons.forEach(button => {
            const modal = button.closest('.modal');
            if (!modal) return;
            
            button.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', event => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        if (window.showNotification && typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`[${type}] ${message}`);
            alert(message);
        }
    }
    
    // Initialize modals
    initModalEvents();
    
    // Setup initial character field
    if (charactersList && charactersList.children.length === 0) {
        addCharacterField();
    }
    
    // Fix for existing character entries
    document.querySelectorAll('.character-entry').forEach(entry => {
        // Get character ID
        let characterId = entry.getAttribute('data-character-id');
        if (!characterId) {
            // Generate ID if missing
            characterId = 'character-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            entry.setAttribute('data-character-id', characterId);
        }
        
        // Add event listeners to skill and item buttons
        const addDetailsBtn = entry.querySelector('.add-details-btn');
        const addItemsBtn = entry.querySelector('.add-items-btn');
        
        if (addDetailsBtn) {
            addDetailsBtn.addEventListener('click', function() {
                openSkillsModal(characterId);
            });
        }
        
        if (addItemsBtn) {
            addItemsBtn.addEventListener('click', function() {
                openItemsModal(characterId);
            });
        }
        
        // Add event listener to delete button
        const deleteBtn = entry.querySelector('.delete-character-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                entry.remove();
            });
        }
        
        // Ensure status elements have click handlers
        const skillsStatus = entry.querySelector('.skills-status');
        if (skillsStatus) {
            skillsStatus.addEventListener('click', function() {
                openSkillsModal(characterId);
            });
        }
        
        const itemsStatus = entry.querySelector('.items-status');
        if (itemsStatus) {
            itemsStatus.addEventListener('click', function() {
                openItemsModal(characterId);
            });
        }
    });
});
