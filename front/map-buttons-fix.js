// Direct implementation of map buttons that overrides any existing functionality

console.log('MAP BUTTONS FIX RUNNING');

// Run on DOMContentLoaded and again when window loads
function installButtonHandlers() {
    console.log('Installing direct button handlers');
    
    // ===== ADD CHARACTER BUTTON =====
    const addCharBtn = document.querySelector('.add-character-btn');
    if (addCharBtn) {
        // Create a new button to replace the existing one
        const newAddBtn = document.createElement('button');
        newAddBtn.className = 'map-control-btn add-character-btn';
        newAddBtn.innerHTML = '<i class="fas fa-user-plus"></i> Add Character';
        
        // Directly set onclick handler
        newAddBtn.onclick = function(e) {
            e.stopPropagation();
            console.log('Add character button clicked');
            createCharacterModal();
            return false;
        };
        
        // Replace the existing button
        if (addCharBtn.parentNode) {
            addCharBtn.parentNode.replaceChild(newAddBtn, addCharBtn);
            console.log('Successfully replaced Add Character button');
        }
    }
    
    // ===== RESET MAP BUTTON =====
    const resetBtn = document.querySelector('.reset-map-btn');
    if (resetBtn) {
        // Create a new button to replace the existing one
        const newResetBtn = document.createElement('button');
        newResetBtn.className = 'map-control-btn reset-map-btn';
        newResetBtn.innerHTML = '<i class="fas fa-undo"></i> Reset Map';
        
        // Directly set onclick handler
        newResetBtn.onclick = function(e) {
            e.stopPropagation();
            console.log('Reset map button clicked');
            resetMap();
            return false;
        };
        
        // Replace the existing button
        if (resetBtn.parentNode) {
            resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            console.log('Successfully replaced Reset Map button');
        }
    }
}

// Character selection modal creation
function createCharacterModal() {
    console.log('Creating character selection modal');
    
    // Create modal element
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
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Set up character type buttons
    const charTypeButtons = modal.querySelectorAll('.character-type-buttons button');
    charTypeButtons.forEach(btn => {
        btn.onclick = function() {
            const charType = this.getAttribute('data-character');
            console.log(`Selected character: ${charType}`);
            addCharacterToMap(charType);
            modal.remove();
        };
    });
    
    // Set up close button
    const closeBtn = modal.querySelector('.close-selection');
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.remove();
        };
    }
}

// Add character to map function
function addCharacterToMap(charType) {
    console.log(`Adding character to map: ${charType}`);
    
    // Get active map
    const activeMap = document.querySelector('.game-map.active');
    if (!activeMap) {
        showNotification('No active map found');
        return;
    }
    
    // Create marker element
    const marker = document.createElement('div');
    marker.className = 'character-marker draggable';
    marker.setAttribute('data-character', charType);
    
    // Choose icon based on character type
    let iconClass;
    switch (charType) {
        case 'wizard': iconClass = 'fa-hat-wizard'; break;
        case 'warrior': iconClass = 'fa-shield-alt'; break;
        case 'ranger': iconClass = 'fa-skull'; break;
        case 'rogue': iconClass = 'fa-mask'; break;
        default: iconClass = 'fa-user';
    }
    
    // Set marker content and position
    marker.innerHTML = `<i class="fas ${iconClass}"></i>`;
    marker.style.left = '50%';
    marker.style.top = '50%';
    
    // Add marker to map
    const markersContainer = activeMap.querySelector('.map-markers');
    if (markersContainer) {
        markersContainer.appendChild(marker);
        
        // Make marker draggable
        makeDraggable(marker);
        
        // Show success notification
        showNotification(`${charType.charAt(0).toUpperCase() + charType.slice(1)} added to map`);
    } else {
        console.error('Map markers container not found');
    }
}

// Reset map function
function resetMap() {
    console.log('Resetting map');
    
    // Get active map
    const activeMap = document.querySelector('.game-map.active');
    if (!activeMap) {
        showNotification('No active map found');
        return;
    }
    
    // Get map name for notification
    const mapName = activeMap.id.replace('-map', '');
    
    // Remove custom markers (non-player1)
    const customMarkers = activeMap.querySelectorAll('.character-marker:not([data-character="player1"])');
    customMarkers.forEach(marker => marker.remove());
    
    // Reset position of default markers
    const defaultMarkers = activeMap.querySelectorAll('.character-marker[data-character="player1"]');
    defaultMarkers.forEach(marker => {
        marker.style.left = '50%';
        marker.style.top = '50%';
    });
    
    // Show success notification
    showNotification(`Map "${mapName}" has been reset`);
}

// Make marker draggable function
function makeDraggable(marker) {
    let isDragging = false;
    let offsetX, offsetY;
    
    // Mouse/touch start event
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        
        // Get position
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
        offsetX = clientX - rect.left - rect.width / 2;
        offsetY = clientY - rect.top - rect.height / 2;
        
        // Add visual feedback
        marker.classList.add('dragging');
        
        // Add document-level event listeners
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }
    
    // Mouse/touch move event
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        // Get position
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
        
        // Calculate position as percentage
        const posX = ((clientX - offsetX) - mapRect.left) / mapRect.width * 100;
        const posY = ((clientY - offsetY) - mapRect.top) / mapRect.height * 100;
        
        // Bound position to map area
        const boundedX = Math.min(Math.max(posX, 0), 100);
        const boundedY = Math.min(Math.max(posY, 0), 100);
        
        // Set position
        marker.style.left = `${boundedX}%`;
        marker.style.top = `${boundedY}%`;
    }
    
    // Mouse/touch end event
    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;
        
        // Remove visual feedback
        marker.classList.remove('dragging');
        
        // Remove document-level event listeners
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
    
    // Add drag start event listeners
    marker.addEventListener('mousedown', startDrag);
    marker.addEventListener('touchstart', startDrag, { passive: false });
}

// Show notification function
function showNotification(message) {
    console.log(`Notification: ${message}`);
    
    // Check if notification already exists
    let notification = document.querySelector('.notification');
    
    // Create new notification if needed
    if (!notification) {
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
    
    // Hide notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Run on both DOMContentLoaded and window load to ensure buttons are fixed
document.addEventListener('DOMContentLoaded', installButtonHandlers);
window.addEventListener('load', installButtonHandlers);

// Also run when switching map tabs
document.addEventListener('click', function(e) {
    if (e.target.closest('.map-tab')) {
        setTimeout(installButtonHandlers, 100);
    }
});

// Run when entering/exiting fullscreen
document.getElementById('fullscreenBtn')?.addEventListener('click', function() {
    setTimeout(installButtonHandlers, 300);
});

// Make functions available globally
window.addCharacterToMap = addCharacterToMap;
window.resetMap = resetMap;
window.makeDraggable = makeDraggable;
window.showNotification = showNotification;

// Run immediately as well (don't wait for events)
setTimeout(installButtonHandlers, 100);
