document.addEventListener('DOMContentLoaded', function() {
    console.log('Saved games script loaded');
    
    // Get elements
    const gamesGrid = document.getElementById('gamesGrid');
    const myGamesBtn = document.getElementById('myGamesBtn');
    const myGamesModal = document.getElementById('myGamesModal');
    const closeBtn = myGamesModal?.querySelector('.close');
    
    // Show notification if available from other scripts
    function notify(message) {
        if (window.showNotification) {
            window.showNotification(message);
        } else {
            console.log('Notification:', message);
        }
    }
    
    // Load saved games from localStorage
    function getSavedGames() {
        try {
            const games = JSON.parse(localStorage.getItem('dndGames')) || [];
            return games;
        } catch (error) {
            console.error('Error loading saved games:', error);
            return [];
        }
    }
    
    // Save games to localStorage
    function saveGames(games) {
        localStorage.setItem('dndGames', JSON.stringify(games));
    }
    
    // Display all saved games in the games grid
    function displaySavedGames() {
        if (!gamesGrid) return;
        
        // Clear existing content
        gamesGrid.innerHTML = '';
        
        // Get saved games
        const games = getSavedGames();
        
        // If no games, show empty state
        if (games.length === 0) {
            gamesGrid.innerHTML = `
                <div class="no-games">
                    <i class="fas fa-dice-d20"></i>
                    <p>No games created yet. Click the "Create Game" button to start your adventure!</p>
                </div>
            `;
            return;
        }
        
        // Create game cards for each saved game
        games.forEach(game => {
            const gameCard = createGameCard(game);
            gamesGrid.appendChild(gameCard);
        });
    }
    
    // Create a game card element for a game
    function createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        // Format date nicely
        const createdDate = new Date(game.created);
        const dateOptions = { year: 'numeric', month: 'short', 'day': 'numeric' };
        const formattedDate = createdDate.toLocaleDateString(undefined, dateOptions);
        
        // Get proper story name
        let storyName = 'Custom Adventure';
        if (game.story === 'lost-mines') storyName = 'Lost Mine of Phandelver';
        if (game.story === 'curse-strahd') storyName = 'Curse of Strahd';
        
        // Get proper map name
        let mapName = 'Custom Map';
        if (game.map === 'barovia') mapName = 'Barovia';
        if (game.map === 'phandelver') mapName = 'Phandelver';
        
        card.innerHTML = `
            <h3>${game.name || 'Untitled Adventure'}</h3>
            <p class="game-description">${game.description || 'No description available.'}</p>
            <div class="game-info">
                <div class="game-info-item">
                    <i class="fas fa-users"></i>
                    <span>${game.characters.length} Character${game.characters.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="game-info-item">
                    <i class="fas fa-map-marked-alt"></i>
                    <span>${mapName}</span>
                </div>
                <div class="game-info-item">
                    <i class="fas fa-book-open"></i>
                    <span>${storyName}</span>
                </div>
                <div class="game-info-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formattedDate}</span>
                </div>
            </div>
            <div class="game-actions">
                <button class="game-action-btn edit"><i class="fas fa-edit"></i> Edit Game</button>
                <button class="game-action-btn delete"><i class="fas fa-trash"></i> Delete Game</button>
            </div>
            <button class="continue-btn"><i class="fas fa-play-circle"></i> Continue Adventure</button>
            
            <div class="delete-confirm">
                <p>Are you sure you want to delete this game?</p>
                <div class="delete-confirm-btns">
                    <button class="delete-confirm-btn confirm-no">Cancel</button>
                    <button class="delete-confirm-btn confirm-yes">Delete</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const continueBtn = card.querySelector('.continue-btn');
        continueBtn.addEventListener('click', () => {
            continueGame(game);
        });
        
        const editBtn = card.querySelector('.game-action-btn.edit');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editGame(game, card);
        });
        
        const deleteBtn = card.querySelector('.game-action-btn.delete');
        const deleteConfirm = card.querySelector('.delete-confirm');
        const confirmYes = card.querySelector('.confirm-yes');
        const confirmNo = card.querySelector('.confirm-no');
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteConfirm.classList.add('show');
        });
        
        confirmNo.addEventListener('click', () => {
            deleteConfirm.classList.remove('show');
        });
        
        confirmYes.addEventListener('click', () => {
            deleteGame(game.id);
        });
        
        return card;
    }
    
    // Continue a saved game
    function continueGame(game) {
        try {
            console.log('BASIC MAP NAVIGATION - continuing game:', game);
            
            // 1. Save the game data first
            sessionStorage.setItem('activeGame', JSON.stringify(game));
            
            // 2. Close the modal
            if (myGamesModal) {
                myGamesModal.style.display = 'none';
            }
            
            // 3. DIRECT APPROACH: locate and manually show the map page
            const mapPage = document.getElementById('map');
            if (!mapPage) {
                console.error('MAP PAGE NOT FOUND');
                return;
            }
            
            // 4. Hide all pages using manual DOM manipulation
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
                page.style.display = 'none';
            });
            
            // 5. Show map page
            mapPage.classList.add('active');
            mapPage.style.display = 'block';
            
            // 6. Update the navigation bar
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === 'map') {
                    link.classList.add('active');
                }
            });
            
            // 7. Show notification
            notify(`Continuing "${game.name || 'Untitled Adventure'}"...`);
            
            // 8. Select the correct map tab after a little delay
            setTimeout(() => {
                const mapId = game.map || 'barovia';
                const mapTab = document.querySelector(`.map-tab[data-map="${mapId}"]`);
                
                if (mapTab) {
                    // Manually trigger map tab behavior
                    document.querySelectorAll('.map-tab').forEach(tab => tab.classList.remove('active'));
                    mapTab.classList.add('active');
                    
                    document.querySelectorAll('.game-map').forEach(map => {
                        map.classList.remove('active');
                        map.style.display = 'none';
                    });
                    
                    const targetMap = document.getElementById(`${mapId}-map`);
                    if (targetMap) {
                        targetMap.classList.add('active');
                        targetMap.style.display = 'block';
                    }
                    
                    // Load characters after a delay to ensure map is ready
                    setTimeout(() => {
                        if (typeof loadCharactersOntoMap === 'function') {
                            loadCharactersOntoMap(game);
                        }
                    }, 100);
                }
            }, 100);
        } catch (error) {
            console.error('ERROR IN CONTINUE GAME:', error);
            alert('Error continuing game: ' + error.message);
        }
    }
    
    // Delete a game
    function deleteGame(gameId) {
        if (!confirm('Are you sure you want to delete this game?')) return;
        
        // Get current games
        const games = getSavedGames();
        
        // Filter out the deleted game
        const updatedGames = games.filter(g => g.id !== gameId);
        
        // Save the updated games list
        saveGames(updatedGames);
        
        // Refresh the display
        displaySavedGames();
        
        // Show notification
        notify('Game deleted successfully');
    }
    
    // Update the session panel with game information
    /*
    function updateSessionPanel(game) {
        const sessionName = document.getElementById('session-name');
        const sessionDescription = document.getElementById('session-description');
        const sessionCharacters = document.getElementById('session-characters');
        
        if (sessionName) sessionName.textContent = game.name || 'Untitled Adventure';
        if (sessionDescription) sessionDescription.textContent = game.description || 'Your adventure awaits...';
        
        // Clear existing characters
        if (sessionCharacters) {
            sessionCharacters.innerHTML = '';
            
            // Add all characters from the game
            game.characters.forEach(char => {
                // Skip characters without name or class
                if (!char.name && !char.class) return;
                
                const charElement = document.createElement('div');
                charElement.className = 'session-character';
                
                // Get avatar class name based on character class
                const avatarClass = char.class || 'unknown';
                
                charElement.innerHTML = `
                    <div class="character-avatar ${avatarClass}">
                        <i class="fas ${getClassIcon(char.class)}"></i>
                    </div>
                    <div class="character-info">
                        <h4 class="character-name">${char.name || 'Unnamed Character'}</h4>
                        <p class="character-class">${formatClassName(char.class)}</p>
                    </div>
                    <div class="character-actions">
                        <button title="Locate on map"><i class="fas fa-map-marker"></i></button>
                        <button title="View details"><i class="fas fa-user"></i></button>
                    </div>
                `;
                
                sessionCharacters.appendChild(charElement);
            });
        }
        
        // Show the session panel if it's hidden
        const sessionPanel = document.getElementById('session-panel');
        if (sessionPanel && sessionPanel.classList.contains('collapsed')) {
            sessionPanel.classList.remove('collapsed');
        }
    }
    */
    
    // Helper function to get icon for character class
    function getClassIcon(className) {
        switch (className) {
            case 'warrior': return 'fa-shield-alt';
            case 'mage': return 'fa-hat-wizard';
            case 'rogue': return 'fa-mask';
            case 'cleric': return 'fa-pray';
            default: return 'fa-user';
        }
    }
    
    // Helper function to format class name
    function formatClassName(className) {
        if (!className) return 'Unknown Class';
        return className.charAt(0).toUpperCase() + className.slice(1);
    }
    
    // Function to handle editing a game
    function editGame(game, cardElement) {
        // Add edit-mode class to card
        cardElement.classList.add('edit-mode');
        
        // Save original content to restore if canceled
        const originalContent = cardElement.innerHTML;
        
        // Get the map and story options
        const mapOptions = [
            { value: 'barovia', text: 'Barovia' },
            { value: 'phandelver', text: 'Phandelver' }
        ];
        
        const storyOptions = [
            { value: 'curse-strahd', text: 'Curse of Strahd' },
            { value: 'lost-mines', text: 'Lost Mine of Phandelver' }
        ];
        
        // Create map options HTML
        let mapOptionsHTML = '';
        mapOptions.forEach(option => {
            const selected = game.map === option.value ? 'selected' : '';
            mapOptionsHTML += `<option value="${option.value}" ${selected}>${option.text}</option>`;
        });
        
        // Create story options HTML
        let storyOptionsHTML = '';
        storyOptions.forEach(option => {
            const selected = game.story === option.value ? 'selected' : '';
            storyOptionsHTML += `<option value="${option.value}" ${selected}>${option.text}</option>`;
        });
        
        // Create edit form
        const editForm = document.createElement('div');
        editForm.className = 'game-edit-form';
        editForm.innerHTML = `
            <input type="text" name="gameName" value="${game.name || ''}" placeholder="Game Name" required>
            <textarea name="gameDescription" placeholder="Game Description" rows="3">${game.description || ''}</textarea>
            
            <div class="form-group">
                <label>Story</label>
                <select name="gameStory">
                    <option value="">Select Story</option>
                    ${storyOptionsHTML}
                </select>
            </div>
            
            <div class="form-group">
                <label>Map</label>
                <select name="gameMap">
                    <option value="">Select Map</option>
                    ${mapOptionsHTML}
                </select>
            </div>
            
            <div class="game-edit-actions">
                <button type="button" class="save-edit-btn"><i class="fas fa-save"></i> Save Changes</button>
                <button type="button" class="cancel-edit-btn"><i class="fas fa-times"></i> Cancel</button>
            </div>
        `;
        
        // Replace card content with edit form
        const elementsToHide = cardElement.querySelectorAll('h3, .game-description, .game-info, .game-actions, .continue-btn, .delete-confirm');
        
        // Hide these elements
        elementsToHide.forEach(el => {
            if (el) el.style.display = 'none';
        });
        
        // Insert the edit form at the beginning of the card
        cardElement.prepend(editForm);
        
        // Add event listeners to edit form buttons
        const saveBtn = editForm.querySelector('.save-edit-btn');
        const cancelBtn = editForm.querySelector('.cancel-edit-btn');
        
        saveBtn.addEventListener('click', () => {
            // Get updated values
            const updatedName = editForm.querySelector('[name="gameName"]').value.trim();
            const updatedDescription = editForm.querySelector('[name="gameDescription"]').value.trim();
            const updatedStory = editForm.querySelector('[name="gameStory"]').value;
            const updatedMap = editForm.querySelector('[name="gameMap"]').value;
            
            // Validate inputs
            if (!updatedName) {
                showNotification('Game name is required', 'error');
                return;
            }
            
            // Update game object with new values
            game.name = updatedName;
            game.description = updatedDescription;
            
            // Only update story and map if they were selected
            if (updatedStory) game.story = updatedStory;
            if (updatedMap) game.map = updatedMap;
            
            // Save games to localStorage
            updateGameInStorage(game);
            
            // Remove edit form and restore original layout with new data
            editForm.remove();
            cardElement.classList.remove('edit-mode');
            
            // Update the display
            displaySavedGames();
            
            // Show notification
            notify('Game updated successfully');
        });
        
        cancelBtn.addEventListener('click', () => {
            // Restore original content
            cardElement.innerHTML = originalContent;
            
            // Re-attach event listeners
            attachCardEventListeners(cardElement, game);
            
            cardElement.classList.remove('edit-mode');
        });
    }
    
    // Function to update a game in localStorage
    function updateGameInStorage(updatedGame) {
        // Get all games
        const games = getSavedGames();
        
        // Find and update the game
        const gameIndex = games.findIndex(g => g.id === updatedGame.id);
        
        if (gameIndex !== -1) {
            games[gameIndex] = updatedGame;
            saveGames(games);
            return true;
        }
        
        return false;
    }
    
    // Helper function to re-attach event listeners after canceling edit
    function attachCardEventListeners(cardElement, game) {
        // Continue button
        const continueBtn = cardElement.querySelector('.continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                continueGame(game);
            });
        }
        
        // Edit button
        const editBtn = cardElement.querySelector('.game-action-btn.edit');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editGame(game, cardElement);
            });
        }
        
        // Delete button
        const deleteBtn = cardElement.querySelector('.game-action-btn.delete');
        const deleteConfirm = cardElement.querySelector('.delete-confirm');
        const confirmYes = cardElement.querySelector('.confirm-yes');
        const confirmNo = cardElement.querySelector('.confirm-no');
        
        if (deleteBtn && deleteConfirm && confirmYes && confirmNo) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteConfirm.classList.add('show');
            });
            
            confirmNo.addEventListener('click', () => {
                deleteConfirm.classList.remove('show');
            });
            
            confirmYes.addEventListener('click', () => {
                deleteGame(game.id);
            });
        }
    }
    
    // If the showNotification function doesn't exist, provide a fallback
    function showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message);
        } else {
            // Simple notification fallback
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }
    
    // Function to load character markers onto the map
    function loadCharactersOntoMap(game) {
        // Find the active map
        const activeMap = document.querySelector('.game-map.active');
        if (!activeMap) return;
        
        // Get markers container
        const markersContainer = activeMap.querySelector('.map-markers');
        if (!markersContainer) return;
        
        // Clear existing markers
        markersContainer.innerHTML = '';
        
        // Create the characters container
        const charactersContainer = document.createElement('div');
        charactersContainer.className = 'map-characters-container';
        charactersContainer.innerHTML = `
            <h3>Characters</h3>
            <div class="map-characters-list"></div>
        `;
        
        // Add character markers to the map and to the characters list
        const charactersList = charactersContainer.querySelector('.map-characters-list');
        
        // Add each character
        game.characters.forEach((character, index) => {
            if (!character.name && !character.class) return; // Skip empty characters
            
            // Create random position on the map
            const left = 10 + Math.random() * 80; // 10% to 90% of width
            const top = 10 + Math.random() * 80; // 10% to 90% of height
            
            // Create marker icon based on character class
            let markerIcon = 'fa-user-circle';
            let markerColor = '#7ac67d';
            
            switch(character.class) {
                case 'warrior':
                    markerIcon = 'fa-shield-alt';
                    markerColor = '#e53935';
                    break;
                case 'mage':
                    markerIcon = 'fa-hat-wizard';
                    markerColor = '#2196f3';
                    break;
                case 'rogue':
                    markerIcon = 'fa-mask';
                    markerColor = '#546e7a';
                    break;
                case 'cleric':
                    markerIcon = 'fa-pray';
                    markerColor = '#ffc107';
                    break;
            }
            
            // Create marker DOM element
            const marker = document.createElement('div');
            marker.className = 'character-marker draggable';
            marker.setAttribute('data-character-id', index);
            marker.setAttribute('data-character-name', character.name || 'Unnamed');
            marker.setAttribute('data-character-class', character.class || 'unknown');
            marker.style.left = `${left}%`;
            marker.style.top = `${top}%`;
            marker.style.backgroundColor = markerColor;
            marker.innerHTML = `<i class="fas ${markerIcon}"></i>`;
            
            // Add marker to map
            markersContainer.appendChild(marker);
            
            // Create entry in characters list
            const charListEntry = document.createElement('div');
            charListEntry.className = 'map-character-item';
            charListEntry.setAttribute('data-character-id', index);
            
            charListEntry.innerHTML = `
                <div class="character-avatar ${character.class || 'unknown'}">
                    <i class="fas ${markerIcon}"></i>
                </div>
                <div class="character-info">
                    <h4 class="character-name">${character.name || 'Unnamed Character'}</h4>
                    <p class="character-class">${formatClassName(character.class)}</p>
                </div>
                <div class="character-actions">
                    <button title="Locate on map" class="locate-character-btn"><i class="fas fa-map-marker-alt"></i></button>
                    <button title="View details" class="view-character-btn"><i class="fas fa-info-circle"></i></button>
                </div>
            `;
            
            // Add to characters list
            charactersList.appendChild(charListEntry);
            
            // Add event listener to locate button
            const locateBtn = charListEntry.querySelector('.locate-character-btn');
            locateBtn.addEventListener('click', () => {
                // Remove highlight from all markers
                document.querySelectorAll('.character-marker').forEach(m => {
                    m.classList.remove('highlight');
                });
                
                // Add highlight class to the marker
                marker.classList.add('highlight');
                
                // Scroll map to show marker (if needed)
                marker.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
            });
            
            // Add event listener to view details button
            const viewBtn = charListEntry.querySelector('.view-character-btn');
            viewBtn.addEventListener('click', () => {
                showCharacterDetails(character);
            });
        });
        
        // Add characters container to map
        document.querySelector('.map-container').appendChild(charactersContainer);
        
        // Make markers draggable
        makeMarkersMovable();
    }
    
    // Function to show character details
    function showCharacterDetails(character) {
        // Create a modal to show character details
        const detailsModal = document.createElement('div');
        detailsModal.className = 'character-details-modal';
        
        // Format skills and items for display
        const skills = character.skills ? character.skills.split('\n').filter(s => s.trim()) : [];
        const items = character.items ? character.items.split('\n').filter(i => i.trim()) : [];
        
        // Create skills HTML
        let skillsHtml = '';
        if (skills.length > 0) {
            skillsHtml = `
                <div class="character-skills">
                    <h4>Skills</h4>
                    <ul>${skills.map(skill => `<li><i class="fas fa-check-circle"></i> ${skill}</li>`).join('')}</ul>
                </div>
            `;
        } else {
            skillsHtml = '<p class="no-data">No skills added</p>';
        }
        
        // Create items HTML
        let itemsHtml = '';
        if (items.length > 0) {
            itemsHtml = `
                <div class="character-items">
                    <h4>Items</h4>
                    <ul>${items.map(item => `<li><i class="fas fa-box"></i> ${item}</li>`).join('')}</ul>
                </div>
            `;
        } else {
            itemsHtml = '<p class="no-data">No items added</p>';
        }
        
        // Set modal content
        detailsModal.innerHTML = `
            <div class="character-details-content">
                <div class="character-details-header">
                    <div class="character-avatar large ${character.class || 'unknown'}">
                        <i class="fas ${getClassIcon(character.class)}"></i>
                    </div>
                    <div class="character-header-info">
                        <h3>${character.name || 'Unnamed Character'}</h3>
                        <p class="character-class">${formatClassName(character.class)}</p>
                    </div>
                    <button class="close-details-modal">&times;</button>
                </div>
                <div class="character-details-body">
                    ${skillsHtml}
                    ${itemsHtml}
                </div>
            </div>
        `;
        
        // Add modal to the document
        document.body.appendChild(detailsModal);
        
        // Add close button event listener
        const closeBtn = detailsModal.querySelector('.close-details-modal');
        closeBtn.addEventListener('click', () => {
            detailsModal.remove();
        });
        
        // Add click outside to close
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                detailsModal.remove();
            }
        });
        
        // Add escape key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                detailsModal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        // Animation to appear
        setTimeout(() => {
            detailsModal.classList.add('show');
        }, 10);
    }
    
    // Function to make character markers draggable
    function makeMarkersMovable() {
        const markers = document.querySelectorAll('.character-marker');
        
        markers.forEach(marker => {
            marker.addEventListener('mousedown', dragStart);
            marker.addEventListener('touchstart', dragStart);
        });
        
        // Drag start handler
        function dragStart(e) {
            e.preventDefault();
            const marker = this;
            
            // Add dragging class
            marker.classList.add('dragging');
            
            // Store initial position
            const mapContainer = marker.closest('.game-map');
            const rect = mapContainer.getBoundingClientRect();
            
            // Mouse or touch position
            let startX, startY;
            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            } else {
                startX = e.clientX;
                startY = e.clientY;
            }
            
            // Initial marker position (percentage)
            const startLeft = parseFloat(marker.style.left);
            const startTop = parseFloat(marker.style.top);
            
            // Move function
            function dragMove(e) {
                let currentX, currentY;
                if (e.type === 'touchmove') {
                    currentX = e.touches[0].clientX;
                    currentY = e.touches[0].clientY;
                } else {
                    currentX = e.clientX;
                    currentY = e.clientY;
                }
                
                // Calculate delta
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;
                
                // Calculate new position in percentage
                let newLeft = startLeft + (deltaX / rect.width) * 100;
                let newTop = startTop + (deltaY / rect.height) * 100;
                
                // Restrict to bounds
                newLeft = Math.max(0, Math.min(100, newLeft));
                newTop = Math.max(0, Math.min(100, newTop));
                
                // Update marker position
                marker.style.left = `${newLeft}%`;
                marker.style.top = `${newTop}%`;
            }
            
            // End drag function
            function dragEnd() {
                // Remove dragging class
                marker.classList.remove('dragging');
                
                // Remove event listeners
                document.removeEventListener('mousemove', dragMove);
                document.removeEventListener('touchmove', dragMove);
                document.removeEventListener('mouseup', dragEnd);
                document.removeEventListener('touchend', dragEnd);
            }
            
            // Add document event listeners
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('touchmove', dragMove);
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchend', dragEnd);
        }
    }
    
    // Event listeners
    if (myGamesBtn) {
        myGamesBtn.addEventListener('click', () => {
            if (myGamesModal) {
                myGamesModal.style.display = 'block';
                displaySavedGames();
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            myGamesModal.style.display = 'none';
        });
    }
    
    // Display games on load
    displaySavedGames();
    
    // Load active game if it exists in session storage
    const activeGameData = sessionStorage.getItem('activeGame');
    if (activeGameData) {
        try {
            const game = JSON.parse(activeGameData);
            
            // If we're on the map page, load the characters
            const mapPage = document.getElementById('map');
            if (mapPage && mapPage.classList.contains('active')) {
                // Select the correct map tab
                const mapTab = document.querySelector(`.map-tab[data-map="${game.map || 'barovia'}"]`);
                if (mapTab) mapTab.click();
                
                // Load characters onto the map
                setTimeout(() => {
                    loadCharactersOntoMap(game);
                }, 200);
            }
        } catch (e) {
            console.error('Error loading active game:', e);
        }
    }
});
