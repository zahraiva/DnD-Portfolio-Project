// This is an emergency script to directly fix the buttons without relying on other files

// Wait until window is fully loaded to make sure elements exist
window.addEventListener('load', function() {
    console.log('EMERGENCY BUTTON FIX INITIATED');
    
    // Direct implementation for Add Character button
    const addCharBtn = document.querySelector('.add-character-btn');
    if (addCharBtn) {
        console.log('Found Add Character button - applying direct fix');
        
        // Remove any existing listener by cloning
        const newAddBtn = addCharBtn.cloneNode(true);
        if (addCharBtn.parentNode) {
            addCharBtn.parentNode.replaceChild(newAddBtn, addCharBtn);
        }
        
        // Add direct onclick handler
        newAddBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Add character button clicked (emergency fix)');
            
            // Create character selection modal
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
            modal.querySelectorAll('.character-type-buttons button').forEach(btn => {
                btn.addEventListener('click', function() {
                    const characterType = this.getAttribute('data-character');
                    
                    // Add character to active map
                    const activeMap = document.querySelector('.game-map.active');
                    if (activeMap) {
                        // Create new character marker
                        const marker = document.createElement('div');
                        marker.className = 'character-marker draggable';
                        marker.setAttribute('data-character', characterType);
                        
                        // Set icon based on character type
                        let iconClass;
                        switch(characterType) {
                            case 'wizard': iconClass = 'fa-hat-wizard'; break;
                            case 'warrior': iconClass = 'fa-shield-alt'; break;
                            case 'ranger': iconClass = 'fa-skull'; break;
                            case 'rogue': iconClass = 'fa-mask'; break;
                            default: iconClass = 'fa-user';
                        }
                        
                        marker.innerHTML = `<i class="fas ${iconClass}"></i>`;
                        
                        // Center marker on map
                        marker.style.left = '50%';
                        marker.style.top = '50%';
                        
                        // Add to map
                        const mapMarkers = activeMap.querySelector('.map-markers');
                        mapMarkers.appendChild(marker);
                        
                        // Make marker draggable
                        makeDraggable(marker);
                        
                        // Show notification
                        showNotification(`${characterType.charAt(0).toUpperCase() + characterType.slice(1)} added to map!`);
                    } else {
                        showNotification('No active map found!');
                    }
                    
                    modal.remove();
                });
            });
            
            // Handle close button
            modal.querySelector('.close-selection').addEventListener('click', function() {
                modal.remove();
            });
            
            return false;
        };
    }
    
    // Direct implementation for Reset Map button
    const resetBtn = document.querySelector('.reset-map-btn');
    if (resetBtn) {
        console.log('Found Reset Map button - applying direct fix');
        
        // Remove any existing listener by cloning
        const newResetBtn = resetBtn.cloneNode(true);
        if (resetBtn.parentNode) {
            resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
        }
        
        // Add direct onclick handler
        newResetBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Reset map button clicked (emergency fix)');
            
            // Find active map
            const activeMap = document.querySelector('.game-map.active');
            if (activeMap) {
                const mapName = activeMap.id.replace('-map', '');
                
                // Remove non-player markers
                const customMarkers = activeMap.querySelectorAll('.character-marker:not([data-character="player1"])');
                customMarkers.forEach(marker => marker.remove());
                
                // Reset default player marker position
                const defaultMarkers = activeMap.querySelectorAll('.character-marker[data-character="player1"]');
                defaultMarkers.forEach(marker => {
                    marker.style.left = '50%';
                    marker.style.top = '50%';
                });
                
                showNotification(`Map "${mapName}" has been reset`);
            } else {
                showNotification('No active map found!');
            }
            
            return false;
        };
    }
    
    // Simple utility functions
    
    // Function to make markers draggable
    function makeDraggable(marker) {
        let isDragging = false;
        let offsetX, offsetY;
        
        marker.addEventListener('mousedown', startDrag);
        marker.addEventListener('touchstart', startDrag, { passive: false });
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
            marker.classList.add('dragging');
            
            // Get coordinates
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
            
            // Add event listeners
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            // Get coordinates
            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            // Get map bounds
            const mapContainer = marker.closest('.game-map');
            const mapRect = mapContainer.getBoundingClientRect();
            
            // Calculate position as percentage
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
    
    // Function to show notification
    function showNotification(message) {
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            `;
            document.body.appendChild(notification);
        } else {
            notification.querySelector('span').textContent = message;
        }
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Also make these available globally
    window.makeDraggable = makeDraggable;
    window.showNotification = showNotification;
    
    console.log('EMERGENCY BUTTON FIX COMPLETED');
});
