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
