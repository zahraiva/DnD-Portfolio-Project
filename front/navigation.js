document.addEventListener('DOMContentLoaded', () => {
    console.log("Navigation script loaded");
    
    // Get all navigation links and pages
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    const pages = document.querySelectorAll('.page');
    const ctaButton = document.querySelector('.cta-button[data-target]');
    
    // Function to show a specific page
    function showPage(pageId, options = {}) {
        console.log(`Showing page: ${pageId}`, options);
        
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
                
                // If a specific map is specified, select it
                if (options && options.mapId) {
                    selectMapTab(options.mapId);
                }
            }, 100);
        }
        
        // Dispatch custom event for page change
        const pageChangeEvent = new CustomEvent('pageChanged', {
            detail: { pageId, options }
        });
        document.dispatchEvent(pageChangeEvent);
    }
    
    // Helper function to select a specific map tab
    function selectMapTab(mapId) {
        if (!mapId) return;
        
        const mapTab = document.querySelector(`.map-tab[data-map="${mapId}"]`);
        if (mapTab) {
            console.log(`Selecting map tab: ${mapId}`);
            
            // Simulate a click on the map tab
            mapTab.click();
            
            // Additional handling to ensure the map is actually shown
            setTimeout(() => {
                // Hide all maps
                document.querySelectorAll('.game-map').forEach(map => {
                    map.classList.remove('active');
                });
                
                // Show the selected map
                const targetMap = document.getElementById(`${mapId}-map`);
                if (targetMap) {
                    targetMap.classList.add('active');
                    console.log(`Map activated: ${mapId}`);
                }
            }, 200);
        } else {
            console.warn(`Map tab not found for: ${mapId}`);
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
            
            // Switch to map page with specific map
            showPage('map', { mapId: mapId });
            
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
                
                // Show notification
                if (window.showNotification) {
                    window.showNotification(`${characterType.charAt(0).toUpperCase() + characterType.slice(1)} added to map!`);
                }
            } else {
                // Switch to map page first instead of showing alert
                showPage('map');
                
                // Show notification
                if (window.showNotification) {
                    window.showNotification('Please select a map first. Character will be added after you select a map.');
                }
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
    
    // Ensure the navigation function is available globally
    // Make navigation function available globally with more robust implementation
    window.showPage = function(pageId, options = {}) {
        console.log(`Navigating to page: ${pageId}`, options);
        
        // Remove active class from all links
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to the corresponding link
        const activeLink = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        // Show the selected page
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
            
            // Special handling for map page
            if (pageId === 'map' && options.mapId) {
                console.log(`Selecting map: ${options.mapId}`);
                
                // Slight delay to ensure page is visible first
                setTimeout(() => {
                    const mapTab = document.querySelector(`.map-tab[data-map="${options.mapId}"]`);
                    if (mapTab) {
                        // Manually trigger the map tab click
                        mapTab.click();
                    }
                }, 100);
            }
        }
    };

    // Handle fullscreen toggle for maps
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            const mapContainer = document.querySelector('.map-container');
            
            if (mapContainer.classList.contains('fullscreen')) {
                // Exit fullscreen
                mapContainer.classList.remove('fullscreen');
                this.innerHTML = '<i class="fas fa-expand"></i>';
                document.body.style.overflow = '';
            } else {
                // Enter fullscreen
                mapContainer.classList.add('fullscreen');
                this.innerHTML = '<i class="fas fa-compress"></i>';
                document.body.style.overflow = 'hidden';
            }
            
            // Trigger resize event to adjust map container
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        });
    }
    
    // Escape key to exit fullscreen map
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mapContainer = document.querySelector('.map-container.fullscreen');
            if (mapContainer) {
                mapContainer.classList.remove('fullscreen');
                document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-expand"></i>';
                document.body.style.overflow = '';
                
                // Trigger resize event to adjust map container
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 100);
            }
        }
    });

    // Update login/logout button based on authentication status
    updateLoginButton();
    
    // If there's a URL hash, navigate to that section
    if (window.location.hash) {
        const targetPage = window.location.hash.substring(1);
        const targetLink = document.querySelector(`.nav-links a[data-page="${targetPage}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
    
    // Expose the selectMapTab function globally
    window.selectMapTab = selectMapTab;
});

// Function to update login button based on authentication status
function updateLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;
    
    // Check if the auth functions are available
    if (typeof isUserLoggedIn === 'function' && typeof getCurrentUser === 'function' && 
        typeof logoutUser === 'function') {
        
        if (isUserLoggedIn()) {
            const currentUser = getCurrentUser();
            loginBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout (${currentUser.username})`;
            loginBtn.href = "#";
            
            // Remove any existing click event listeners
            const newLoginBtn = loginBtn.cloneNode(true);
            loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn);
            
            // Add logout functionality
            newLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logoutUser();
                console.log("User logged out, reloading page");
                window.location.reload();
            });
        } else {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            loginBtn.href = "index.html";
        }
    }
}
