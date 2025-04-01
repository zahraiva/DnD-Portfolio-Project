document.addEventListener('DOMContentLoaded', function() {
    console.log('Map buttons script loaded');
    
    // Add Character button functionality
    const addCharacterBtn = document.querySelector('.add-character-btn');
    if (addCharacterBtn) {
        addCharacterBtn.addEventListener('click', function() {
            console.log('Add character button clicked');
            showCharacterSelection();
        });
    } else {
        console.error('Add character button not found');
    }
    
    // Reset Map button functionality
    const resetMapBtn = document.querySelector('.reset-map-btn');
    if (resetMapBtn) {
        resetMapBtn.addEventListener('click', function() {
            console.log('Reset map button clicked');
            resetMap();
        });
    } else {
        console.error('Reset map button not found');
    }
    
    // Character selection modal
    function showCharacterSelection() {
        const modal = document.createElement('div');
        modal.className = 'character-selection-modal';
        modal.innerHTML = `
            <div class="character-selection-content">
                <h3>Select Character Type</h3>
                <div class="character-type-buttons">
                    <button data-character="wizard"><i class="fas fa-hat-wizard"></i>Wizard</button>
                    <button data-character="warrior"><i class="fas fa-shield-alt"></i>Warrior</button>
                    <button data-character="ranger"><i class="fas fa-skull"></i>Ranger</button>
                    <button data-character="rogue"><i class="fas fa-mask"></i>Rogue</button>
                </div>
                <button class="close-selection">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle character selection
        const characterBtns = modal.querySelectorAll('[data-character]');
        characterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const characterType = this.getAttribute('data-character');
                addCharacterToMap(characterType);
                modal.remove();
            });
        });
        
        // Handle close button
        modal.querySelector('.close-selection').addEventListener('click', function() {
            modal.remove();
        });
    }
    
    // Add character to active map
    function addCharacterToMap(characterType) {
        // Find active map
        const activeMap = document.querySelector('.game-map.active');
        if (!activeMap) {
            showNotification('No active map found! Please select a map first.');
            return;
        }
        
        // Create new character marker
        const marker = document.createElement('div');
        marker.className = 'character-marker draggable';
        marker.setAttribute('data-character', characterType);
        
        // Add icon based on character type
        let iconClass;
        switch(characterType) {
            case 'wizard':
                iconClass = 'fa-hat-wizard';
                break;
            case 'warrior':
                iconClass = 'fa-shield-alt';
                break;
            case 'ranger':
                iconClass = 'fa-skull';
                break;
            case 'rogue':
                iconClass = 'fa-mask';
                break;
            default:
                iconClass = 'fa-user';
        }
        
        marker.innerHTML = `<i class="fas ${iconClass}"></i>`;
        
        // Position marker in center of map initially
        marker.style.left = '50%';
        marker.style.top = '50%';
        
        // Add to map
        const mapMarkers = activeMap.querySelector('.map-markers');
        mapMarkers.appendChild(marker);
        
        // Make the new marker draggable
        makeMarkerDraggable(marker);
        
        // Show notification
        showNotification(`${characterType.charAt(0).toUpperCase() + characterType.slice(1)} added to map!`);
    }
    
    // Reset map (remove all character markers)
    function resetMap() {
        // Find active map
        const activeMap = document.querySelector('.game-map.active');
        if (!activeMap) {
            showNotification('No active map found! Please select a map first.');
            return;
        }
        
        const mapName = activeMap.id.replace('-map', '');
        
        // Remove all character markers except the default player marker
        const customMarkers = activeMap.querySelectorAll('.character-marker:not([data-character="player1"])');
        customMarkers.forEach(marker => marker.remove());
        
        // Reset default markers to original position
        const defaultMarkers = activeMap.querySelectorAll('.character-marker[data-character="player1"]');
        defaultMarkers.forEach(marker => {
            marker.style.left = '50%';
            marker.style.top = '50%';
        });
        
        showNotification(`Map "${mapName}" has been reset`);
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
            
            // Add dragging class
            marker.classList.add('dragging');
            
            // Get mouse/touch position
            let clientX, clientY;
            if (e.type === 'touchstart') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            // Calculate offset
            const rect = marker.getBoundingClientRect();
            offsetX = clientX - (rect.left + rect.width / 2);
            offsetY = clientY - (rect.top + rect.height / 2);
            
            // Add move and end event listeners
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
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
            const mapContainer = marker.closest('.game-map');
            const mapRect = mapContainer.getBoundingClientRect();
            
            // Calculate new position as percentage (for responsive positioning)
            const posX = ((clientX - offsetX) - mapRect.left) / mapRect.width * 100;
            const posY = ((clientY - offsetY) - mapRect.top) / mapRect.height * 100;
            
            // Limit to map boundaries
            const limitedX = Math.min(Math.max(posX, 0), 100);
            const limitedY = Math.min(Math.max(posY, 0), 100);
            
            // Update marker position
            marker.style.left = `${limitedX}%`;
            marker.style.top = `${limitedY}%`;
        }
        
        function stopDrag() {
            isDragging = false;
            marker.classList.remove('dragging');
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }
    }
    
    // Simple notification function
    function showNotification(message) {
        // First check if we already have a notification element
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            // Create notification element if it doesn't exist
            notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            `;
            document.body.appendChild(notification);
        } else {
            // Update existing notification
            notification.querySelector('span').textContent = message;
        }
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            // Remove after transition
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Make this function available globally
    window.showNotification = showNotification;
    
    // Also make these functions available globally
    window.addCharacterToMap = addCharacterToMap;
    window.resetMap = resetMap;
    window.makeMarkerDraggable = makeMarkerDraggable;
});
