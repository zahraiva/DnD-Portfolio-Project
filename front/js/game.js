document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded');
  
    // Modal functionality
    const createGameBtn = document.getElementById('createGameBtn');
    const myGamesBtn = document.getElementById('myGamesBtn');
    const createGameModal = document.getElementById('createGameModal');
    const myGamesModal = document.getElementById('myGamesModal');
    const characterDetailsModal = document.getElementById('characterDetailsModal');
    const closeButtons = document.querySelectorAll('.close');
    const addCharacterBtn = document.getElementById('addCharacterBtn');
    const charactersList = document.getElementById('charactersList');
    const addItemBtn = document.getElementById('addItemBtn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
  
    console.log('Create Game Button:', createGameBtn);
    console.log('Create Game Modal:', createGameModal);
  
    // Open Create Game modal
    createGameBtn.addEventListener('click', () => {
        createGameModal.style.display = 'block';
    });
    
    // Open My Games modal
    myGamesBtn.addEventListener('click', () => {
        myGamesModal.style.display = 'block';
        displayGames(); // Refresh games list
    });
    
    // Close modals when clicking the X button
    closeButtons.forEach(button => {
        button.onclick = function() {
            createGameModal.style.display = 'none';
            myGamesModal.style.display = 'none';
            characterDetailsModal.style.display = 'none';
        }
    });
    
    // Close modals when clicking outside
    window.onclick = (event) => {
        if (event.target === createGameModal) {
            createGameModal.style.display = 'none';
        }
        if (event.target === myGamesModal) {
            myGamesModal.style.display = 'none';
        }
        if (event.target === characterDetailsModal) {
            characterDetailsModal.style.display = 'none';
        }
    }
  
    // FIXED: Add Character button functionality
    if (addCharacterBtn) {
        // Remove existing listener by cloning and replacing
        const newBtn = addCharacterBtn.cloneNode(true);
        addCharacterBtn.parentNode.replaceChild(newBtn, addCharacterBtn);
        
        // Add new clean event listener
        newBtn.addEventListener('click', function() {
            const firstCharacter = charactersList.querySelector('.character-entry');
            if (!firstCharacter) return;
            
            // Clone the first character entry exactly
            const newCharacter = firstCharacter.cloneNode(true);
            
            // Reset form fields
            newCharacter.querySelectorAll('input').forEach(input => {
                input.value = '';
            });
            
            newCharacter.querySelectorAll('select').forEach(select => {
                select.selectedIndex = 0;
            });
            
            // Remove any status badges
            newCharacter.querySelectorAll('.skills-status, .items-status').forEach(badge => {
                badge.remove();
            });
            
            // Reset data attributes
            newCharacter.removeAttribute('data-skills');
            newCharacter.removeAttribute('data-items');
            
            // Add the new character to the list
            charactersList.appendChild(newCharacter);
            
            // Setup Add Skills button
            const skillsBtn = newCharacter.querySelector('.add-details-btn');
            if (skillsBtn) {
                skillsBtn.onclick = function(e) {
                    e.preventDefault();
                    window._currentSkillsCharacter = newCharacter;
                    
                    const modal = document.getElementById('characterDetailsModal');
                    const textarea = document.getElementById('skillsTextarea');
                    
                    if (modal && textarea) {
                        textarea.value = '';
                        if (window.updateSkillsPreview) window.updateSkillsPreview();
                        modal.style.display = 'block';
                    }
                };
            }
            
            // Setup Add Items button
            const itemsBtn = newCharacter.querySelector('.add-items-btn');
            if (itemsBtn) {
                itemsBtn.onclick = function(e) {
                    e.preventDefault();
                    window._currentItemsCharacter = newCharacter;
                    
                    const modal = document.getElementById('characterItemsModal');
                    const textarea = document.getElementById('itemsTextarea');
                    
                    if (modal && textarea) {
                        textarea.value = '';
                        if (window.updateItemsPreview) window.updateItemsPreview();
                        modal.style.display = 'block';
                    }
                };
            }
            
            // Show notification if available
            if (window.showNotification) {
                window.showNotification('New character added');
            }
            
            // Scroll to the new character
            setTimeout(() => {
                newCharacter.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);

            // Add this line to ensure buttons work immediately:
            fixExistingButtons();
        });
    }
    
    // FIXED: Setup preview functionality for skills and items
    function setupPreviewFunctions() {
        // Setup skills preview function
        window.updateSkillsPreview = function() {
            const preview = document.getElementById('skillsPreview');
            const textarea = document.getElementById('skillsTextarea');
            
            if (!preview || !textarea) return;
            
            // Clear preview
            preview.innerHTML = '';
            
            // Get skills from textarea
            const skillsText = textarea.value;
            const skills = skillsText.split('\n')
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);
            
            if (skills.length === 0) {
                preview.innerHTML = '<p class="no-skills">No skills added yet</p>';
                return;
            }
            
            // Add skills to preview
            skills.forEach(skill => {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                skillItem.textContent = skill;
                preview.appendChild(skillItem);
            });
        };
        
        // Setup items preview function
        window.updateItemsPreview = function() {
            const preview = document.getElementById('itemsPreview');
            const textarea = document.getElementById('itemsTextarea');
            
            if (!preview || !textarea) return;
            
            // Clear preview
            preview.innerHTML = '';
            
            // Get items from textarea
            const itemsText = textarea.value;
            const items = itemsText.split('\n')
                .map(item => item.trim())
                .filter(item => item.length > 0);
            
            if (items.length === 0) {
                preview.innerHTML = '<p class="no-items">No items added yet</p>';
                return;
            }
            
            // Add items to preview
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item-element';
                itemElement.textContent = item;
                preview.appendChild(itemElement);
            });
        };
        
        // Add event listeners to textareas
        const skillsTextarea = document.getElementById('skillsTextarea');
        if (skillsTextarea) {
            skillsTextarea.addEventListener('input', window.updateSkillsPreview);
        }
        
        const itemsTextarea = document.getElementById('itemsTextarea');
        if (itemsTextarea) {
            itemsTextarea.addEventListener('input', window.updateItemsPreview);
        }
        
        // Set up save skills button
        const saveSkillsBtn = document.getElementById('saveSkillsBtn');
        if (saveSkillsBtn) {
            saveSkillsBtn.onclick = function() {
                if (!window._currentSkillsCharacter) return;
                
                const textarea = document.getElementById('skillsTextarea');
                if (!textarea) return;
                
                // Save skills to character
                const skills = textarea.value;
                window._currentSkillsCharacter.setAttribute('data-skills', skills);
                
                // Count skills
                const skillCount = skills.split('\n').filter(s => s.trim()).length;
                
                // Update visual badge
                const oldStatus = window._currentSkillsCharacter.querySelector('.skills-status');
                if (oldStatus) oldStatus.remove();
                
                if (skillCount > 0) {
                    const status = document.createElement('span');
                    status.className = 'skills-status';
                    status.title = 'Click to view skills';
                    status.innerHTML = `<i class="fas fa-check-circle"></i> ${skillCount} skill${skillCount !== 1 ? 's' : ''}`;
                    window._currentSkillsCharacter.appendChild(status);
                }
                
                // Close modal
                characterDetailsModal.style.display = 'none';
                
                // Show notification
                if (window.showNotification) {
                    window.showNotification('Skills saved successfully!');
                }
            };
        }
        
        // Set up save items button
        const saveItemsBtn = document.getElementById('saveItemsBtn');
        if (saveItemsBtn) {
            saveItemsBtn.onclick = function() {
                if (!window._currentItemsCharacter) return;
                
                const textarea = document.getElementById('itemsTextarea');
                if (!textarea) return;
                
                // Save items to character
                const items = textarea.value;
                window._currentItemsCharacter.setAttribute('data-items', items);
                
                // Count items
                const itemCount = items.split('\n').filter(i => i.trim()).length;
                
                // Update visual badge
                const oldStatus = window._currentItemsCharacter.querySelector('.items-status');
                if (oldStatus) oldStatus.remove();
                
                if (itemCount > 0) {
                    const status = document.createElement('span');
                    status.className = 'items-status';
                    status.title = 'Click to view items';
                    // Fix: Use a standard Font Awesome icon instead of fa-backpack which might not exist
                    status.innerHTML = `<i class="fas fa-box"></i> ${itemCount} item${itemCount !== 1 ? 's' : ''}`;
                    window._currentItemsCharacter.appendChild(status);
                }
                
                // This line is critical - make sure the modal is closed properly
                const itemsModal = document.getElementById('characterItemsModal');
                if (itemsModal) {
                    itemsModal.style.display = 'none';
                }
                
                // Show notification
                if (window.showNotification) {
                    window.showNotification('Items saved successfully!');
                }
            };
        }
    }
    
    // Setup notification function
    window.showNotification = function(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };
    
    // Fix the add-details-btn (skills) and add-items-btn functionality for existing buttons
    function fixExistingButtons() {
        // Fix skills buttons (add-details-btn)
        document.querySelectorAll('.add-details-btn').forEach(btn => {
            // Clone to remove existing listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const characterEntry = this.closest('.character-entry');
                if (!characterEntry) return;
                
                window._currentSkillsCharacter = characterEntry;
                
                const modal = document.getElementById('characterDetailsModal');
                const textarea = document.getElementById('skillsTextarea');
                
                if (modal && textarea) {
                    textarea.value = characterEntry.getAttribute('data-skills') || '';
                    if (window.updateSkillsPreview) window.updateSkillsPreview();
                    modal.style.display = 'block';
                }
            });
        });
        
        // Fix items buttons (add-items-btn)
        document.querySelectorAll('.add-items-btn').forEach(btn => {
            // Make button more visible
            btn.style.background = 'rgba(82, 121, 177, 0.15)';
            btn.style.borderColor = 'rgba(82, 121, 177, 0.5)';
            
            // Clone to remove existing listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const characterEntry = this.closest('.character-entry');
                if (!characterEntry) return;
                
                window._currentItemsCharacter = characterEntry;
                
                const modal = document.getElementById('characterItemsModal');
                const textarea = document.getElementById('itemsTextarea');
                
                if (modal && textarea) {
                    textarea.value = characterEntry.getAttribute('data-items') || '';
                    if (window.updateItemsPreview) window.updateItemsPreview();
                    modal.style.display = 'block';
                }
            });
        });
        
        // Call the function to fix existing items badges
        fixItemsBadgeIcon();
    }

    // Call the fixExistingButtons function right after DOM is loaded
    fixExistingButtons();

    // Set up preview functions
    setupPreviewFunctions();
  
    // Rest of the original game.js code
    
    // Tab switching in character details modal
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Remove active class from all buttons
          tabButtons.forEach(btn => btn.classList.remove('active'));
          // Add active class to clicked button
          button.classList.add('active');
    
          // Hide all tab contents
          tabContents.forEach(content => content.style.display = 'none');
          // Show selected tab content
          const tabId = button.getAttribute('data-tab') + 'Tab';
          document.getElementById(tabId).style.display = 'block';
      });
    });
    
    // Add new inventory item
    if (addItemBtn) {
        addItemBtn.onclick = () => {
          const inventoryList = document.querySelector('.inventory-list');
          const itemEntry = document.createElement('div');
          itemEntry.className = 'inventory-item';
          itemEntry.innerHTML = `
              <input type="text" placeholder="Item Name">
              <input type="number" placeholder="Quantity" min="1">
              <button type="button" class="remove-item">×</button>
          `;
          inventoryList.appendChild(itemEntry);
        
          // Add event listener to remove item button
          const removeBtn = itemEntry.querySelector('.remove-item');
          removeBtn.onclick = () => itemEntry.remove();
        }
    }
    
    // Store games in localStorage for demo purposes
    let games = JSON.parse(localStorage.getItem('dndGames')) || [];
    
    // Function to save games to localStorage
    const saveGames = () => {
      localStorage.setItem('dndGames', JSON.stringify(games));
    };
    
    // Function to create a game card
    const createGameCard = (game) => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `
          <h3>${game.name}</h3>
          <p>${game.description}</p>
          <div class="game-info">
              <div class="game-info-item">
                  <i class="fas fa-users"></i>
                  <span>${game.characters.length} Characters</span>
              </div>
              <div class="game-info-item">
                  <i class="fas fa-map-marked-alt"></i>
                  <span>${game.map}</span>
              </div>
              <div class="game-info-item">
                  <i class="fas fa-book-open"></i>
                  <span>${game.story}</span>
              </div>
              <div class="game-info-item">
                  <i class="fas fa-calendar-alt"></i>
                  <span>${new Date(game.created).toLocaleDateString()}</span>
              </div>
          </div>
          <div class="game-actions">
              <button class="game-action-btn edit">Edit Game</button>
              <button class="game-action-btn delete">Delete Game</button>
          </div>
      `;
    
      // Add event listeners for edit and delete buttons
      const editBtn = card.querySelector('.edit');
      const deleteBtn = card.querySelector('.delete');
    
      editBtn.onclick = (e) => {
          e.stopPropagation();
          // TODO: Implement edit functionality
          alert('Edit functionality coming soon!');
      };
    
      deleteBtn.onclick = (e) => {
          e.stopPropagation();
          if (confirm('Are you sure you want to delete this game?')) {
              games = games.filter(g => g.id !== game.id);
              saveGames();
              displayGames();
          }
      };
    
      return card;
    };
    
    // Function to display all games
    const displayGames = () => {
      const gamesGrid = document.getElementById('gamesGrid');
      if (!gamesGrid) return;
      
      gamesGrid.innerHTML = '';
    
      if (games.length === 0) {
          gamesGrid.innerHTML = `
              <div class="no-games">
                  <i class="fas fa-dice-d20"></i>
                  <p>No games created yet. Click the "Create Game" button to start your adventure!</p>
              </div>
          `;
          return;
      }
    
      games.forEach(game => {
          gamesGrid.appendChild(createGameCard(game));
      });
    };
    
    // Form submission
    const createGameForm = document.getElementById('createGameForm');
    if (createGameForm) {
        createGameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            
            // Get characters data with skills and items
            const characters = Array.from(document.querySelectorAll('.character-entry')).map(entry => {
                // Only include characters that have a name or class selected
                const name = entry.querySelector('input[name="characterName"]').value;
                const characterClass = entry.querySelector('select[name="characterClass"]').value;
                
                // If both name and class are empty, skip this character
                if (!name && !characterClass) return null;
                
                return {
                    name: name,
                    class: characterClass,
                    skills: entry.getAttribute('data-skills') || '',
                    items: entry.getAttribute('data-items') || ''
                };
            }).filter(char => char !== null); // Remove null entries
            
            // Create new game object
            const newGame = {
                id: Date.now(),
                name: form.elements['gameName'].value,
                description: form.elements['gameDescription'].value,
                characters: characters,
                story: document.getElementById('storySelect').value,
                map: document.getElementById('mapSelect')?.value || 'barovia',
                created: new Date().toISOString()
            };
            
            // Load existing games
            let games = [];
            try {
                games = JSON.parse(localStorage.getItem('dndGames')) || [];
            } catch (e) {
                console.error('Error loading games:', e);
            }
            
            // Add new game
            games.push(newGame);
            
            // Save to localStorage
            localStorage.setItem('dndGames', JSON.stringify(games));
            
            // Show success notification
            if (window.showNotification) {
                window.showNotification('Game created successfully!');
            }
            
            // Close modal
            createGameModal.style.display = 'none';
            
            // Reset form
            form.reset();
            
            // If we're showing saved games, update the display
            if (myGamesModal && myGamesModal.style.display === 'block') {
                // If saved-games.js is loaded and has a function to display games
                if (typeof displaySavedGames === 'function') {
                    displaySavedGames();
                }
            }
        });
    }
    
    // Display games when page loads
    displayGames();
    
    // Fix the close buttons for all modals including character items modal
    const allCloseButtons = document.querySelectorAll('.modal .close');
    allCloseButtons.forEach(button => {
        // Remove existing event listeners by replacing with clone
        const newCloseBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newCloseBtn, button);
        
        // Add new event listener
        newCloseBtn.addEventListener('click', function() {
            // Find the parent modal
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Add ESC key listener to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close all visible modals
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
    
    // Make sure the character items modal can be closed by clicking outside
    window.addEventListener('click', function(e) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Setup viewers for skills and items badges
    setupViewerForSkillsAndItems();
});

// Add this function to fix the items icon display issue
function fixItemsBadgeIcon() {
    // Find all items status badges and fix their icons
    document.querySelectorAll('.items-status').forEach(badge => {
        // Check if icon is missing or incorrect
        const iconElement = badge.querySelector('i');
        if (!iconElement || !iconElement.classList.contains('fas')) {
            // Clear the badge content
            badge.innerHTML = '';
            
            // Get the count from the badge's text content
            const text = badge.textContent || '';
            const countMatch = text.match(/(\d+)\s+item/);
            const count = countMatch ? parseInt(countMatch[1]) : 0;
            
            // Add proper icon and text
            badge.innerHTML = `<i class="fas fa-box"></i> ${count} item${count !== 1 ? 's' : ''}`;
        }
    });
}

// Add this function to make status badges clickable to view the skills and items
function setupViewerForSkillsAndItems() {
    // Setup click events for skill and item badges that will be created at any point
    document.addEventListener('click', function(e) {
        // Check if the clicked element is a skills status badge
        if (e.target.closest('.skills-status')) {
            const characterEntry = e.target.closest('.character-entry');
            if (!characterEntry) return;
            
            const skills = characterEntry.getAttribute('data-skills');
            if (!skills) return;
            
            // Show skills in a modal or tooltip
            showSkillsViewer(skills, e.target.closest('.skills-status'));
        }
        
        // Check if the clicked element is an items status badge
        if (e.target.closest('.items-status')) {
            const characterEntry = e.target.closest('.character-entry');
            if (!characterEntry) return;
            
            const items = characterEntry.getAttribute('data-items');
            if (!items) return;
            
            // Show items in a modal or tooltip
            showItemsViewer(items, e.target.closest('.items-status'));
        }
    });
    
    // Function to create and show a skills tooltip/popup
    function showSkillsViewer(skillsText, targetElement) {
        // Remove any existing viewer
        removeExistingViewers();
        
        // Create viewer
        const viewer = document.createElement('div');
        viewer.className = 'content-viewer skills-viewer';
        
        const skills = skillsText.split('\n').filter(s => s.trim());
        
        let content = `
            <div class="viewer-header">
                <h3>Character Skills</h3>
                <button class="close-viewer">&times;</button>
            </div>
            <div class="viewer-content">
        `;
        
        if (skills.length === 0) {
            content += '<p class="no-items">No skills added yet</p>';
        } else {
            content += '<ul class="viewer-list">';
            skills.forEach(skill => {
                content += `<li><i class="fas fa-check-circle"></i> ${skill}</li>`;
            });
            content += '</ul>';
        }
        
        content += '</div>';
        viewer.innerHTML = content;
        
        // Position near the badge that was clicked
        document.body.appendChild(viewer);
        positionViewer(viewer, targetElement);
        
        // Add close button event
        viewer.querySelector('.close-viewer').addEventListener('click', function() {
            viewer.remove();
        });
        
        // Close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeViewerOnClickOutside);
        }, 10);
        
        function closeViewerOnClickOutside(e) {
            if (!viewer.contains(e.target) && e.target !== targetElement && !targetElement.contains(e.target)) {
                viewer.remove();
                document.removeEventListener('click', closeViewerOnClickOutside);
            }
        }
    }
    
    // Function to create and show an items tooltip/popup
    function showItemsViewer(itemsText, targetElement) {
        // Remove any existing viewer
        removeExistingViewers();
        
        // Create viewer
        const viewer = document.createElement('div');
        viewer.className = 'content-viewer items-viewer';
        
        const items = itemsText.split('\n').filter(i => i.trim());
        
        let content = `
            <div class="viewer-header">
                <h3>Character Items</h3>
                <button class="close-viewer">&times;</button>
            </div>
            <div class="viewer-content">
        `;
        
        if (items.length === 0) {
            content += '<p class="no-items">No items added yet</p>';
        } else {
            content += '<ul class="viewer-list">';
            items.forEach(item => {
                content += `<li><i class="fas fa-box"></i> ${item}</li>`;
            });
            content += '</ul>';
        }
        
        content += '</div>';
        viewer.innerHTML = content;
        
        // Position near the badge that was clicked
        document.body.appendChild(viewer);
        positionViewer(viewer, targetElement);
        
        // Add close button event
        viewer.querySelector('.close-viewer').addEventListener('click', function() {
            viewer.remove();
        });
        
        // Close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeViewerOnClickOutside);
        }, 10);
        
        function closeViewerOnClickOutside(e) {
            if (!viewer.contains(e.target) && e.target !== targetElement && !targetElement.contains(e.target)) {
                viewer.remove();
                document.removeEventListener('click', closeViewerOnClickOutside);
            }
        }
    }
    
    // Helper to position viewer relative to the target
    function positionViewer(viewer, target) {
        const targetRect = target.getBoundingClientRect();
        const viewerRect = viewer.getBoundingClientRect();
        
        // Set initial position
        let top = targetRect.bottom + window.scrollY + 5;
        let left = targetRect.left + window.scrollX;
        
        // Check if it would go off the right edge
        if (left + viewerRect.width > window.innerWidth) {
            left = window.innerWidth - viewerRect.width - 10;
        }
        
        // Check if it would go off the bottom edge
        if (top + viewerRect.height > window.innerHeight + window.scrollY) {
            top = targetRect.top + window.scrollY - viewerRect.height - 5;
        }
        
        viewer.style.top = `${top}px`;
        viewer.style.left = `${left}px`;
    }
    
    // Remove any existing viewers
    function removeExistingViewers() {
        document.querySelectorAll('.content-viewer').forEach(viewer => {
            viewer.remove();
        });
    }
    
    // Close viewers when pressing ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            removeExistingViewers();
        }
    });
}

// Call this at the end of your DOMContentLoaded event handler
fixItemsBadgeIcon();
