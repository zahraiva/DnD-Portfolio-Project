
// This script helps debug navigation issues
document.addEventListener('DOMContentLoaded', function() {
    console.log('Debug helper loaded');
    
    // 1. Add direct navigation buttons to quickly test navigation
    function addDebugControls() {
        const debugPanel = document.createElement('div');
        debugPanel.style.position = 'fixed';
        debugPanel.style.bottom = '10px';
        debugPanel.style.left = '10px';
        debugPanel.style.zIndex = '9999';
        debugPanel.style.background = 'rgba(0,0,0,0.7)';
        debugPanel.style.padding = '10px';
        debugPanel.style.borderRadius = '5px';
        
        debugPanel.innerHTML = `
            <div style="display:flex; gap:5px; font-size:12px; color:white;">
                <button id="debug-home">Home</button>
                <button id="debug-story">Story</button>
                <button id="debug-map">Map</button>
                <button id="debug-chars">Characters</button>
                <button id="debug-fix">Fix Navigation</button>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Add navigation handlers
        document.getElementById('debug-home').addEventListener('click', () => navigateTo('home'));
        document.getElementById('debug-story').addEventListener('click', () => navigateTo('story'));
        document.getElementById('debug-map').addEventListener('click', () => navigateTo('map'));
        document.getElementById('debug-chars').addEventListener('click', () => navigateTo('characters'));
        document.getElementById('debug-fix').addEventListener('click', fixNavigation);
    }
    
    // Direct navigation function that bypasses any existing logic
    function navigateTo(pageId) {
        console.log(`Debug navigation to: ${pageId}`);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });
        
        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
            console.log(`Page ${pageId} activated`);
        } else {
            console.error(`Page with ID '${pageId}' not found!`);
        }
        
        // Update nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
    }
    
    // Fix the navigation by repairing event listeners
    function fixNavigation() {
        console.log('Attempting to fix navigation');
        
        // Ensure map page exists and is correctly structured
        const mapPage = document.getElementById('map');
        if (!mapPage) {
            console.error('Map page not found!');
            return;
        }
        
        // Check that all map tabs have correct event listeners
        const mapTabs = document.querySelectorAll('.map-tab');
        mapTabs.forEach(tab => {
            // Remove old listeners by cloning
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            
            // Add new listener
            newTab.addEventListener('click', function() {
                console.log('Map tab clicked:', this.getAttribute('data-map'));
                
                // Manually handle tab behavior
                mapTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const mapId = this.getAttribute('data-map');
                document.querySelectorAll('.game-map').forEach(map => {
                    map.classList.remove('active');
                    map.style.display = 'none';
                });
                
                const targetMap = document.getElementById(`${mapId}-map`);
                if (targetMap) {
                    targetMap.classList.add('active');
                    targetMap.style.display = 'block';
                }
            });
        });
        
        // Fix navigation links
        document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
            // Remove old listeners by cloning
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            // Add new listener
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                const pageId = this.getAttribute('data-page');
                navigateTo(pageId);
            });
        });
        
        alert('Navigation fixed! Try clicking on a saved game now.');
    }
    
    // Add a global log interceptor to catch all errors
    const originalConsoleError = console.error;
    console.error = function(...args) {
        // Call original console.error
        originalConsoleError.apply(console, args);
        
        // Log to page for visibility
        const errorLog = document.getElementById('error-log') || createErrorLog();
        const error = document.createElement('div');
        error.textContent = args.join(' ');
        error.style.color = 'red';
        error.style.margin = '2px 0';
        errorLog.appendChild(error);
    };
    
    function createErrorLog() {
        const log = document.createElement('div');
        log.id = 'error-log';
        log.style.position = 'fixed';
        log.style.right = '10px';
        log.style.top = '70px';
        log.style.zIndex = '9999';
        log.style.background = 'rgba(0,0,0,0.7)';
        log.style.padding = '10px';
        log.style.borderRadius = '5px';
        log.style.maxHeight = '200px';
        log.style.overflow = 'auto';
        log.style.maxWidth = '400px';
        log.style.fontSize = '12px';
        document.body.appendChild(log);
        return log;
    }
    
    // Add debug controls after a short delay
    setTimeout(addDebugControls, 1000);
});
