// Ensure the button fixer respects the centered map layout
(function() {
    function fixButtons() {
        console.log('Button fixer running...');
        
        // Fix Add Character button
        const addCharBtn = document.querySelector('.add-character-btn');
        if (addCharBtn) {
            console.log('Found Add Character button');
            
            // Clone to remove existing listeners
            const newAddBtn = addCharBtn.cloneNode(true);
            if (addCharBtn.parentNode) {
                addCharBtn.parentNode.replaceChild(newAddBtn, addCharBtn);
            }
            
            // Set direct onclick handler
            newAddBtn.onclick = function(e) {
                console.log('Add Character button clicked');
                e.preventDefault();
                e.stopPropagation();
                
                if (window.showCharacterSelection) {
                    window.showCharacterSelection();
                } else {
                    // Fallback if the function isn't available
                    const modal = createCharacterModal();
                    document.body.appendChild(modal);
                }
                
                return false;
            };
        }
        
        // Fix Reset Map button
        const resetBtn = document.querySelector('.reset-map-btn');
        if (resetBtn) {
            console.log('Found Reset Map button');
            
            // Clone to remove existing listeners
            const newResetBtn = resetBtn.cloneNode(true);
            if (resetBtn.parentNode) {
                resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            }
            
            // Set direct onclick handler
            newResetBtn.onclick = function(e) {
                console.log('Reset Map button clicked');
                e.preventDefault();
                e.stopPropagation();
                
                if (window.resetMap) {
                    window.resetMap();
                } else {
                    // Fallback if the function isn't available
                    resetMapFallback();
                }
                
                return false;
            };
        }
        
        // Fix fullscreen button too
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            // Clone to remove existing listeners
            const newFullscreenBtn = fullscreenBtn.cloneNode(true);
            if (fullscreenBtn.parentNode) {
                fullscreenBtn.parentNode.replaceChild(newFullscreenBtn, fullscreenBtn);
            }
            
            // Set direct onclick handler
            newFullscreenBtn.onclick = function() {
                console.log('Fullscreen button clicked');
                
                const mapContainer = document.querySelector('.map-container');
                if (!mapContainer) return;
                
                // Toggle fullscreen class
                if (mapContainer.classList.contains('fullscreen')) {
                    mapContainer.classList.remove('fullscreen');
                    this.innerHTML = '<i class="fas fa-expand"></i>';
                    document.body.style.overflow = '';
                } else {
                    mapContainer.classList.add('fullscreen');
                    this.innerHTML = '<i class="fas fa-compress"></i>';
                    document.body.style.overflow = 'hidden';
                }
                
                // Ensure map is properly sized after fullscreen toggle
                setTimeout(() => {
                    const activeMap = document.querySelector('.game-map.active');
                    if (activeMap) {
                        const mapId = activeMap.id.replace('-map', '');
                        if (window.fixMapSizingAndBackground) {
                            window.fixMapSizingAndBackground(mapId);
                        }
                    }
                    
                    // Reapply button fixes
                    fixButtons();
                }, 300);
            };
        }
    }
    
    // Create character selection modal as a fallback
    function createCharacterModal() {
        console.log('Creating character modal (fallback)');
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
        
        // Handle character selection
        modal.querySelectorAll('[data-character]').forEach(btn => {
            btn.addEventListener('click', function() {
                const characterType = this.getAttribute('data-character');
                
                if (window.addCharacterToMap) {
                    window.addCharacterToMap(characterType);
                } else {
                    // Fallback if the function isn't available
                    addCharacterFallback(characterType);
                }
                
                modal.remove();
            });
        });
        
        // Handle close button
        modal.querySelector('.close-selection').addEventListener('click', function() {
            modal.remove();
        });
        
        return modal;
    }
    
    // Fallback for adding character to map
    function addCharacterFallback(characterType) {
        console.log(`Adding character (fallback): ${characterType}`);
        const activeMap = document.querySelector('.game-map.active');
        
        if (activeMap) {
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
            
            // Make draggable if the function exists
            if (window.makeMarkerDraggable) {
                window.makeMarkerDraggable(marker);
            }
            
            // Show notification
            notifyFallback(`${characterType} added to map`);
        } else {
            notifyFallback('No active map found');
        }
    }
    
    // Fallback for resetting map
    function resetMapFallback() {
        console.log('Resetting map (fallback)');
        const activeMap = document.querySelector('.game-map.active');
        
        if (activeMap) {
            // Remove custom markers
            const customMarkers = activeMap.querySelectorAll('.character-marker:not([data-character="player1"])');
            customMarkers.forEach(marker => marker.remove());
            
            // Reset default markers
            const defaultMarkers = activeMap.querySelectorAll('.character-marker[data-character="player1"]');
            defaultMarkers.forEach(marker => {
                marker.style.left = '50%';
                marker.style.top = '50%';
            });
            
            // Show notification
            notifyFallback('Map has been reset');
        } else {
            notifyFallback('No active map found');
        }
    }
    
    // Fallback notification function
    function notifyFallback(message) {
        console.log(`Notification (fallback): ${message}`);
        
        if (window.showNotification) {
            window.showNotification(message);
            return;
        }
        
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
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Fix buttons on load
    document.addEventListener('DOMContentLoaded', fixButtons);
    
    // Also fix after a short delay to make sure all scripts have loaded
    setTimeout(fixButtons, 500);
    
    // Fix buttons after any tab change
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('map-tab') || e.target.closest('.map-tab')) {
            setTimeout(fixButtons, 100);
        }
    });
    
    // Fix buttons after fullscreen toggle
    document.getElementById('fullscreenBtn')?.addEventListener('click', function() {
        setTimeout(fixButtons, 300);
    });
    
    // Fix buttons on window load
    window.addEventListener('load', fixButtons);
    
    // Fix buttons after any navigation event
    window.addEventListener('hashchange', fixButtons);
    
    // Fix buttons on window resize
    window.addEventListener('resize', function() {
        setTimeout(fixButtons, 100);
    });
})();
