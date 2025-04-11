document.addEventListener('DOMContentLoaded', function() {
    console.log("Saved games script loaded");
    
    // Reference to the games modal
    const myGamesModal = document.getElementById('myGamesModal');
    const myGamesBtn = document.getElementById('myGamesBtn');
    const gamesGrid = document.getElementById('gamesGrid');
    
    // Open modal when My Games button is clicked
    if (myGamesBtn) {
        myGamesBtn.addEventListener('click', function() {
            loadSavedGames();
            openModal(myGamesModal);
        });
    }
    
    // Close modal when close button is clicked
    if (myGamesModal) {
        const closeBtn = myGamesModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(myGamesModal);
            });
        }
        
        // Close when clicking outside the modal
        window.addEventListener('click', function(event) {
            if (event.target == myGamesModal) {
                closeModal(myGamesModal);
            }
        });
    }
    
    // Load saved games and display them
    function loadSavedGames() {
        if (!gamesGrid) return;
        
        // Clear previous games
        gamesGrid.innerHTML = '';
        
        // Get saved games from local storage
        const savedGames = getSavedGames();
        
        if (savedGames.length === 0) {
            // Show empty state
            gamesGrid.innerHTML = `
                <div class="empty-games">
                    <i class="fas fa-dice-d20"></i>
                    <p>No saved games yet. Create a new adventure to get started!</p>
                    <button id="createFirstGameBtn">Create Game</button>
                </div>
            `;
            
            // Add event listener to create game button
            const createFirstGameBtn = document.getElementById('createFirstGameBtn');
            if (createFirstGameBtn) {
                createFirstGameBtn.addEventListener('click', function() {
                    closeModal(myGamesModal);
                    openModal(document.getElementById('createGameModal'));
                });
            }
            return;
        }
        
        // Display each saved game
        savedGames.forEach(function(game, index) {
            const gameCard = createGameCard(game, index);
            gamesGrid.appendChild(gameCard);
        });
    }
    
    // Create a game card element
    function createGameCard(game, index) {
        const gameEl = document.createElement('div');
        gameEl.className = 'game-item';
        
        // Format date for display
        const createdDate = new Date(game.createdAt);
        const dateFormatted = createdDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Get story icon and name
        let storyIcon = 'fa-book';
        let storyName = 'Custom Adventure';
        
        switch (game.story) {
            case 'curse-strahd':
                storyIcon = 'fa-skull';
                storyName = 'Curse of Strahd';
                break;
            case 'lost-mines':
                storyIcon = 'fa-gem';
                storyName = 'Lost Mine of Phandelver';
                break;
            case 'witchlight':
                storyIcon = 'fa-hat-wizard';
                storyName = 'The Wild Beyond the Witchlight';
                break;
        }
        
        // Map story to map ID
        let mapId = 'barovia'; // Default map
        switch (game.story) {
            case 'curse-strahd':
                mapId = 'barovia';
                break;
            case 'lost-mines':
                mapId = 'phandelver';
                break;
            case 'witchlight':
                mapId = 'witchlight';
                break;
        }
        
        // Count characters
        const characterCount = game.characters ? game.characters.length : 0;
        
        // Create game card HTML
        gameEl.innerHTML = `
            <button class="delete-game-btn" data-index="${index}"><i class="fas fa-times"></i></button>
            <h3>${game.name}</h3>
            <p><i class="fas ${storyIcon}"></i> ${storyName}</p>
            <p><i class="fas fa-calendar-alt"></i> Created: ${dateFormatted}</p>
            <p><i class="fas fa-users"></i> Characters: ${characterCount}</p>
            <button class="continue-btn" data-index="${index}" data-map="${mapId}">Continue Adventure</button>
        `;
        
        // Add event listener to delete button
        const deleteBtn = gameEl.querySelector('.delete-game-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const gameIndex = this.getAttribute('data-index');
                deleteGame(gameIndex);
            });
        }
        
        // Add event listener to continue button
        const continueBtn = gameEl.querySelector('.continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const gameIndex = this.getAttribute('data-index');
                const mapId = this.getAttribute('data-map');
                loadGame(gameIndex, mapId);
            });
        }
        
        return gameEl;
    }
    
    // Load a game
    function loadGame(index, mapId) {
        const games = getSavedGames();
        const game = games[index];
        
        if (!game) {
            showNotification('Error loading game', 'error');
            return;
        }
        
        // Close the modal
        closeModal(myGamesModal);
        
        // Navigate to map page with the specific map
        if (window.showPage && mapId) {
            console.log(`Loading game with map: ${mapId}`);
            window.showPage('map', { mapId: mapId });
            
            // Show notification
            showNotification(`Loaded game: ${game.name}`);
            
            // Load characters onto map if available
            if (game.characters && game.characters.length > 0) {
                setTimeout(() => {
                    loadCharactersOnMap(game.characters);
                }, 500); // Give the map time to load
            }
        } else {
            // Fallback if showPage function is not available
            console.error('showPage function not found');
            showNotification('Error loading game map', 'error');
        }
    }
    
    // Load characters onto the map
    function loadCharactersOnMap(characters) {
        // Get active map
        const activeMap = document.querySelector('.game-map.active');
        if (!activeMap) {
            console.error('No active map found');
            return;
        }
        
        // Get map markers container
        const markersContainer = activeMap.querySelector('.map-markers');
        if (!markersContainer) {
            console.error('Map markers container not found');
            return;
        }
        
        // Clear existing custom markers (keep player1 marker)
        const existingMarkers = markersContainer.querySelectorAll('.character-marker:not([data-character="player1"])');
        existingMarkers.forEach(marker => marker.remove());
        
        // Add each character as a marker
        characters.forEach(character => {
            if (!character.name) return; // Skip characters without names
            
            // Create new marker
            const marker = document.createElement('div');
            marker.className = 'character-marker draggable';
            marker.dataset.character = character.class || 'custom';
            marker.dataset.characterName = character.name;
            marker.dataset.characterClass = character.class || 'Unknown Class';
            
            // Set initial position
            marker.style.left = '50%';
            marker.style.top = '50%';
            
            // Add appropriate icon based on class
            let iconClass = 'fa-user-circle'; // Default icon
            
            switch (character.class) {
                case 'warrior':
                case 'fighter':
                case 'barbarian':
                case 'monk':
                    iconClass = 'fa-shield-alt';
                    break;
                case 'wizard':
                case 'mage':
                case 'sorcerer':
                case 'warlock':
                case 'druid':
                    iconClass = 'fa-hat-wizard';
                    break;
                case 'rogue':
                case 'ranger':
                case 'bard':
                    iconClass = 'fa-mask';
                    break;
                case 'cleric':
                case 'paladin':
                case 'healer':
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
        } else {
            console.warn('makeMarkersDraggable function not found');
        }
        
        showNotification(`Loaded ${characters.length} characters onto the map`, 'success');
    }
    
    // Delete a game
    function deleteGame(index) {
        if (!confirm('Are you sure you want to delete this game?')) return;
        
        const games = getSavedGames();
        const gameName = games[index] ? games[index].name : 'Game';
        
        // Remove the game from the array
        games.splice(index, 1);
        
        // Save the updated games array
        localStorage.setItem('savedGames', JSON.stringify(games));
        
        // Reload the games
        loadSavedGames();
        
        // Show notification
        showNotification(`Deleted game: ${gameName}`);
    }
    
    // Helper function to get saved games
    function getSavedGames() {
        const savedGamesJSON = localStorage.getItem('savedGames');
        return savedGamesJSON ? JSON.parse(savedGamesJSON) : [];
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
    
    // Helper function to open modal
    function openModal(modal) {
        if (!modal) return;
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    // Helper function to close modal
    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});
