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
        // Close the modal
        if (myGamesModal) myGamesModal.style.display = 'none';
        
        // Show notification
        notify(`Continuing "${game.name || 'Untitled Adventure'}"...`);
        
        // Switch to map page
        if (window.showPage) {
            window.showPage('map');
        }
        
        // Select the correct map tab
        setTimeout(() => {
            const mapTab = document.querySelector(`.map-tab[data-map="${game.map || 'barovia'}"]`);
            if (mapTab) mapTab.click();
            
            // Update session panel with game info
            updateSessionPanel(game);
        }, 200);
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
});
