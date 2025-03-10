document.addEventListener('DOMContentLoaded', () => {
    console.log("Navigation script loaded");
    
    // Get all navigation links and pages
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    const pages = document.querySelectorAll('.page');
    const ctaButton = document.querySelector('.cta-button[data-target]');
    
    // Function to show a specific page
    function showPage(pageId) {
        console.log(`Showing page: ${pageId}`);
        
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        // Special handling for map page to ensure proper sizing
        if (pageId === 'map') {
            setTimeout(() => {
                const event = new Event('resize');
                window.dispatchEvent(event);
            }, 100);
        }
    }
    
    // Make the showPage function globally available
    window.showPage = showPage;
    
    // Add click event to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    // Add click event to CTA button on home page
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const targetPage = ctaButton.getAttribute('data-target');
            showPage(targetPage);
        });
    }
    
    // Add events for "View Map" buttons
    const viewMapButtons = document.querySelectorAll('.view-map-btn');
    viewMapButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            
            // Get target map
            const mapId = btn.getAttribute('data-map');
            
            // Switch to map page
            showPage('map');
            
            // Select the appropriate map tab
            setTimeout(() => {
                const mapTab = document.querySelector(`.map-tab[data-map="${mapId}"]`);
                if (mapTab) {
                    mapTab.click();
                }
                
                // Resize the map
                window.dispatchEvent(new Event('resize'));
            }, 200);
            
            // Close modal if we're in one
            const modal = btn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Handle map tabs
    const mapTabs = document.querySelectorAll('.map-tab');
    mapTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            mapTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all maps
            document.querySelectorAll('.game-map').forEach(map => {
                map.classList.remove('active');
            });
            
            // Show the selected map
            const mapId = tab.getAttribute('data-map');
            const targetMap = document.getElementById(`${mapId}-map`);
            if (targetMap) {
                targetMap.classList.add('active');
            }
        });
    });
    
    // Add character to map functionality
    const addToMapBtns = document.querySelectorAll('.add-to-map-btn');
    addToMapBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const characterType = btn.getAttribute('data-character');
            
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
                
                // Dispatch event for the map script to add drag functionality
                const event = new CustomEvent('newMarkerAdded', { detail: { marker } });
                document.dispatchEvent(event);
                
                // Switch to map page
                showPage('map');
            } else {
                alert('Please select a map first!');
                
                // Switch to map page first
                showPage('map');
            }
        });
    });
    
    // Reset map button
    const resetMapBtn = document.querySelector('.reset-map-btn');
    if (resetMapBtn) {
        resetMapBtn.addEventListener('click', () => {
            // Find active map and remove custom character markers
            const activeMap = document.querySelector('.game-map.active');
            if (activeMap) {
                const customMarkers = activeMap.querySelectorAll('.character-marker:not([data-character="player1"])');
                customMarkers.forEach(marker => marker.remove());
                
                // Reset default markers to original position
                const defaultMarkers = activeMap.querySelectorAll('.character-marker[data-character="player1"]');
                defaultMarkers.forEach(marker => {
                    marker.style.left = '50%';
                    marker.style.top = '50%';
                });
            }
        });
    }
    
    // Make character markers draggable
    function makeMarkerDraggable(marker) {
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
            
            // Calculate offset
            const rect = marker.getBoundingClientRect();
            offsetX = clientX - rect.left - rect.width / 2;
            offsetY = clientY - rect.top - rect.height / 2;
            
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
            const posX = (clientX - offsetX - mapRect.left) / mapRect.width * 100;
            const posY = (clientY - offsetY - mapRect.top) / mapRect.height * 100;
            
            // Limit to map boundaries
            const limitedX = Math.min(Math.max(posX, 0), 100);
            const limitedY = Math.min(Math.max(posY, 0), 100);
            
            // Update marker position
            marker.style.left = `${limitedX}%`;
            marker.style.top = `${limitedY}%`;
        }
        
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }
    }
    
    // Initialize draggable for existing markers
    document.querySelectorAll('.character-marker.draggable').forEach(marker => {
        makeMarkerDraggable(marker);
    });
    
    // Fix location markers positioning
    document.querySelectorAll('.location-marker').forEach(marker => {
        if (!marker.style.left) {
            // Position locations randomly if not positioned already
            const randX = 20 + Math.random() * 60; // Between 20% and 80%
            const randY = 20 + Math.random() * 60;
            marker.style.left = `${randX}%`;
            marker.style.top = `${randY}%`;
        }
    });
    
    // Make all story cards visible immediately
    document.querySelectorAll('.story-card, .character-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // Show the active page on load (or default to home)
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const pageId = activePage.id;
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
    }
});
