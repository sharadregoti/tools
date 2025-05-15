document.addEventListener('DOMContentLoaded', () => {
    // DOM elements - Tabs
    const encodeTabBtn = document.getElementById('encode-tab-btn');
    const decodeTabBtn = document.getElementById('decode-tab-btn');
    const encodeTab = document.getElementById('encode-tab');
    const decodeTab = document.getElementById('decode-tab');
    
    // DOM elements - Encode
    const inputText = document.getElementById('input-text');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const encodeModeRadios = document.querySelectorAll('input[name="encode-mode"]');
    
    // DOM elements - Decode
    const encodedText = document.getElementById('encoded-text');
    const decodedResult = document.getElementById('decoded-result');
    const copyDecodedBtn = document.getElementById('copy-decoded-btn');
    const decodeModeRadios = document.querySelectorAll('input[name="decode-mode"]');
    
    // Event listeners - Tabs
    encodeTabBtn.addEventListener('click', () => switchTab('encode'));
    decodeTabBtn.addEventListener('click', () => switchTab('decode'));
    
    // Event listeners - Encode
    inputText.addEventListener('input', encodeText);
    copyBtn.addEventListener('click', () => copyToClipboard(resultText.textContent, copyBtn));
    encodeModeRadios.forEach(radio => {
        radio.addEventListener('change', encodeText);
    });
    
    // Event listeners - Decode
    encodedText.addEventListener('input', decodeText);
    copyDecodedBtn.addEventListener('click', () => copyToClipboard(decodedResult.textContent, copyDecodedBtn));
    decodeModeRadios.forEach(radio => {
        radio.addEventListener('change', decodeText);
    });
    
    // Function to switch between encode and decode tabs
    function switchTab(tab) {
        if (tab === 'encode') {
            encodeTabBtn.classList.add('bg-green-700', 'text-white');
            encodeTabBtn.classList.remove('bg-gray-200', 'text-gray-700');
            decodeTabBtn.classList.add('bg-gray-200', 'text-gray-700');
            decodeTabBtn.classList.remove('bg-green-700', 'text-white');
            encodeTab.classList.remove('hidden');
            decodeTab.classList.add('hidden');
        } else {
            decodeTabBtn.classList.add('bg-green-700', 'text-white');
            decodeTabBtn.classList.remove('bg-gray-200', 'text-gray-700');
            encodeTabBtn.classList.add('bg-gray-200', 'text-gray-700');
            encodeTabBtn.classList.remove('bg-green-700', 'text-white');
            decodeTab.classList.remove('hidden');
            encodeTab.classList.add('hidden');
        }
    }
    
    // Function to encode text
    function encodeText() {
        const text = inputText.value;
        
        if (!text) {
            resultText.textContent = 'Encoded URL will appear here.';
            return;
        }
        
        try {
            const encodeMode = document.querySelector('input[name="encode-mode"]:checked').value;
            let encodedResult;
            
            if (encodeMode === 'component') {
                encodedResult = encodeURIComponent(text);
            } else {
                encodedResult = encodeURI(text);
            }
            
            resultText.textContent = encodedResult;
        } catch (error) {
            resultText.textContent = `Error: ${error.message}`;
        }
    }
    
    // Function to decode text
    function decodeText() {
        const text = encodedText.value;
        
        if (!text) {
            decodedResult.textContent = 'Decoded text will appear here.';
            return;
        }
        
        try {
            const decodeMode = document.querySelector('input[name="decode-mode"]:checked').value;
            let decodedText;
            
            if (decodeMode === 'component') {
                decodedText = decodeURIComponent(text);
            } else {
                decodedText = decodeURI(text);
            }
            
            decodedResult.textContent = decodedText;
        } catch (error) {
            decodedResult.textContent = `Error: ${error.message}`;
        }
    }
    
    // Function to copy text to clipboard
    function copyToClipboard(text, button) {
        // Check if there's text to copy
        if (!text || text === 'Encoded URL will appear here.' || text === 'Decoded text will appear here.' || text.startsWith('Error:')) {
            alert('No valid text to copy.');
            return;
        }
        
        // Use the Clipboard API
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
    
    // Add example text
    inputText.placeholder = "Enter text to encode...\nExample: https://example.com?name=John Doe&age=25";
    encodedText.placeholder = "Enter encoded URL to decode...\nExample: https%3A%2F%2Fexample.com%3Fname%3DJohn%20Doe%26age%3D25";
    
    // Initialize with example text for demonstration
    const urlExample = "https://example.com?name=John Doe&age=25";
    inputText.value = urlExample;
    encodeText();
});
