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