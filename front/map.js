document.addEventListener('DOMContentLoaded', () => {
    console.log('Map script loaded');
    
    // Reference elements
    const mapTabs = document.querySelectorAll('.map-tab');
    const gameMaps = document.querySelectorAll('.game-map');
    const addCharacterBtn = document.querySelector('.add-character-btn');
    const resetMapBtn = document.querySelector('.reset-map-btn');
    
    // Make the map tabs work
    mapTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            console.log(`Switching to map: ${tab.getAttribute('data-map')}`);
            
            // Update active tab
            mapTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active map
            const mapId = tab.getAttribute('data-map');
            gameMaps.forEach(map => {
                map.classList.remove('active');
                if (map.id === `${mapId}-map`) {
                    map.classList.add('active');
                }
            });
        });
    });
    
    // Add character functionality
    if (addCharacterBtn) {
        addCharacterBtn.addEventListener('click', () => {
            console.log('Add character clicked');
            createCharacterSelectionModal();
        });
    }
    
    // Reset map functionality
    if (resetMapBtn) {
        resetMapBtn.addEventListener('click', () => {
            console.log('Reset map clicked');
            resetActiveMap();
        });
    }
    
    function createCharacterSelectionModal() {
        // Remove existing modal if present
        const existingModal = document.querySelector('.character-selection-modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        // Create a new modal for character selection
        const modal = document.createElement('div');
        modal.className = 'character-selection-modal';
        modal.innerHTML = `
            <div class="character-selection-content">
                <h3>Select Character Type</h3>
                <div class="character-type-buttons">
                    <button data-type="wizard"><i class="fas fa-hat-wizard"></i> Wizard</button>
                    <button data-type="warrior"><i class="fas fa-shield-alt"></i> Warrior</button>
                    <button data-type="ranger"><i class="fas fa-skull"></i> Ranger</button>
                    <button data-type="rogue"><i class="fas fa-mask"></i> Rogue</button>
                </div>
                <button class="close-selection">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners to the buttons
        const typeButtons = modal.querySelectorAll('button[data-type]');
        typeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const characterType = button.getAttribute('data-type');
                addCharacterToMap(characterType);
                document.body.removeChild(modal);
            });
        });
        
        // Add event listener to the close button
        const closeButton = modal.querySelector('.close-selection');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    function addCharacterToMap(characterType) {
        // Find the active map
        const activeMap = document.querySelector('.game-map.active');
        if (!activeMap) return;
        
        // Find markers container
        const markersContainer = activeMap.querySelector('.map-markers');
        if (!markersContainer) return;
        
        // Create a new marker
        const marker = document.createElement('div');
        marker.className = 'character-marker draggable';
        marker.setAttribute('data-character', characterType);
        
        // Set an icon based on character type
        let iconClass;
        switch(characterType) {
            case 'wizard': iconClass = 'fa-hat-wizard'; break;
            case 'warrior': iconClass = 'fa-shield-alt'; break;
            case 'ranger': iconClass = 'fa-skull'; break;
            case 'rogue': iconClass = 'fa-mask'; break;
            default: iconClass = 'fa-user-circle';
        }
        
        marker.innerHTML = `<i class="fas ${iconClass}"></i>`;
        
        // Position in the center of the map
        marker.style.left = '50%';
        marker.style.top = '50%';
        
        // Add to the map
        markersContainer.appendChild(marker);
        
        // Make it draggable
        makeMarkerDraggable(marker);
    }
    
    // Make addCharacterToMap function globally accessible
    window.addCharacterToMap = addCharacterToMap;
    
    function resetActiveMap() {
        // Find the active map
        const activeMap = document.querySelector('.game-map.active');
        if (!activeMap) return;
        
        // Get all markers except the default player marker
        const customMarkers = activeMap.querySelectorAll('.character-marker:not([data-character="player1"])');
        
        // Remove them
        customMarkers.forEach(marker => marker.remove());
        
        // Reset the default player marker to center
        const defaultMarker = activeMap.querySelector('.character-marker[data-character="player1"]');
        if (defaultMarker) {
            defaultMarker.style.left = '50%';
            defaultMarker.style.top = '50%';
        }
    }
    
    // Make existing markers draggable
    function initializeMarkers() {
        const markers = document.querySelectorAll('.character-marker.draggable');
        markers.forEach(marker => {
            makeMarkerDraggable(marker);
        });
    }
    
    // Make a marker draggable
    function makeMarkerDraggable(marker) {
        let isDragging = false;
        let offsetX, offsetY;
        
        marker.addEventListener('mousedown', startDrag);
        marker.addEventListener('touchstart', startDrag, { passive: false });
        
        function startDrag(e) {
            e.preventDefault();
            
            isDragging = true;
            marker.classList.add('dragging');
            
            // Get mouse/touch position
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            
            // Calculate offset from marker center
            const rect = marker.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;
            
            // Add document-level event listeners
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            // Get new position
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            
            // Get map boundaries
            const map = marker.closest('.game-map');
            const mapRect = map.getBoundingClientRect();
            
            // Calculate position as percentage
            const posX = (clientX - offsetX - mapRect.left + marker.offsetWidth / 2) / mapRect.width * 100;
            const posY = (clientY - offsetY - mapRect.top + marker.offsetHeight / 2) / mapRect.height * 100;
            
            // Constrain to map boundaries
            const boundedX = Math.min(Math.max(posX, 0), 100);
            const boundedY = Math.min(Math.max(posY, 0), 100);
            
            // Update position
            marker.style.left = boundedX + '%';
            marker.style.top = boundedY + '%';
        }
        
        function stopDrag() {
            isDragging = false;
            marker.classList.remove('dragging');
            
            // Remove document-level event listeners
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }
    }
    
    // Listen for new marker events from other scripts
    document.addEventListener('newMarkerAdded', (event) => {
        makeMarkerDraggable(event.detail.marker);
    });
    
    // Initialize markers when DOM loads
    initializeMarkers();
    
    // Resize map on window resize
    function resizeMap() {
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            // For mobile screens, use a percentage of viewport height
            if (window.innerWidth <= 767) {
                mapContainer.style.height = '50vh';
                return;
            }
            
            // For larger screens
            const viewportHeight = window.innerHeight;
            const mapTop = mapContainer.getBoundingClientRect().top;
            
            // Calculate available height (with padding)
            const availableHeight = viewportHeight - mapTop - 40;
            
            // Don't let it get too small
            const minHeight = 400;
            const finalHeight = Math.max(availableHeight, minHeight);
            
            // Apply the height, but don't let it get too large
            const maxHeight = Math.min(finalHeight, viewportHeight * 0.65);
            mapContainer.style.height = `${maxHeight}px`;
            
            // Also resize session panel to match
            const sessionPanel = document.getElementById('session-panel');
            if (sessionPanel) {
                sessionPanel.style.maxHeight = `${maxHeight}px`;
            }
        }
    }
    
    // Replace the existing resize event listeners with this
    window.addEventListener('resize', () => {
        resizeMap();
    });
    
    window.addEventListener('load', () => {
        resizeMap();
        
        // Also run after a short delay to ensure all elements are properly loaded
        setTimeout(resizeMap, 200);
    });
    
    // Call resize after page navigation
    document.addEventListener('pageChanged', () => {
        setTimeout(resizeMap, 100);
    });
});
