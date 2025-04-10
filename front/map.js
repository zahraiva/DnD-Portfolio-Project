document.addEventListener('DOMContentLoaded', function() {
    console.log('Map script loaded');
    
    // Reference elements
    const mapTabs =     document.querySelectorAll('.map-tab');
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
        
        // Get all map images
        const mapImages = document.querySelectorAll('.map-base-img');
        
        mapImages.forEach(img => {
            // Set a dark background by default
            img.style.background = '#0a1f12';
            
            // When image loads, ensure it's centered and contained
            img.onload = function() {
                // Always use contain to show the entire image
                img.style.objectFit = 'contain';
                
                console.log(`Map image loaded: ${img.src} (${this.naturalWidth}x${this.naturalHeight})`);
            };
            
            // Ensure onload runs for cached images
            if (img.complete) {
                img.onload();
            }
        });
    }
    
    // Function to resize map container based on the actual image dimensions
    function resizeMapContainerToImage(mapId) {
        const mapContainer = document.querySelector('.map-container');
        const mapImage = document.querySelector(`#${mapId}-map .map-base-img`);
        
        if (!mapContainer || !mapImage) return;
        
        // Get the image's natural dimensions
        const imgWidth = mapImage.naturalWidth;
        const imgHeight = mapImage.naturalHeight;
        
        if (!imgWidth || !imgHeight) {
            console.log(`Image dimensions not available for ${mapId} map`);
            return;
        }
        
        console.log(`Image dimensions for ${mapId}: ${imgWidth}x${imgHeight}`);
        
        // Calculate aspect ratio
        const aspectRatio = imgWidth / imgHeight;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate maximum container dimensions based on viewport
        // We'll use a percentage of the viewport while maintaining the image's aspect ratio
        let containerHeight, containerWidth;
        
        if (viewportWidth >= 768) {
            // For desktop: Use 80% of viewport height
            containerHeight = Math.min(viewportHeight * 0.8, imgHeight);
            containerWidth = containerHeight * aspectRatio;
            
            // Make sure width doesn't exceed 95% of viewport width
            if (containerWidth > viewportWidth * 0.95) {
                containerWidth = viewportWidth * 0.95;
                containerHeight = containerWidth / aspectRatio;
            }
        } else {
            // For mobile: Use 100% of viewport width
            containerWidth = viewportWidth * 0.95;
            containerHeight = containerWidth / aspectRatio;
            
            // Make sure height isn't too large on mobile
            if (containerHeight > viewportHeight * 0.7) {
                containerHeight = viewportHeight * 0.7;
                containerWidth = containerHeight * aspectRatio;
            }
        }
        
        // Apply the calculated dimensions
        mapContainer.style.width = `${containerWidth}px`;
        mapContainer.style.height = `${containerHeight}px`;
        mapImage.style.objectFit = "contain"; // Always use contain to avoid cropping
        
        console.log(`Resized container to ${containerWidth.toFixed(0)}x${containerHeight.toFixed(0)}px`);
    }
    
    // This function to automatically size containers based on image dimensions
    function dynamicMapSizing() {
        console.log('Setting up dynamic map sizing');
        
        // Process each map tab to handle switching between maps
        document.querySelectorAll('.map-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const mapId = this.getAttribute('data-map');
                console.log(`Map tab clicked: ${mapId}`);
                
                // Short delay to ensure the map is visible
                setTimeout(() => {
                    resizeMapContainerToImage(mapId);
                }, 50);
            });
        });
        
        // Handle initial sizing for the active map
        const activeMap = document.querySelector('.game-map.active');
        if (activeMap) {
            const mapId = activeMap.id.replace('-map', '');
            resizeMapContainerToImage(mapId);
        }
        
        // Handle window resize events
        window.addEventListener('resize', function() {
            const activeMap = document.querySelector('.game-map.active');
            if (activeMap) {
                const mapId = activeMap.id.replace('-map', '');
                resizeMapContainerToImage(mapId);
            }
        });
    }
    
    // Exactly match container to image dimensions
    function fixMapSizingAndBackground(mapId) {
        console.log(`Fixing map sizing and background for: ${mapId}`);
        
        const mapContainer = document.querySelector('.map-container');
        const mapImage = document.querySelector(`#${mapId}-map .map-base-img`);
        const gameMap = document.querySelector(`#${mapId}-map`);
        
        if (!mapContainer || !mapImage || !gameMap) return;
        
        // First ensure the background color matches the image dimensions
        gameMap.style.backgroundColor = '#0a1f12';
        
        // Wait for image to be fully loaded
        if (!mapImage.complete) {
            console.log('Image not yet loaded, setting onload handler');
            mapImage.onload = function() {
                setContainerAndBackground(mapContainer, mapImage, gameMap, mapId);
            };
        } else {
            setContainerAndBackground(mapContainer, mapImage, gameMap, mapId);
        }
    }
    
    // Function to set container size and background to match image exactly
    function setContainerAndBackground(container, image, gameMap, mapId) {
        // Get image natural dimensions
        const imgWidth = image.naturalWidth;
        const imgHeight = image.naturalHeight;
        
        if (!imgWidth || !imgHeight) {
            console.log('Image dimensions not available');
            return;
        }
        
        console.log(`Image dimensions: ${imgWidth}x${imgHeight}`);
        
        // Set container size to match image dimensions with max constraints
        const maxWidth = Math.min(window.innerWidth * 0.95, imgWidth);
        const maxHeight = Math.min(window.innerHeight * 0.75, imgHeight);
        
        // Calculate container size maintaining aspect ratio
        const aspectRatio = imgWidth / imgHeight;
        let containerWidth, containerHeight;
        
        if (aspectRatio > 1) { // Landscape image
            containerWidth = maxWidth;
            containerHeight = containerWidth / aspectRatio;
            
            // If height is still too tall
            if (containerHeight > maxHeight) {
                containerHeight = maxHeight;
                containerWidth = containerHeight * aspectRatio;
            }
        } else { // Portrait image
            containerHeight = maxHeight;
            containerWidth = containerHeight * aspectRatio;
            
            // If width is still too wide
            if (containerWidth > maxWidth) {
                containerWidth = maxWidth;
                containerHeight = containerWidth / aspectRatio;
            }
        }
        
        // Apply dimensions
        container.style.width = `${Math.round(containerWidth)}px`;
        container.style.height = `${Math.round(containerHeight)}px`;
        
        // Center the map container
        container.style.margin = '0 auto';
        
        // Create a background container with the exact same dimensions as the image
        const backgroundElement = gameMap.querySelector('.map-background');
        if (!backgroundElement) {
            // Create background element if it doesn't exist
            const background = document.createElement('div');
            background.className = 'map-background';
            gameMap.insertBefore(background, gameMap.firstChild);
        }
        
        // Position the background element to match the image exactly
        const background = gameMap.querySelector('.map-background');
        background.style.position = 'absolute';
        background.style.top = '0';
        background.style.left = '0';
        background.style.width = '100%';
        background.style.height = '100%';
        background.style.backgroundColor = '#0a1f12';
        background.style.zIndex = '-1';
        
        // Make sure the image fits perfectly in its container
        image.style.objectFit = 'contain';
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.display = 'block';
        image.style.margin = '0 auto';
        image.style.position = 'relative';
        image.style.zIndex = '1';
        
        // Log the container dimensions
        console.log(`Container sized to ${Math.round(containerWidth)}x${Math.round(containerHeight)}`);
    }
    
    // Ensure map is centered and properly sized
    function centerAndSizeMap() {
        console.log('Setting up map sizing, centering, and background');
        
        // Process each map tab
        document.querySelectorAll('.map-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const mapId = this.getAttribute('data-map');
                console.log(`Map tab clicked: ${mapId}`);
                
                // Short delay to ensure the map is visible
                setTimeout(() => {
                    fixMapSizingAndBackground(mapId);
                }, 50);
            });
        });
        
        // Handle initial sizing for the active map
        const activeMap = document.querySelector('.game-map.active');
        if (activeMap) {
            const mapId = activeMap.id.replace('-map', '');
            fixMapSizingAndBackground(mapId);
        }
        
        // Handle window resize events
        window.addEventListener('resize', function() {
            const activeMap = document.querySelector('.game-map.active');
            if (activeMap) {
                const mapId = activeMap.id.replace('-map', '');
                fixMapSizingAndBackground(mapId);
            }
        });
    }
    
    // Properly handle map tab selection
    function setupMapTabs() {
        console.log('Setting up map tab selection');
        
        // Get all map tabs
        const mapTabs = document.querySelectorAll('.map-tab');
        
        // Add click event to each tab
        mapTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                mapTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get map ID
                const mapId = this.getAttribute('data-map');
                console.log(`Switching to map: ${mapId}`);
                
                // Hide all maps
                const maps = document.querySelectorAll('.game-map');
                maps.forEach(map => {
                    map.classList.remove('active');
                    map.style.display = 'none';
                });
                
                // Show selected map
                const selectedMap = document.getElementById(`${mapId}-map`);
                if (selectedMap) {
                    selectedMap.classList.add('active');
                    selectedMap.style.display = 'block';
                    
                    // Resize the map container to match the image
                    fixMapSizingAndBackground(mapId);
                    
                    // Show loading indicator while map is loading
                    const loadingIndicator = document.querySelector('.map-loading');
                    if (loadingIndicator) {
                        loadingIndicator.classList.add('show');
                        
                        // Hide loading indicator after a short delay
                        setTimeout(() => {
                            loadingIndicator.classList.remove('show');
                        }, 500);
                    }
                }
            });
        });
    }
    
    // Make character markers draggable (implementation)
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
    
    // Character selection modal
    function showCharacterSelection() {
        console.log('Showing character selection modal');
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
        console.log(`Adding character to map: ${characterType}`);
        
        // Find active map
        const activeMap = document.querySelector('.game-map.active');
        if (activeMap) {
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
        } else {
            showNotification('No active map found! Please select a map.');
        }
    }
    
    // Reset map (remove all character markers)
    function resetMap() {
        console.log('Resetting map');
        
        // Find active map
        const activeMap = document.querySelector('.game-map.active');
        if (activeMap) {
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
        } else {
            showNotification('No active map found! Please select a map.');
        }
    }
    
    // Simple notification function
    function showNotification(message) {
        console.log(`Notification: ${message}`);
        
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
    
    // Make these functions available globally
    window.showNotification = showNotification;
    window.addCharacterToMap = addCharacterToMap;
    window.resetMap = resetMap;
    window.makeMarkerDraggable = makeMarkerDraggable;
    window.showCharacterSelection = showCharacterSelection;
    
    // Add listener for fullscreen toggle to ensure buttons stay functional
    document.getElementById('fullscreenBtn')?.addEventListener('click', function() {
        // Re-initialize buttons after entering fullscreen to ensure they work
        setTimeout(attachButtonHandlers, 300);
    });
    
    // Also add a window load handler for additional button setup
    window.addEventListener('load', function() {
        console.log('Window load - reinitializing map buttons');
        attachButtonHandlers();
    });
});
