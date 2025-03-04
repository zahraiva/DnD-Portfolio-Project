document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded');
  
    // Modal functionality
    const createGameBtn = document.getElementById('createGameBtn');
    const myGamesBtn = document.getElementById('myGamesBtn');
    const createGameModal = document.getElementById('createGameModal');
    const myGamesModal = document.getElementById('myGamesModal');
    const characterDetailsModal = document.getElementById('characterDetailsModal');
    const closeButtons = document.querySelectorAll('.close');
    const addCharacterBtn = document.getElementById('addCharacterBtn');
    const charactersList = document.getElementById('charactersList');
    const addItemBtn = document.getElementById('addItemBtn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
  
    console.log('Create Game Button:', createGameBtn);
    console.log('Create Game Modal:', createGameModal);
  
  // Open Create Game modal
  createGameBtn.addEventListener('click', () => {
    createGameModal.style.display = 'block';
  });
  
  // Open My Games modal
  myGamesBtn.addEventListener('click', () => {
    myGamesModal.style.display = 'block';
    displayGames(); // Refresh games list
  });
  
  // Close modals when clicking the X button
  closeButtons.forEach(button => {
    button.onclick = function() {
        createGameModal.style.display = 'none';
        myGamesModal.style.display = 'none';
        characterDetailsModal.style.display = 'none';
    }
  });
  
  // Close modals when clicking outside
  window.onclick = (event) => {
    if (event.target === createGameModal) {
        createGameModal.style.display = 'none';
    }
    if (event.target === myGamesModal) {
        myGamesModal.style.display = 'none';
    }
    if (event.target === characterDetailsModal) {
        characterDetailsModal.style.display = 'none';
    }
  }
  
  // Add new character entry
  addCharacterBtn.onclick = () => {
    const characterEntry = document.createElement('div');
    characterEntry.className = 'character-entry';
    characterEntry.innerHTML = `
        <input type="text" name="characterName" placeholder="Character Name">
        <select name="characterClass" class="character-class">
            <option value="">Select Class</option>
            <option value="warrior">Warrior</option>
            <option value="mage">Mage</option>
            <option value="rogue">Rogue</option>
            <option value="cleric">Cleric</option>
        </select>
        <button type="button" class="add-details-btn">Add Skills & Items</button>
        <button type="button" class="remove-character">×</button>
    `;
    charactersList.appendChild(characterEntry);
  
    // Add event listener to the new "Add Skills & Items" button
    const addDetailsBtn = characterEntry.querySelector('.add-details-btn');
    addDetailsBtn.onclick = () => {
        characterDetailsModal.style.display = 'block';
    }
  
    // Add event listener to remove character button
    const removeBtn = characterEntry.querySelector('.remove-character');
    removeBtn.onclick = () => characterEntry.remove();
  }
  
  // Tab switching in character details modal
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
  
        // Hide all tab contents
        tabContents.forEach(content => content.style.display = 'none');
        // Show selected tab content
        const tabId = button.getAttribute('data-tab') + 'Tab';
        document.getElementById(tabId).style.display = 'block';
    });
  });
  
  // Add new inventory item
  addItemBtn.onclick = () => {
    const inventoryList = document.querySelector('.inventory-list');
    const itemEntry = document.createElement('div');
    itemEntry.className = 'inventory-item';
    itemEntry.innerHTML = `
        <input type="text" placeholder="Item Name">
        <input type="number" placeholder="Quantity" min="1">
        <button type="button" class="remove-item">×</button>
    `;
    inventoryList.appendChild(itemEntry);
  
    // Add event listener to remove item button
    const removeBtn = itemEntry.querySelector('.remove-item');
    removeBtn.onclick = () => itemEntry.remove();
  }
  
  // Store games in localStorage for demo purposes
  let games = JSON.parse(localStorage.getItem('dndGames')) || [];
  
  // Function to save games to localStorage
  const saveGames = () => {
    localStorage.setItem('dndGames', JSON.stringify(games));
  };
  
  // Function to create a game card
  const createGameCard = (game) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <h3>${game.name}</h3>
        <p>${game.description}</p>
        <div class="game-info">
            <div class="game-info-item">
                <i class="fas fa-users"></i>
                <span>${game.characters.length} Characters</span>
            </div>
            <div class="game-info-item">
                <i class="fas fa-map-marked-alt"></i>
                <span>${game.map}</span>
            </div>
            <div class="game-info-item">
                <i class="fas fa-book-open"></i>
                <span>${game.story}</span>
            </div>
            <div class="game-info-item">
                <i class="fas fa-calendar-alt"></i>
                <span>${new Date(game.created).toLocaleDateString()}</span>
            </div>
        </div>
        <div class="game-actions">
            <button class="game-action-btn edit">Edit Game</button>
            <button class="game-action-btn delete">Delete Game</button>
        </div>
    `;
  
    // Add event listeners for edit and delete buttons
    const editBtn = card.querySelector('.edit');
    const deleteBtn = card.querySelector('.delete');
  
    editBtn.onclick = (e) => {
        e.stopPropagation();
        // TODO: Implement edit functionality
        alert('Edit functionality coming soon!');
    };
  
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this game?')) {
            games = games.filter(g => g.id !== game.id);
            saveGames();
            displayGames();
        }
    };
  
    return card;
  };
  
  // Function to display all games
  const displayGames = () => {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';
  
    if (games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-games">
                <i class="fas fa-dice-d20"></i>
                <p>No games created yet. Click the "Create Game" button to start your adventure!</p>
            </div>
        `;
        return;
    }
  
    games.forEach(game => {
        gamesGrid.appendChild(createGameCard(game));
    });
  };
  
  // Form submission
  const createGameForm = document.getElementById('createGameForm');
  if (createGameForm) {
    createGameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
  
    // Collect form data
    const newGame = {
        id: Date.now(),
        name: form.elements['gameName'].value,
        description: form.elements['gameDescription'].value,
        characters: Array.from(document.querySelectorAll('.character-entry')).map(entry => ({
            name: entry.querySelector('input[name="characterName"]').value,
            class: entry.querySelector('select[name="characterClass"]').value
        })),
        story: document.getElementById('storySelect').value,
        map: document.getElementById('mapSelect').value,
        created: new Date().toISOString()
    };
  
    // Add new game to the list
    games.push(newGame);
    saveGames();
  
    // Close modal and refresh display
    createGameModal.style.display = 'none';
    displayGames();
    form.reset();
    });
  }
  
    // Display games when page loads
    displayGames();
  });
  