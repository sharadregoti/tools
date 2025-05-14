document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const topLevelFields = document.getElementById('topLevelFields');
    const topLevelFieldsValue = document.getElementById('topLevelFieldsValue');
    const nestingLevel = document.getElementById('nestingLevel');
    const nestingLevelValue = document.getElementById('nestingLevelValue');
    const arrayLength = document.getElementById('arrayLength');
    const arrayLengthValue = document.getElementById('arrayLengthValue');
    const stringLength = document.getElementById('stringLength');
    const stringLengthValue = document.getElementById('stringLengthValue');
    
    const includeStrings = document.getElementById('includeStrings');
    const includeNumbers = document.getElementById('includeNumbers');
    const includeBooleans = document.getElementById('includeBooleans');
    const includeArrays = document.getElementById('includeArrays');
    const includeObjects = document.getElementById('includeObjects');
    const includeNull = document.getElementById('includeNull');
    const useFlowStyle = document.getElementById('useFlowStyle');
    
    const generateBtn = document.getElementById('generateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const yamlOutput = document.getElementById('yamlOutput');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');

    // Update range value displays
    topLevelFields.addEventListener('input', () => {
        topLevelFieldsValue.textContent = topLevelFields.value;
    });
    
    nestingLevel.addEventListener('input', () => {
        nestingLevelValue.textContent = nestingLevel.value;
    });
    
    arrayLength.addEventListener('input', () => {
        arrayLengthValue.textContent = arrayLength.value;
    });
    
    stringLength.addEventListener('input', () => {
        stringLengthValue.textContent = stringLength.value;
    });

    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        try {
            // Check if at least one type is selected
            if (!includeStrings.checked && !includeNumbers.checked && 
                !includeBooleans.checked && !includeArrays.checked && 
                !includeObjects.checked && !includeNull.checked) {
                showError('Please select at least one data type to include.');
                return;
            }
            
            // Get configuration
            const config = {
                topLevelFields: parseInt(topLevelFields.value),
                nestingLevel: parseInt(nestingLevel.value),
                arrayLength: parseInt(arrayLength.value),
                stringLength: parseInt(stringLength.value),
                includeTypes: {
                    strings: includeStrings.checked,
                    numbers: includeNumbers.checked,
                    booleans: includeBooleans.checked,
                    arrays: includeArrays.checked,
                    objects: includeObjects.checked,
                    null: includeNull.checked
                },
                useFlowStyle: useFlowStyle.checked
            };
            
            // Generate random data
            const randomData = generateRandomJson(config);
            
            // Convert to YAML
            const yamlString = jsyaml.dump(randomData, {
                flowLevel: config.useFlowStyle ? 0 : -1, // Use flow style if selected
                indent: 2
            });
            
            // Display YAML
            yamlOutput.value = yamlString;
            
            // Hide any previous errors
            hideError();
        } catch (error) {
            showError(`Error generating YAML: ${error.message}`);
        }
    });

    // Reset button click handler
    resetBtn.addEventListener('click', function() {
        // Reset range inputs
        topLevelFields.value = 5;
        topLevelFieldsValue.textContent = '5';
        
        nestingLevel.value = 2;
        nestingLevelValue.textContent = '2';
        
        arrayLength.value = 5;
        arrayLengthValue.textContent = '5';
        
        stringLength.value = 10;
        stringLengthValue.textContent = '10';
        
        // Reset checkboxes
        includeStrings.checked = true;
        includeNumbers.checked = true;
        includeBooleans.checked = true;
        includeArrays.checked = true;
        includeObjects.checked = true;
        includeNull.checked = true;
        useFlowStyle.checked = false;
        
        // Clear output
        yamlOutput.value = '';
        
        // Hide any errors
        hideError();
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

    // Clear button click handler
    clearBtn.addEventListener('click', function() {
        yamlOutput.value = '';
        hideError();
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

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove('hidden');
    }

    // Hide error message
    function hideError() {
        errorContainer.classList.add('hidden');
    }

    // Generate random JSON based on configuration
    function generateRandomJson(config) {
        return generateObject(0, config);
    }

    // Generate a random object
    function generateObject(currentLevel, config) {
        const obj = {};
        
        // For top level, use the specified number of fields
        const numFields = currentLevel === 0 
            ? config.topLevelFields 
            : Math.floor(Math.random() * config.topLevelFields) + 1;
        
        for (let i = 0; i < numFields; i++) {
            const key = generateRandomKey(i);
            obj[key] = generateRandomValue(currentLevel, config);
        }
        
        return obj;
    }

    // Generate a random array
    function generateArray(currentLevel, config) {
        const arr = [];
        const length = Math.floor(Math.random() * config.arrayLength) + 1;
        
        for (let i = 0; i < length; i++) {
            arr.push(generateRandomValue(currentLevel, config));
        }
        
        return arr;
    }

    // Generate a random value based on the allowed types
    function generateRandomValue(currentLevel, config) {
        // Get available types based on configuration and current nesting level
        const availableTypes = [];
        
        if (config.includeTypes.strings) availableTypes.push('string');
        if (config.includeTypes.numbers) availableTypes.push('number');
        if (config.includeTypes.booleans) availableTypes.push('boolean');
        if (config.includeTypes.null) availableTypes.push('null');
        
        // Only include arrays and objects if we haven't reached the max nesting level
        if (currentLevel < config.nestingLevel) {
            if (config.includeTypes.arrays) availableTypes.push('array');
            if (config.includeTypes.objects) availableTypes.push('object');
        }
        
        // If no types are available (shouldn't happen due to earlier check), default to string
        if (availableTypes.length === 0) {
            return generateRandomString(config.stringLength);
        }
        
        // Select a random type from available types
        const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        // Generate a value of the selected type
        switch (randomType) {
            case 'string':
                return generateRandomString(config.stringLength);
            case 'number':
                return generateRandomNumber();
            case 'boolean':
                return Math.random() > 0.5;
            case 'null':
                return null;
            case 'array':
                return generateArray(currentLevel + 1, config);
            case 'object':
                return generateObject(currentLevel + 1, config);
            default:
                return generateRandomString(config.stringLength);
        }
    }

    // Generate a random string
    function generateRandomString(maxLength) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = Math.floor(Math.random() * maxLength) + 3; // At least 3 chars
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    // Generate a random number
    function generateRandomNumber() {
        // 50% chance of integer, 50% chance of float
        if (Math.random() > 0.5) {
            return Math.floor(Math.random() * 1000);
        } else {
            return Math.random() * 1000;
        }
    }

    // Generate a random key for an object
    function generateRandomKey(index) {
        // Common field names for more realistic data
        const commonKeys = [
            'id', 'name', 'title', 'description', 'type', 'category',
            'price', 'cost', 'value', 'amount', 'quantity',
            'date', 'time', 'created', 'updated', 'timestamp',
            'status', 'state', 'enabled', 'active', 'visible',
            'user', 'customer', 'client', 'account', 'profile',
            'address', 'location', 'position', 'coordinates',
            'settings', 'config', 'options', 'preferences',
            'data', 'content', 'items', 'elements', 'records'
        ];
        
        // For the first few indices, use common keys if available
        if (index < commonKeys.length) {
            return commonKeys[index];
        }
        
        // Otherwise generate a random key
        return 'field' + (index + 1);
    }
});
