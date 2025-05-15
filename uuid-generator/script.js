document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const generateBtn = document.getElementById('generate-btn');
    const uuidCountInput = document.getElementById('uuid-count');
    const hyphenatedCheckbox = document.getElementById('hyphenated');
    const resultsContainer = document.getElementById('results-container');
    const copyAllBtn = document.getElementById('copy-all-btn');
    
    // Event listeners
    generateBtn.addEventListener('click', generateUUIDs);
    copyAllBtn.addEventListener('click', copyAllUUIDs);
    
    // Generate UUIDs function
    function generateUUIDs() {
        // Get user input
        const count = parseInt(uuidCountInput.value);
        const includeHyphens = hyphenatedCheckbox.checked;
        
        // Validate input
        if (isNaN(count) || count < 1 || count > 100) {
            alert('Please enter a valid number between 1 and 100.');
            return;
        }
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Generate UUIDs
        for (let i = 0; i < count; i++) {
            const uuid = generateUUID(includeHyphens);
            addUUIDToResults(uuid, i + 1);
        }
        
        // Show copy all button if multiple UUIDs
        if (count > 1) {
            copyAllBtn.classList.remove('hidden');
        } else {
            copyAllBtn.classList.add('hidden');
        }
    }
    
    // Generate a single UUID
    function generateUUID(includeHyphens = true) {
        // RFC4122 version 4 compliant UUID
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        
        return includeHyphens ? uuid : uuid.replace(/-/g, '');
    }
    
    // Add UUID to results container
    function addUUIDToResults(uuid, index) {
        const uuidContainer = document.createElement('div');
        uuidContainer.className = 'flex items-center justify-between bg-gray-50 p-3 rounded-lg';
        
        const uuidText = document.createElement('div');
        if (index) {
            uuidText.innerHTML = `<span class="text-gray-500 mr-2">${index}.</span><span class="font-mono">${uuid}</span>`;
        } else {
            uuidText.innerHTML = `<span class="font-mono">${uuid}</span>`;
        }
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors';
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', () => copyToClipboard(uuid, copyBtn));
        
        uuidContainer.appendChild(uuidText);
        uuidContainer.appendChild(copyBtn);
        resultsContainer.appendChild(uuidContainer);
    }
    
    // Copy a single UUID to clipboard
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            // Change button text temporarily
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('bg-green-200', 'text-green-800');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('bg-green-200', 'text-green-800');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        });
    }
    
    // Copy all UUIDs to clipboard
    function copyAllUUIDs() {
        const uuidElements = resultsContainer.querySelectorAll('.font-mono');
        const uuids = Array.from(uuidElements).map(el => el.textContent);
        
        if (uuids.length === 0) return;
        
        navigator.clipboard.writeText(uuids.join('\n')).then(() => {
            // Change button text temporarily
            const originalText = copyAllBtn.textContent;
            copyAllBtn.textContent = 'All Copied!';
            copyAllBtn.classList.add('bg-green-200', 'text-green-800');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyAllBtn.textContent = originalText;
                copyAllBtn.classList.remove('bg-green-200', 'text-green-800');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy all: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        });
    }
    
    // Generate a UUID on page load
    generateUUIDs();
});
