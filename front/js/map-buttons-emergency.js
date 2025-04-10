// Last resort script to fix map buttons - only include if absolutely necessary

document.addEventListener('DOMContentLoaded', function() {
    console.log('EMERGENCY MAP BUTTONS FIX');
    
    // Fix Add Character button directly in HTML
    const addBtn = `
      <button class="map-control-btn add-character-btn" onclick="emergencyAddCharacter(event)">
        <i class="fas fa-user-plus"></i> Add Character
      </button>
    `;
    
    // Fix Reset Map button directly in HTML
    const resetBtn = `
      <button class="map-control-btn reset-map-btn" onclick="emergencyResetMap(event)">
        <i class="fas fa-undo"></i> Reset Map
      </button>
    `;
    
    // Wait for map container to be ready
    setTimeout(function() {
        // Find map container
        const mapContainer = document.querySelector('.map-container');
        if (!mapContainer) return;
        
        // Replace buttons with our fixed versions
        const oldAddBtn = mapContainer.querySelector('.add-character-btn');
        const oldResetBtn = mapContainer.querySelector('.reset-map-btn');
        
        if (oldAddBtn) {
            oldAddBtn.outerHTML = addBtn;
        } else {
            mapContainer.insertAdjacentHTML('afterbegin', addBtn);
        }
        
        if (oldResetBtn) {
            oldResetBtn.outerHTML = resetBtn;
        } else {
            mapContainer.insertAdjacentHTML('afterbegin', resetBtn);
        }
        
        console.log('Emergency buttons inserted into DOM');
    }, 1000);
    
    // Create global functions for the inline onclick handlers
    window.emergencyAddCharacter = function(e) {
        e.preventDefault();
        console.log('Emergency add character clicked');
        
        // Create and show the character selection modal
        const modal = document.createElement('div');
        modal.className = 'character-selection-modal';
        modal.innerHTML = `
            <div class="character-selection-content">
                <h3>Select Character Type</h3>
                <div class="character-type-buttons">
                    <button onclick="emergencyAddToMap('wizard')"><i class="fas fa-hat-wizard"></i>Wizard</button>
                    <button onclick="emergencyAddToMap('warrior')"><i class="fas fa-shield-alt"></i>Warrior</button>
                    <button onclick="emergencyAddToMap('ranger')"><i class="fas fa-skull"></i>Ranger</button>
                    <button onclick="emergencyAddToMap('rogue')"><i class="fas fa-mask"></i>Rogue</button>
                </div>
                <button onclick="this.closest('.character-selection-modal').remove()">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        return false;
    };
    
    window.emergencyAddToMap = function(characterType) {
        console.log(`Emergency adding character: ${characterType}`);
        
        // Find active map
        const activeMap = document.querySelector('.game-map.active');
        if (!activeMap) {
            alert('No active map found!');
            return;
        }
        
        // Create character marker
        const marker = document.createElement('div');
        marker.className = 'character-marker draggable';
        marker.setAttribute('data-character', characterType);
        
        // Set icon
        let iconClass;
        switch(characterType) {
            case 'wizard': iconClass = 'fa-hat-wizard'; break;
            case 'warrior': iconClass = 'fa-shield-alt'; break;
            case 'ranger': iconClass = 'fa-skull'; break;
            case 'rogue': iconClass = 'fa-mask'; break;
            default: iconClass = 'fa-user';
        }
        
        marker.innerHTML = `<i class="fas ${iconClass}"></i>`;
        marker.style.left = '50%';
        marker.style.top = '50%';
        
        // Add to map
        const mapMarkers = activeMap.querySelector('.map-markers');
        mapMarkers.appendChild(marker);
        
        // Remove modal
        document.querySelector('.character-selection-modal').remove();
        
        // Add emergency dragging capability
        emergencyMakeDraggable(marker);
        
        // Show notification
        emergencyNotify(`${characterType.charAt(0).toUpperCase() + characterType.slice(1)} added to map!`);
    };
    
    window.emergencyResetMap = function(e) {
        e.preventDefault();
        console.log('Emergency reset map clicked');
        
        // Find active map
        const activeMap = document.querySelector('.game-map.active');
        if (!activeMap) {
            alert('No active map found!');
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
        
        // Show notification
        emergencyNotify(`Map "${mapName}" has been reset`);
        return false;
    };
    
    // Simple drag and drop functionality
    function emergencyMakeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;
        
        element.onmousedown = dragStart;
        element.ontouchstart = dragStart;
        
        function dragStart(e) {
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
            const rect = element.getBoundingClientRect();
            offsetX = clientX - (rect.left + rect.width/2);
            offsetY = clientY - (rect.top + rect.height/2);
            
            // Add event listeners
            document.onmousemove = drag;
            document.ontouchmove = drag;
            document.onmouseup = dragEnd;
            document.ontouchend = dragEnd;
        }
        
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
            
            // Get map bounds
            const map = element.closest('.game-map');
            const rect = map.getBoundingClientRect();
            
            // Calculate position percentage
            const x = ((clientX - offsetX) - rect.left) / rect.width * 100;
            const y = ((clientY - offsetY) - rect.top) / rect.height * 100;
            
            // Constrain to map boundaries
            const posX = Math.min(Math.max(x, 0), 100);
            const posY = Math.min(Math.max(y, 0), 100);
            
            // Update position
            element.style.left = posX + '%';
            element.style.top = posY + '%';
        }
        
        function dragEnd() {
            isDragging = false;
            document.onmousemove = null;
            document.ontouchmove = null;
            document.onmouseup = null;
            document.ontouchend = null;
        }
    }
    
    // Create a simple notification function
    window.emergencyNotify = function(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };
});
