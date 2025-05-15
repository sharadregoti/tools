document.addEventListener('DOMContentLoaded', () => {
    // DOM elements - Tabs
    const encodeTabBtn = document.getElementById('encode-tab-btn');
    const decodeTabBtn = document.getElementById('decode-tab-btn');
    const encodeTab = document.getElementById('encode-tab');
    const decodeTab = document.getElementById('decode-tab');
    
    // DOM elements - Encode
    const encodeInputTypeRadios = document.querySelectorAll('input[name="encode-input-type"]');
    const encodeTextInput = document.getElementById('encode-text-input');
    const encodeFileInput = document.getElementById('encode-file-input');
    const textToEncode = document.getElementById('text-to-encode');
    const fileToEncode = document.getElementById('file-to-encode');
    const encodeFileInfo = document.getElementById('encode-file-info');
    const encodeFilename = document.getElementById('encode-filename');
    const encodeFilesize = document.getElementById('encode-filesize');
    const encodeBtn = document.getElementById('encode-btn');
    
    // DOM elements - Decode
    const base64ToDecode = document.getElementById('base64-to-decode');
    const decodeOutputTypeRadios = document.querySelectorAll('input[name="decode-output-type"]');
    const decodeBtn = document.getElementById('decode-btn');
    
    // DOM elements - Results
    const resultsContainer = document.getElementById('results-container');
    const copyResultBtn = document.getElementById('copy-result-btn');
    const downloadContainer = document.getElementById('download-container');
    const downloadLink = document.getElementById('download-link');
    
    // Variables to store current state
    let currentFile = null;
    let currentResult = null;
    
    // Event listeners - Tabs
    encodeTabBtn.addEventListener('click', () => switchTab('encode'));
    decodeTabBtn.addEventListener('click', () => switchTab('decode'));
    
    // Event listeners - Encode
    encodeInputTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'text') {
                encodeTextInput.classList.remove('hidden');
                encodeFileInput.classList.add('hidden');
            } else {
                encodeTextInput.classList.add('hidden');
                encodeFileInput.classList.remove('hidden');
            }
        });
    });
    
    fileToEncode.addEventListener('change', handleFileSelect);
    encodeBtn.addEventListener('click', handleEncode);
    
    // Event listeners - Decode
    decodeBtn.addEventListener('click', handleDecode);
    
    // Event listeners - Results
    copyResultBtn.addEventListener('click', copyResultToClipboard);
    
    // Function to switch between encode and decode tabs
    function switchTab(tab) {
        if (tab === 'encode') {
            encodeTabBtn.classList.add('bg-orange-600', 'text-white');
            encodeTabBtn.classList.remove('bg-gray-200', 'text-gray-700');
            decodeTabBtn.classList.add('bg-gray-200', 'text-gray-700');
            decodeTabBtn.classList.remove('bg-orange-600', 'text-white');
            encodeTab.classList.remove('hidden');
            decodeTab.classList.add('hidden');
        } else {
            decodeTabBtn.classList.add('bg-orange-600', 'text-white');
            decodeTabBtn.classList.remove('bg-gray-200', 'text-gray-700');
            encodeTabBtn.classList.add('bg-gray-200', 'text-gray-700');
            encodeTabBtn.classList.remove('bg-orange-600', 'text-white');
            decodeTab.classList.remove('hidden');
            encodeTab.classList.add('hidden');
        }
        
        // Reset results when switching tabs
        resetResults();
    }
    
    // Function to handle file selection
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Maximum size is 5MB.');
            fileToEncode.value = '';
            return;
        }
        
        currentFile = file;
        encodeFilename.textContent = file.name;
        encodeFilesize.textContent = formatFileSize(file.size);
        encodeFileInfo.classList.remove('hidden');
    }
    
    // Function to format file size
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    
    // Function to handle encoding
    function handleEncode() {
        resetResults();
        
        const inputType = document.querySelector('input[name="encode-input-type"]:checked').value;
        
        if (inputType === 'text') {
            const text = textToEncode.value.trim();
            if (!text) {
                showError('Please enter text to encode.');
                return;
            }
            
            const base64 = btoa(unescape(encodeURIComponent(text)));
            showTextResult(base64);
        } else {
            if (!currentFile) {
                showError('Please select a file to encode.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64 = event.target.result.split(',')[1];
                showTextResult(base64);
            };
            reader.onerror = function() {
                showError('Error reading file.');
            };
            reader.readAsDataURL(currentFile);
        }
    }
    
    // Function to handle decoding
    function handleDecode() {
        resetResults();
        
        const base64 = base64ToDecode.value.trim();
        if (!base64) {
            showError('Please enter a Base64 string to decode.');
            return;
        }
        
        const outputType = document.querySelector('input[name="decode-output-type"]:checked').value;
        
        try {
            if (outputType === 'text') {
                // Try to decode as text
                const decodedText = decodeURIComponent(escape(atob(base64)));
                showTextResult(decodedText);
            } else {
                // Decode as file
                const byteCharacters = atob(base64);
                const byteArrays = [];
                
                for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                    const slice = byteCharacters.slice(offset, offset + 512);
                    
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    
                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                
                const blob = new Blob(byteArrays);
                showFileResult(blob);
            }
        } catch (error) {
            showError('Error decoding Base64 string. Make sure it\'s a valid Base64 string.');
            console.error(error);
        }
    }
    
    // Function to show text result
    function showTextResult(text) {
        currentResult = text;
        
        resultsContainer.innerHTML = '';
        const resultElement = document.createElement('pre');
        resultElement.className = 'bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 font-mono text-sm';
        resultElement.textContent = text;
        
        resultsContainer.appendChild(resultElement);
        copyResultBtn.classList.remove('hidden');
        downloadContainer.classList.add('hidden');
    }
    
    // Function to show file result
    function showFileResult(blob) {
        const url = URL.createObjectURL(blob);
        
        resultsContainer.innerHTML = '<p class="text-gray-700">File decoded successfully. Click the button below to download.</p>';
        
        downloadLink.href = url;
        downloadLink.download = 'decoded_file';
        downloadContainer.classList.remove('hidden');
        copyResultBtn.classList.add('hidden');
    }
    
    // Function to show error
    function showError(message) {
        resultsContainer.innerHTML = `<p class="text-red-500">${message}</p>`;
        copyResultBtn.classList.add('hidden');
        downloadContainer.classList.add('hidden');
    }
    
    // Function to reset results
    function resetResults() {
        resultsContainer.innerHTML = '<p class="text-gray-500 italic">Results will appear here after encoding or decoding.</p>';
        copyResultBtn.classList.add('hidden');
        downloadContainer.classList.add('hidden');
        currentResult = null;
    }
    
    // Function to copy result to clipboard
    function copyResultToClipboard() {
        if (!currentResult) return;
        
        navigator.clipboard.writeText(currentResult).then(() => {
            // Change button text temporarily
            const originalText = copyResultBtn.textContent;
            copyResultBtn.textContent = 'Copied!';
            copyResultBtn.classList.add('bg-green-200', 'text-green-800');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyResultBtn.textContent = originalText;
                copyResultBtn.classList.remove('bg-green-200', 'text-green-800');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        });
    }
    
    // Add drag and drop support for file input
    const dropZone = encodeFileInput.querySelector('.border-dashed');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropZone.classList.add('border-orange-500', 'bg-orange-50');
    }
    
    function unhighlight() {
        dropZone.classList.remove('border-orange-500', 'bg-orange-50');
    }
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file) {
            fileToEncode.files = dt.files;
            handleFileSelect({ target: { files: [file] } });
        }
    }
    
    // Auto-detect encoding for text input
    textToEncode.addEventListener('input', function() {
        // This is a simple implementation that just enables the encode button
        // A more sophisticated implementation would analyze the text
        if (textToEncode.value.trim()) {
            encodeBtn.disabled = false;
        } else {
            encodeBtn.disabled = true;
        }
    });
    
    // Auto-detect if input is Base64
    base64ToDecode.addEventListener('input', function() {
        const input = base64ToDecode.value.trim();
        
        // Simple Base64 validation (more sophisticated validation could be implemented)
        const isBase64 = /^[A-Za-z0-9+/=]+$/.test(input);
        
        if (input && isBase64) {
            decodeBtn.disabled = false;
        } else {
            decodeBtn.disabled = true;
        }
    });
    
    // Initialize button states
    encodeBtn.disabled = true;
    decodeBtn.disabled = true;
});
