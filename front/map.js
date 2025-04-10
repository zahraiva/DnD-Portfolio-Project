document.addEventListener('DOMContentLoaded', function() {
    console.log("Map script loaded");
    
    // Get map elements
    const mapContainer = document.querySelector('.map-container');
    const mapTabs = document.querySelectorAll('.map-tab');
    const gameMaps = document.querySelectorAll('.game-map');
    const addCharacterBtn = document.querySelector('.add-character-btn');
    
    // Set up map tabs
    mapTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            mapTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get map ID
            const mapId = tab.getAttribute('data-map');
            
            // Hide all maps
            gameMaps.forEach(map => map.classList.remove('active'));
            
            // Show selected map
            const selectedMap = document.getElementById(`${mapId}-map`);
            if (selectedMap) {
                selectedMap.classList.add('active');
            }
        });
    });
    
    // Make character markers draggable
    function makeMarkersDraggable() {
        const markers = document.querySelectorAll('.character-marker.draggable');
        
        markers.forEach(marker => {
            // Skip if already initialized
            if (marker.getAttribute('data-initialized') === 'true') return;
            
            let isDragging = false;
            let offsetX, offsetY;
            
            marker.addEventListener('mousedown', startDrag);
            marker.addEventListener('touchstart', startDrag, { passive: false });
            
            function startDrag(e) {
                e.preventDefault();
                isDragging = true;
                
                // Get mouse/touch position
                let clientX, clientY;
                if (e.type === 'touchstart') {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }
                
                // Get marker dimensions
                const rect = marker.getBoundingClientRect();
                
                // Calculate offset
                offsetX = clientX - rect.left - rect.width / 2;
                offsetY = clientY - rect.top - rect.height / 2;
                
                // Add move and end event listeners
                document.addEventListener('mousemove', drag);
                document.addEventListener('touchmove', drag, { passive: false });
                document.addEventListener('mouseup', stopDrag);
                document.addEventListener('touchend', stopDrag);
                
                // Add dragging class
                marker.classList.add('dragging');
            }
            
            function drag(e) {
                if (!isDragging) return;
                e.preventDefault();
                
                // Get mouse/touch position
                let clientX, clientY;
                if (e.type === 'touchmove') {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }
                
                // Get map container bounds
                const mapRect = marker.closest('.game-map').getBoundingClientRect();
                
                // Calculate position as percentage of map size
                const posX = ((clientX - offsetX) - mapRect.left) / mapRect.width * 100;
                const posY = ((clientY - offsetY) - mapRect.top) / mapRect.height * 100;
                
                // Limit to map boundaries
                const limitedX = Math.max(0, Math.min(100, posX));
                const limitedY = Math.max(0, Math.min(100, posY));
                
                // Update marker position
                marker.style.left = `${limitedX}%`;
                marker.style.top = `${limitedY}%`;
            }
            
            function stopDrag() {
                if (!isDragging) return;
                isDragging = false;
                
                // Remove move and end event listeners
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('touchmove', drag);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchend', stopDrag);
                
                // Remove dragging class
                marker.classList.remove('dragging');
            }
            
            // Mark as initialized
            marker.setAttribute('data-initialized', 'true');
        });
    }
    
    // Initialize draggable markers
    makeMarkersDraggable();
    
    // Handle adding new characters
    if (addCharacterBtn) {
        addCharacterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Show character selection modal
            if (window.showCharacterSelection) {
                window.showCharacterSelection();
            } else {
                console.error("showCharacterSelection function not available");
            }
        });
    }
    
    // Handle adding characters from selection
    window.addCharacterToMap = function(characterData) {
        // Get active map
        const activeMap = document.querySelector('.game-map.active');
        
        if (!activeMap) {
            console.error("No active map found");
            return;
        }
        
        // Create new marker
        const marker = document.createElement('div');
        marker.className = 'character-marker draggable';
        marker.dataset.character = characterData.id;
        marker.dataset.characterName = characterData.name;
        marker.dataset.characterClass = characterData.class;
        
        // Position marker in the center of the map
        marker.style.left = '50%';
        marker.style.top = '50%';
        
        // Set marker color based on class or use provided color
        const markerColor = characterData.color || '#72be99';
        marker.style.backgroundColor = markerColor;
        
        // Add appropriate icon based on class
        let iconClass = 'fa-user-circle'; // Default icon
        
        if (characterData.icon) {
            iconClass = characterData.icon;
        } else {
            // Fallback icons based on class
            switch (characterData.class) {
                case 'wizard':
                case 'sorcerer':
                case 'warlock':
                case 'druid':
                    iconClass = 'fa-hat-wizard';
                    break;
                case 'fighter':
                case 'barbarian':
                case 'monk':
                    iconClass = 'fa-shield-alt';
                    break;
                case 'rogue':
                case 'ranger':
                case 'bard':
                    iconClass = 'fa-mask';
                    break;
                case 'cleric':
                case 'paladin':
                    iconClass = 'fa-pray';
                    break;
            }
        }
        
        marker.innerHTML = `<i class="fas ${iconClass}"></i>`;
        
        // Add portrait if available (as background)
        if (characterData.image) {
            marker.style.backgroundImage = `url('${characterData.image}')`;
            marker.style.backgroundSize = 'cover';
            marker.style.backgroundPosition = 'center';
            
            // Add a semi-transparent overlay to make the icon visible
            marker.style.position = 'relative';
            
            // Create and append the icon container
            const iconContainer = document.createElement('div');
            iconContainer.className = 'character-marker-icon';
            iconContainer.innerHTML = `<i class="fas ${iconClass}"></i>`;
            marker.appendChild(iconContainer);
            
            // Use a smaller icon
            marker.classList.add('with-portrait');
        }
        
        // Add tooltip with character name
        marker.title = characterData.name;
        
        // Add marker to the map
        const markersContainer = activeMap.querySelector('.map-markers');
        markersContainer.appendChild(marker);
        
        // Make new marker draggable
        makeMarkersDraggable();
        
        // Show notification
        if (typeof showNotification === 'function') {
            showNotification(`${characterData.name} added to map`);
        } else {
            console.log(`${characterData.name} added to map`);
        }
        
        // Close modal if it exists
        const modal = document.getElementById('characterSelectionModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Match transition duration
        }
    };
    
    // Handle reset map button
    const resetMapBtn = document.querySelector('.reset-map-btn');
    if (resetMapBtn) {
        resetMapBtn.addEventListener('click', () => {
            const activeMap = document.querySelector('.game-map.active');
            if (activeMap) {
                // Get all custom markers (excluding original player marker)
                const customMarkers = activeMap.querySelectorAll('.character-marker:not([data-character="player1"])');
                
                // Remove all custom markers
                customMarkers.forEach(marker => {
                    marker.remove();
                });
                
                // Reset player marker to center
                const playerMarker = activeMap.querySelector('.character-marker[data-character="player1"]');
                if (playerMarker) {
                    playerMarker.style.left = '50%';
                    playerMarker.style.top = '50%';
                }
                
                // Show notification
                if (typeof showNotification === 'function') {
                    showNotification('Map reset to default');
                } else {
                    console.log('Map reset to default');
                }
            }
        });
    }
    
    // Listen for newly added markers from other scripts
    document.addEventListener('newMarkerAdded', event => {
        if (event.detail && event.detail.marker) {
            makeMarkersDraggable();
        }
    });

    // Fullscreen functionality
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (mapContainer.classList.contains('fullscreen')) {
                // Exit fullscreen
                mapContainer.classList.remove('fullscreen');
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                document.body.style.overflow = '';
            } else {
                // Enter fullscreen
                mapContainer.classList.add('fullscreen');
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                document.body.style.overflow = 'hidden';
            }
            
            // Initialize dice if needed
            if (typeof initializeDice === 'function') {
                setTimeout(initializeDice, 100);
            }
        });
    }
    
    // Show character details on marker click
    document.addEventListener('click', function(e) {
        const marker = e.target.closest('.character-marker');
        if (marker && !marker.classList.contains('dragging')) {
            const characterName = marker.dataset.characterName;
            const characterClass = marker.dataset.characterClass;
            
            // Create a small popup with character info
            const popup = document.createElement('div');
            popup.className = 'character-marker-popup';
            popup.innerHTML = `
                <h3>${characterName}</h3>
                <p>${characterClass ? characterClass.charAt(0).toUpperCase() + characterClass.slice(1) : 'Character'}</p>
                <button class="remove-marker-btn">Remove</button>
                <button class="roll-for-marker-btn">Roll for character</button>
            `;
            
            // Position popup near the marker
            const markerRect = marker.getBoundingClientRect();
            popup.style.left = `${markerRect.left + markerRect.width / 2}px`;
            popup.style.top = `${markerRect.top - 10}px`;
            
            // Add popup to body
            document.body.appendChild(popup);
            
            // Show popup
            setTimeout(() => {
                popup.classList.add('show');
            }, 10);
            
            // Add remove button functionality
            const removeBtn = popup.querySelector('.remove-marker-btn');
            removeBtn.addEventListener('click', () => {
                marker.remove();
                popup.remove();
                
                if (typeof showNotification === 'function') {
                    showNotification(`${characterName} removed from map`);
                }
            });
            
            // Add roll button functionality
            const rollBtn = popup.querySelector('.roll-for-marker-btn');
            if (rollBtn && typeof window.rollDice === 'function') {
                rollBtn.addEventListener('click', () => {
                    window.rollDice();
                    popup.classList.remove('show');
                    setTimeout(() => {
                        popup.remove();
                    }, 300);
                    
                    // Highlight marker briefly
                    marker.classList.add('highlight');
                    setTimeout(() => {
                        marker.classList.remove('highlight');
                    }, 1500);
                });
            }
            
            // Close popup when clicking elsewhere
            document.addEventListener('click', function closePopup(event) {
                if (!popup.contains(event.target) && event.target !== marker) {
                    popup.classList.remove('show');
                    setTimeout(() => {
                        popup.remove();
                    }, 300);
                    document.removeEventListener('click', closePopup);
                }
            });
        }
    });
    
    // Initialize dice when the map page becomes active
    if (typeof window.initializeDice === 'function') {
        // Initial initialization
        if (document.getElementById('map').classList.contains('active')) {
            window.initializeDice();
        }
        
        // Initialize when page changes to map
        document.addEventListener('pageChanged', function(e) {
            if (e.detail && e.detail.pageId === 'map') {
                window.initializeDice();
            }
        });
    }
});

// Helper function to show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Make showNotification globally available
window.showNotification = showNotification;

// Dispatch custom event when page changes
document.addEventListener('DOMContentLoaded', function() {
    const originalShowPage = window.showPage;
    if (originalShowPage) {
        window.showPage = function(pageId, options = {}) {
            originalShowPage(pageId, options);
            
            // Dispatch custom event
            const event = new CustomEvent('pageChanged', {
                detail: { pageId, options }
            });
            document.dispatchEvent(event);
        };
    }
});
