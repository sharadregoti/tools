document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const jsonInput = document.getElementById('jsonInput');
    const yamlOutput = document.getElementById('yamlOutput');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearJsonBtn = document.getElementById('clearJsonBtn');
    const clearYamlBtn = document.getElementById('clearYamlBtn');
    const sampleJsonBtn = document.getElementById('sampleJsonBtn');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');

    // Sample JSON data
    const sampleJson = {
        "person": {
            "name": "John Doe",
            "age": 30,
            "isEmployed": true,
            "address": {
                "street": "123 Main St",
                "city": "Anytown",
                "zipCode": "12345"
            },
            "phoneNumbers": [
                {
                    "type": "home",
                    "number": "555-1234"
                },
                {
                    "type": "work",
                    "number": "555-5678"
                }
            ],
            "skills": ["JavaScript", "HTML", "CSS"],
            "education": null
        },
        "company": {
            "name": "Tech Corp",
            "founded": 2010,
            "active": true,
            "departments": ["Engineering", "Marketing", "HR"]
        }
    };

    // Convert button click handler
    convertBtn.addEventListener('click', function() {
        const jsonString = jsonInput.value.trim();
        
        // Clear previous errors
        hideError();
        
        if (!jsonString) {
            showError('Please enter JSON data.');
            return;
        }
        
        try {
            // Parse JSON
            const jsonObj = JSON.parse(jsonString);
            
            // Convert to YAML using js-yaml library
            const yamlString = jsyaml.dump(jsonObj);
            
            // Display result
            yamlOutput.value = yamlString;
        } catch (error) {
            showError(`Invalid JSON: ${error.message}`);
        }
    });

    // Copy button click handler
    copyBtn.addEventListener('click', function() {
        if (!yamlOutput.value) {
            showError('No YAML to copy.');
            return;
        }
        
        // Try to use the modern clipboard API first
        if (navigator.clipboard) {
            navigator.clipboard.writeText(yamlOutput.value)
                .then(() => {
                    showCopiedFeedback();
                })
                .catch(err => {
                    // Fall back to the older method if the Clipboard API fails
                    fallbackCopy();
                });
        } else {
            // Use the older method for browsers that don't support the Clipboard API
            fallbackCopy();
        }
    });

    // Fallback copy method using selection and execCommand
    function fallbackCopy() {
        yamlOutput.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopiedFeedback();
            } else {
                showError('Unable to copy to clipboard.');
            }
        } catch (err) {
            showError('Failed to copy: ' + err);
        }
        // Deselect the text
        window.getSelection().removeAllRanges();
    }

    // Show "Copied!" feedback
    function showCopiedFeedback() {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }

    // Clear JSON button click handler
    clearJsonBtn.addEventListener('click', function() {
        jsonInput.value = '';
        hideError();
    });

    // Clear YAML button click handler
    clearYamlBtn.addEventListener('click', function() {
        yamlOutput.value = '';
        hideError();
    });

    // Sample JSON button click handler
    sampleJsonBtn.addEventListener('click', function() {
        jsonInput.value = JSON.stringify(sampleJson, null, 2);
        hideError();
    });

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove('hidden');
    }

    // Hide error message
    function hideError() {
        errorContainer.classList.add('hidden');
    }
});
