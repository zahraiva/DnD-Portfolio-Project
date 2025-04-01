document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Ensure navigation between pages works correctly
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            if (window.showPage) {
                window.showPage(pageId);
            } else {
                // Fallback if the global function isn't available
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Hide all pages
                const pages = document.querySelectorAll('.page');
                pages.forEach(page => page.classList.remove('active'));
                
                // Show the selected page
                const activePage = document.getElementById(pageId);
                if (activePage) {
                    activePage.classList.add('active');
                }
            }
        });
    });

    // Add event listeners for map tabs to ensure they work properly
    const mapTabs = document.querySelectorAll('.map-tab');
    mapTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get the map ID from the tab
            const mapId = this.getAttribute('data-map');
            console.log(`Map tab clicked: ${mapId}`);
            
            // Remove active class from all tabs
            mapTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all maps
            const maps = document.querySelectorAll('.game-map');
            maps.forEach(map => map.classList.remove('active'));
            
            // Show the selected map
            const activeMap = document.getElementById(`${mapId}-map`);
            if (activeMap) {
                activeMap.classList.add('active');
            }
            
            // If there's an active game in session storage, load its characters
            const activeGameData = sessionStorage.getItem('activeGame');
            if (activeGameData && window.loadCharactersOntoMap) {
                try {
                    const game = JSON.parse(activeGameData);
                    if (game.map === mapId) {
                        setTimeout(() => {
                            window.loadCharactersOntoMap(game);
                        }, 200);
                    }
                } catch (e) {
                    console.error('Error loading active game:', e);
                }
            }
        });
    });

    // Reinstate the game buttons functionality
    const createGameBtn = document.getElementById('createGameBtn');
    const myGamesBtn = document.getElementById('myGamesBtn');
    const createGameModal = document.getElementById('createGameModal');
    const myGamesModal = document.getElementById('myGamesModal');
    const closeBtns = document.querySelectorAll('.modal .close');

    // Event listeners for game buttons
    if (createGameBtn) {
        createGameBtn.addEventListener('click', function() {
            if (createGameModal) {
                createGameModal.style.display = 'block';
            }
        });
    }

    if (myGamesBtn) {
        myGamesBtn.addEventListener('click', function() {
            if (myGamesModal) {
                myGamesModal.style.display = 'block';
                // If saved-games.js is loaded, it will handle populating the games grid
            }
        });
    }

    // Close modal functionality
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // ... existing code ...
});
