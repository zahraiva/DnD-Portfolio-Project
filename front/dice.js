document.addEventListener('DOMContentLoaded', function() {
    console.log("Dice script loaded");
    
    // Create the dice container and elements
    initializeDice();
    
    // Keep track of dice roll history
    const rollHistory = [];
    const maxHistoryItems = 10;
    
    // Function to initialize the dice UI
    function initializeDice() {
        // Only initialize if we're on the map page and the dice doesn't exist yet
        const mapPage = document.getElementById('map');
        if (!mapPage || document.querySelector('.dice-container')) return;
        
        // Create dice container
        const diceContainer = document.createElement('div');
        diceContainer.className = 'dice-container';
        diceContainer.setAttribute('title', 'Click to roll');
        
        // Add tooltip
        const diceTooltip = document.createElement('div');
        diceTooltip.className = 'dice-tooltip';
        diceTooltip.textContent = 'Click to roll D20';
        diceContainer.appendChild(diceTooltip);
        
        // Create the 3D dice
        const dice = document.createElement('div');
        dice.className = 'dice';
        
        // Create 20 faces for the D20
        for (let i = 1; i <= 20; i++) {
            const face = document.createElement('div');
            face.className = 'dice-face';
            face.textContent = i;
            dice.appendChild(face);
        }
        
        diceContainer.appendChild(dice);
        
        // Create dice result display
        const diceResult = document.createElement('div');
        diceResult.className = 'dice-result';
        diceResult.innerHTML = '<div id="rollValue">20</div><span>Roll result</span>';
        
        // Create dice history button
        const historyBtn = document.createElement('div');
        historyBtn.className = 'dice-history-btn';
        historyBtn.innerHTML = '<i class="fas fa-history"></i>';
        historyBtn.setAttribute('title', 'View roll history');
        
        // Create dice history panel
        const historyPanel = document.createElement('div');
        historyPanel.className = 'dice-history-panel';
        historyPanel.innerHTML = `
            <h4>Roll History</h4>
            <ul class="dice-history-list"></ul>
        `;
        
        // Add all elements to the map container
        const mapContainer = mapPage.querySelector('.map-container');
        mapContainer.appendChild(diceContainer);
        mapContainer.appendChild(diceResult);
        mapContainer.appendChild(historyBtn);
        mapContainer.appendChild(historyPanel);
        
        // Add event listener for rolling the dice
        diceContainer.addEventListener('click', rollDice);
        
        // Add event listener for history button
        historyBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            historyPanel.classList.toggle('show');
        });
        
        // Close history panel when clicking outside
        document.addEventListener('click', function(e) {
            if (!historyBtn.contains(e.target) && !historyPanel.contains(e.target)) {
                historyPanel.classList.remove('show');
            }
        });
    }
    
    // Function to roll the dice
    function rollDice() {
        const dice = document.querySelector('.dice');
        const diceResult = document.querySelector('.dice-result');
        
        if (dice.classList.contains('dice-rolling')) {
            return; // Don't allow rolling while animation is in progress
        }
        
        // Hide the previous result
        diceResult.classList.remove('show');
        
        // Generate random dice rotations
        const randomRotationX = Math.floor(Math.random() * 10) * 360 + Math.floor(Math.random() * 360);
        const randomRotationY = Math.floor(Math.random() * 10) * 360 + Math.floor(Math.random() * 360);
        const randomRotationZ = Math.floor(Math.random() * 10) * 360 + Math.floor(Math.random() * 360);
        
        // Apply the "rolling" animation class
        dice.classList.add('dice-rolling');
        
        // Generate a random D20 result
        const result = Math.floor(Math.random() * 20) + 1;
        
        // After animation completes, show the result
        setTimeout(() => {
            // Update roll history
            addToHistory(result);
            
            // Update the dice result display
            const rollValue = document.getElementById('rollValue');
            rollValue.textContent = result;
            rollValue.className = '';
            
            // Add special styling for critical success (20) or fail (1)
            if (result === 20) {
                rollValue.classList.add('dice-critical', 'success');
                showNotification('Critical success!', 'success');
            } else if (result === 1) {
                rollValue.classList.add('dice-critical', 'fail');
                showNotification('Critical fail!', 'error');
            }
            
            // Remove rolling class and set to final rotation
            dice.classList.remove('dice-rolling');
            dice.style.transform = `rotateX(${randomRotationX}deg) rotateY(${randomRotationY}deg) rotateZ(${randomRotationZ}deg)`;
            
            // Show the result
            diceResult.classList.add('show');
            
            // Hide result after 3 seconds
            setTimeout(() => {
                diceResult.classList.remove('show');
            }, 3000);
            
        }, 2000); // Match this to the animation duration
    }
    
    // Function to add roll to history
    function addToHistory(result) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        rollHistory.unshift({
            result: result,
            time: timeString
        });
        
        // Limit history size
        if (rollHistory.length > maxHistoryItems) {
            rollHistory.pop();
        }
        
        updateHistoryDisplay();
    }
    
    // Function to update history display
    function updateHistoryDisplay() {
        const historyList = document.querySelector('.dice-history-list');
        if (!historyList) return;
        
        historyList.innerHTML = '';
        
        if (rollHistory.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = 'No rolls yet';
            emptyItem.style.textAlign = 'center';
            emptyItem.style.fontStyle = 'italic';
            emptyItem.style.color = 'rgba(232, 245, 233, 0.6)';
            historyList.appendChild(emptyItem);
            return;
        }
        
        rollHistory.forEach(roll => {
            const item = document.createElement('li');
            item.className = 'dice-history-item';
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'roll-time';
            timeSpan.textContent = roll.time;
            
            const resultSpan = document.createElement('span');
            resultSpan.className = 'roll-result';
            resultSpan.textContent = roll.result;
            
            // Highlight critical rolls in history
            if (roll.result === 20) {
                resultSpan.style.color = '#72be99';
            } else if (roll.result === 1) {
                resultSpan.style.color = '#e74c3c';
            }
            
            item.appendChild(timeSpan);
            item.appendChild(resultSpan);
            historyList.appendChild(item);
        });
    }
    
    // Function to show notification
    function showNotification(message, type = 'info') {
        // Use the existing showNotification function if available
        if (window.showNotification) {
            window.showNotification(message, type);
            return;
        }
        
        // Fallback notification if the global one isn't available
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Initialize dice when navigating to the map page
    window.addEventListener('pageChanged', function(e) {
        if (e.detail && e.detail.pageId === 'map') {
            initializeDice();
        }
    });
    
    // Initialize dice on load if we're already on the map page
    if (document.getElementById('map').classList.contains('active')) {
        initializeDice();
    }
    
    // Make the function available globally
    window.rollDice = rollDice;
    window.initializeDice = initializeDice;
});
