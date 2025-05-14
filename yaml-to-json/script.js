document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const yamlInput = document.getElementById('yamlInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearYamlBtn = document.getElementById('clearYamlBtn');
    const clearJsonBtn = document.getElementById('clearJsonBtn');
    const sampleYamlBtn = document.getElementById('sampleYamlBtn');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');

    // Sample YAML data
    const sampleYaml = `# Person information
person:
  name: John Doe
  age: 30
  isEmployed: true
  address:
    street: 123 Main St
    city: Anytown
    zipCode: '12345'
  phoneNumbers:
    - type: home
      number: 555-1234
    - type: work
      number: 555-5678
  skills:
    - JavaScript
    - HTML
    - CSS
  education: null

# Company information
company:
  name: Tech Corp
  founded: 2010
  active: true
  departments:
    - Engineering
    - Marketing
    - HR`;

    // Convert button click handler
    convertBtn.addEventListener('click', function() {
        const yamlString = yamlInput.value.trim();
        
        // Clear previous errors
        hideError();
        
        if (!yamlString) {
            showError('Please enter YAML data.');
            return;
        }
        
        try {
            // Parse YAML
            const jsonObj = jsyaml.load(yamlString);
            
            // Convert to formatted JSON
            const jsonString = JSON.stringify(jsonObj, null, 2);
            
            // Display result
            jsonOutput.value = jsonString;
        } catch (error) {
            showError(`Invalid YAML: ${error.message}`);
        }
    });

    // Copy button click handler
    copyBtn.addEventListener('click', function() {
        if (!jsonOutput.value) {
            showError('No JSON to copy.');
            return;
        }
        
        // Try to use the modern clipboard API first
        if (navigator.clipboard) {
            navigator.clipboard.writeText(jsonOutput.value)
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
        jsonOutput.select();
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

    // Clear YAML button click handler
    clearYamlBtn.addEventListener('click', function() {
        yamlInput.value = '';
        hideError();
    });

    // Clear JSON button click handler
    clearJsonBtn.addEventListener('click', function() {
        jsonOutput.value = '';
        hideError();
    });

    // Sample YAML button click handler
    sampleYamlBtn.addEventListener('click', function() {
        yamlInput.value = sampleYaml;
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
