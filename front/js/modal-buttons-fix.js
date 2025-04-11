/**
 * Fix for modal buttons in character creation
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("Modal buttons fix script loaded");

    // Initialize modals for skills and items
    initializeModals();

    // Fix Add Character button
    fixAddCharacterButton();

    // Fix existing character buttons
    fixExistingCharacterButtons();

    // Add event listener to handle dynamically added buttons
    document.addEventListener('characterAdded', function() {
        fixExistingCharacterButtons();
    });

    // Observer for DOM mutations to handle dynamically added character entries
    const charactersList = document.getElementById('charactersList');
    if (charactersList) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // New nodes were added, check if any are character entries
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList.contains('character-entry')) {
                            attachButtonEvents(node);
                        }
                    });
                }
            });
        });

        // Start observing
        observer.observe(charactersList, { childList: true });
    }

    // Initialize modal functionality
    function initializeModals() {
        // Character Details Modal (Skills)
        const characterDetailsModal = document.getElementById('characterDetailsModal');
        const skillsTextarea = document.getElementById('skillsTextarea');
        const skillsPreview = document.getElementById('skillsPreview');
        const saveSkillsBtn = document.getElementById('saveSkillsBtn');

        if (skillsTextarea) {
            skillsTextarea.addEventListener('input', function() {
                updateSkillsPreview();
            });
        }

        if (saveSkillsBtn) {
            saveSkillsBtn.addEventListener('click', function() {
                saveSkills();
            });
        }

        // Character Items Modal
        const characterItemsModal = document.getElementById('characterItemsModal');
        const itemsTextarea = document.getElementById('itemsTextarea');
        const itemsPreview = document.getElementById('itemsPreview');
        const saveItemsBtn = document.getElementById('saveItemsBtn');

        if (itemsTextarea) {
            itemsTextarea.addEventListener('input', function() {
                updateItemsPreview();
            });
        }

        if (saveItemsBtn) {
            saveItemsBtn.addEventListener('click', function() {
                saveItems();
            });
        }
    }

    // Fix Add Character button
    function fixAddCharacterButton() {
        const addCharacterBtn = document.getElementById('addCharacterBtn');
        if (addCharacterBtn) {
            addCharacterBtn.addEventListener('click', function() {
                // Create a new character entry
                const characterEntry = document.createElement('div');
                characterEntry.className = 'character-entry';
                
                // Create a unique ID for this character entry
                const characterId = 'character-' + Date.now();
                characterEntry.setAttribute('data-character-id', characterId);
                
                // Populate with input fields
                characterEntry.innerHTML = `
                    <input type="text" name="characterName" placeholder="Character Name">
                    <select name="characterClass" class="character-class">
                        <option value="">Select Class</option>
                        <option value="mage">Mage</option>
                        <option value="warrior">Warrior</option>
                        <option value="rogue">Scoundrel</option>
                        <option value="cleric">Healer</option>
                    </select>
                    <div class="character-buttons">
                        <button type="button" class="add-details-btn">Add Skills</button>
                        <button type="button" class="add-items-btn">Add Items</button>
                    </div>
                    <button type="button" class="delete-character-btn"><i class="fas fa-times"></i></button>
                `;
                
                // Add to the list
                const charactersList = document.getElementById('charactersList');
                if (charactersList) {
                    charactersList.appendChild(characterEntry);
                    
                    // Attach events to the new buttons
                    attachButtonEvents(characterEntry);
                    
                    // Dispatch event for other scripts
                    const event = new CustomEvent('characterAdded', { detail: { characterId } });
                    document.dispatchEvent(event);
                }
            });
        }
    }

    // Fix existing character buttons
    function fixExistingCharacterButtons() {
        document.querySelectorAll('.character-entry').forEach(function(entry) {
            attachButtonEvents(entry);
        });
    }

    // Attach events to buttons within a character entry
    function attachButtonEvents(entry) {
        // Generate ID if missing
        let characterId = entry.getAttribute('data-character-id');
        if (!characterId) {
            characterId = 'character-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            entry.setAttribute('data-character-id', characterId);
        }
        
        // Add Skills button
        const addDetailsBtn = entry.querySelector('.add-details-btn');
        if (addDetailsBtn) {
            // Remove old event listeners
            const newAddDetailsBtn = addDetailsBtn.cloneNode(true);
            addDetailsBtn.parentNode.replaceChild(newAddDetailsBtn, addDetailsBtn);
            
            newAddDetailsBtn.addEventListener('click', function() {
                const modal = document.getElementById('characterDetailsModal');
                if (modal) {
                    modal.setAttribute('data-target-character', characterId);
                    
                    // Load existing skills if any
                    const textarea = document.getElementById('skillsTextarea');
                    if (textarea) {
                        textarea.value = '';
                        const skillsData = entry.getAttribute('data-skills');
                        if (skillsData) {
                            textarea.value = skillsData.split(',').join('\n');
                        }
                        updateSkillsPreview();
                    }
                    
                    // Show the modal
                    modal.style.display = 'block';
                }
            });
        }
        
        // Add Items button
        const addItemsBtn = entry.querySelector('.add-items-btn');
        if (addItemsBtn) {
            // Remove old event listeners
            const newAddItemsBtn = addItemsBtn.cloneNode(true);
            addItemsBtn.parentNode.replaceChild(newAddItemsBtn, addItemsBtn);
            
            newAddItemsBtn.addEventListener('click', function() {
                const modal = document.getElementById('characterItemsModal');
                if (modal) {
                    modal.setAttribute('data-target-character', characterId);
                    
                    // Load existing items if any
                    const textarea = document.getElementById('itemsTextarea');
                    if (textarea) {
                        textarea.value = '';
                        const itemsData = entry.getAttribute('data-items');
                        if (itemsData) {
                            textarea.value = itemsData.split(',').join('\n');
                        }
                        updateItemsPreview();
                    }
                    
                    // Show the modal
                    modal.style.display = 'block';
                }
            });
        }
        
        // Delete button
        const deleteBtn = entry.querySelector('.delete-character-btn');
        if (deleteBtn) {
            // Remove old event listeners
            const newDeleteBtn = deleteBtn.cloneNode(true);
            deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
            
            newDeleteBtn.addEventListener('click', function() {
                entry.remove();
            });
        }
    }

    // Update skills preview
    function updateSkillsPreview() {
        const skillsTextarea = document.getElementById('skillsTextarea');
        const skillsPreview = document.getElementById('skillsPreview');
        
        if (!skillsTextarea || !skillsPreview) return;
        
        const skills = skillsTextarea.value.trim().split('\n').filter(skill => skill.trim() !== '');
        
        if (skills.length === 0) {
            skillsPreview.innerHTML = '<div class="no-skills">No skills added yet</div>';
            return;
        }
        
        skillsPreview.innerHTML = '';
        skills.forEach(skill => {
            if (skill.trim() === '') return;
            
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.textContent = skill.trim();
            skillsPreview.appendChild(skillItem);
        });
    }

    // Update items preview
    function updateItemsPreview() {
        const itemsTextarea = document.getElementById('itemsTextarea');
        const itemsPreview = document.getElementById('itemsPreview');
        
        if (!itemsTextarea || !itemsPreview) return;
        
        const items = itemsTextarea.value.trim().split('\n').filter(item => item.trim() !== '');
        
        if (items.length === 0) {
            itemsPreview.innerHTML = '<div class="no-items">No items added yet</div>';
            return;
        }
        
        itemsPreview.innerHTML = '';
        items.forEach(item => {
            if (item.trim() === '') return;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'item-element';
            itemElement.textContent = item.trim();
            itemsPreview.appendChild(itemElement);
        });
    }

    // Save skills to character
    function saveSkills() {
        const modal = document.getElementById('characterDetailsModal');
        if (!modal) return;
        
        const characterId = modal.getAttribute('data-target-character');
        if (!characterId) return;
        
        const characterEntry = document.querySelector(`.character-entry[data-character-id="${characterId}"]`);
        if (!characterEntry) return;
        
        const skillsTextarea = document.getElementById('skillsTextarea');
        if (!skillsTextarea) return;
        
        const skills = skillsTextarea.value.trim().split('\n').filter(skill => skill.trim() !== '');
        
        // Store skills as data attribute
        characterEntry.setAttribute('data-skills', skills.join(','));
        
        // Update UI to show skills are added
        let skillsStatus = characterEntry.querySelector('.skills-status');
        
        if (skills.length > 0) {
            if (!skillsStatus) {
                skillsStatus = document.createElement('div');
                skillsStatus.className = 'skills-status';
                skillsStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${skills.length} skills`;
                
                // Add to buttons container
                const buttonsContainer = characterEntry.querySelector('.character-buttons');
                if (buttonsContainer) {
                    buttonsContainer.appendChild(skillsStatus);
                    
                    // Add click handler to open skills modal
                    skillsStatus.addEventListener('click', function() {
                        modal.setAttribute('data-target-character', characterId);
                        
                        // Load existing skills if any
                        if (skillsTextarea) {
                            skillsTextarea.value = skills.join('\n');
                            updateSkillsPreview();
                        }
                        
                        modal.style.display = 'block';
                    });
                }
            } else {
                skillsStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${skills.length} skills`;
            }
        } else if (skillsStatus) {
            skillsStatus.remove();
        }
        
        // Close modal
        modal.style.display = 'none';
    }

    // Save items to character
    function saveItems() {
        const modal = document.getElementById('characterItemsModal');
        if (!modal) return;
        
        const characterId = modal.getAttribute('data-target-character');
        if (!characterId) return;
        
        const characterEntry = document.querySelector(`.character-entry[data-character-id="${characterId}"]`);
        if (!characterEntry) return;
        
        const itemsTextarea = document.getElementById('itemsTextarea');
        if (!itemsTextarea) return;
        
        const items = itemsTextarea.value.trim().split('\n').filter(item => item.trim() !== '');
        
        // Store items as data attribute
        characterEntry.setAttribute('data-items', items.join(','));
        
        // Update UI to show items are added
        let itemsStatus = characterEntry.querySelector('.items-status');
        
        if (items.length > 0) {
            if (!itemsStatus) {
                itemsStatus = document.createElement('div');
                itemsStatus.className = 'items-status';
                itemsStatus.innerHTML = `<i class="fas fa-box-open"></i> ${items.length} items`;
                
                // Add to buttons container
                const buttonsContainer = characterEntry.querySelector('.character-buttons');
                if (buttonsContainer) {
                    buttonsContainer.appendChild(itemsStatus);
                    
                    // Add click handler to open items modal
                    itemsStatus.addEventListener('click', function() {
                        modal.setAttribute('data-target-character', characterId);
                        
                        // Load existing items if any
                        if (itemsTextarea) {
                            itemsTextarea.value = items.join('\n');
                            updateItemsPreview();
                        }
                        
                        modal.style.display = 'block';
                    });
                }
            } else {
                itemsStatus.innerHTML = `<i class="fas fa-box-open"></i> ${items.length} items`;
            }
        } else if (itemsStatus) {
            itemsStatus.remove();
        }
        
        // Close modal
        modal.style.display = 'none';
    }

    // Set up modal close buttons
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});
