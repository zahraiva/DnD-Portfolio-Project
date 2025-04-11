/**
 * Utility function to make character markers draggable on the map
 */
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
            e.stopPropagation();
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
            e.stopPropagation();
            
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
    
    console.log(`Made ${markers.length} markers draggable`);
}

// Make function available globally
window.makeMarkersDraggable = makeMarkersDraggable;

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize draggable on any existing markers
    makeMarkersDraggable();
    
    // Listen for new markers being added
    document.addEventListener('newMarkerAdded', function() {
        makeMarkersDraggable();
    });
    
    // Listen for page changes to reinitialize when on map page
    document.addEventListener('pageChanged', function(e) {
        if (e.detail && e.detail.pageId === 'map') {
            setTimeout(makeMarkersDraggable, 300);
        }
    });
});
