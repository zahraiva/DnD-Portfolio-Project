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
  