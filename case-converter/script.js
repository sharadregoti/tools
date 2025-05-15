document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const inputText = document.getElementById('input-text');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    
    // Case conversion buttons
    const camelCaseBtn = document.getElementById('camel-case-btn');
    const snakeCaseBtn = document.getElementById('snake-case-btn');
    const kebabCaseBtn = document.getElementById('kebab-case-btn');
    const pascalCaseBtn = document.getElementById('pascal-case-btn');
    const upperCaseBtn = document.getElementById('upper-case-btn');
    const lowerCaseBtn = document.getElementById('lower-case-btn');
    const titleCaseBtn = document.getElementById('title-case-btn');
    const sentenceCaseBtn = document.getElementById('sentence-case-btn');
    const constantCaseBtn = document.getElementById('constant-case-btn');
    
    // Event listeners for buttons
    camelCaseBtn.addEventListener('click', () => convertCase('camel'));
    snakeCaseBtn.addEventListener('click', () => convertCase('snake'));
    kebabCaseBtn.addEventListener('click', () => convertCase('kebab'));
    pascalCaseBtn.addEventListener('click', () => convertCase('pascal'));
    upperCaseBtn.addEventListener('click', () => convertCase('upper'));
    lowerCaseBtn.addEventListener('click', () => convertCase('lower'));
    titleCaseBtn.addEventListener('click', () => convertCase('title'));
    sentenceCaseBtn.addEventListener('click', () => convertCase('sentence'));
    constantCaseBtn.addEventListener('click', () => convertCase('constant'));
    
    // Copy to clipboard
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Keyboard shortcut for copy (Ctrl+Shift+C or Cmd+Shift+C)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            copyToClipboard();
        }
    });
    
    // Main function to convert text to different cases
    function convertCase(caseType) {
        const text = inputText.value.trim();
        
        if (!text) {
            resultText.textContent = 'Please enter some text to convert.';
            return;
        }
        
        let result = '';
        
        // First, normalize the text by splitting it into words
        // This handles various input formats (spaces, hyphens, underscores, camelCase, etc.)
        const words = normalizeText(text);
        
        // Convert to the requested case
        switch (caseType) {
            case 'camel':
                result = toCamelCase(words);
                break;
            case 'snake':
                result = toSnakeCase(words);
                break;
            case 'kebab':
                result = toKebabCase(words);
                break;
            case 'pascal':
                result = toPascalCase(words);
                break;
            case 'upper':
                result = toUpperCase(words);
                break;
            case 'lower':
                result = toLowerCase(words);
                break;
            case 'title':
                result = toTitleCase(words);
                break;
            case 'sentence':
                result = toSentenceCase(words);
                break;
            case 'constant':
                result = toConstantCase(words);
                break;
            default:
                result = text;
        }
        
        // Display the result
        resultText.textContent = result;
        
        // Highlight the active button
        highlightActiveButton(caseType);
    }
    
    // Normalize text into an array of words
    function normalizeText(text) {
        // Handle camelCase and PascalCase
        text = text.replace(/([a-z])([A-Z])/g, '$1 $2');
        
        // Replace common separators with spaces
        text = text.replace(/[_\-\.]/g, ' ');
        
        // Split by spaces and filter out empty strings
        return text.split(/\s+/).filter(word => word.length > 0);
    }
    
    // Convert to camelCase
    function toCamelCase(words) {
        if (words.length === 0) return '';
        
        return words.map((word, index) => {
            if (index === 0) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
    }
    
    // Convert to snake_case
    function toSnakeCase(words) {
        return words.map(word => word.toLowerCase()).join('_');
    }
    
    // Convert to kebab-case
    function toKebabCase(words) {
        return words.map(word => word.toLowerCase()).join('-');
    }
    
    // Convert to PascalCase
    function toPascalCase(words) {
        return words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
    }
    
    // Convert to UPPERCASE
    function toUpperCase(words) {
        return words.join(' ').toUpperCase();
    }
    
    // Convert to lowercase
    function toLowerCase(words) {
        return words.join(' ').toLowerCase();
    }
    
    // Convert to Title Case
    function toTitleCase(words) {
        return words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    }
    
    // Convert to Sentence case
    function toSentenceCase(words) {
        if (words.length === 0) return '';
        
        const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
        const restWords = words.slice(1).map(word => word.toLowerCase());
        
        return [firstWord, ...restWords].join(' ');
    }
    
    // Convert to CONSTANT_CASE
    function toConstantCase(words) {
        return words.map(word => word.toUpperCase()).join('_');
    }
    
    // Copy result to clipboard
    function copyToClipboard() {
        const textToCopy = resultText.textContent;
        
        // Check if there's text to copy
        if (!textToCopy || textToCopy === 'Converted text will appear here.' || textToCopy === 'Please enter some text to convert.') {
            alert('Please convert some text first.');
            return;
        }
        
        // Use the Clipboard API
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Change button text temporarily
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('bg-green-200', 'text-green-800');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('bg-green-200', 'text-green-800');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        });
    }
    
    // Highlight the active button
    function highlightActiveButton(caseType) {
        // Remove highlight from all buttons
        const allButtons = [
            camelCaseBtn, snakeCaseBtn, kebabCaseBtn, pascalCaseBtn,
            upperCaseBtn, lowerCaseBtn, titleCaseBtn, sentenceCaseBtn, constantCaseBtn
        ];
        
        allButtons.forEach(btn => {
            btn.classList.remove('bg-indigo-500', 'text-white');
            btn.classList.add('bg-indigo-100', 'text-indigo-700');
        });
        
        // Add highlight to the active button
        let activeButton;
        
        switch (caseType) {
            case 'camel':
                activeButton = camelCaseBtn;
                break;
            case 'snake':
                activeButton = snakeCaseBtn;
                break;
            case 'kebab':
                activeButton = kebabCaseBtn;
                break;
            case 'pascal':
                activeButton = pascalCaseBtn;
                break;
            case 'upper':
                activeButton = upperCaseBtn;
                break;
            case 'lower':
                activeButton = lowerCaseBtn;
                break;
            case 'title':
                activeButton = titleCaseBtn;
                break;
            case 'sentence':
                activeButton = sentenceCaseBtn;
                break;
            case 'constant':
                activeButton = constantCaseBtn;
                break;
        }
        
        if (activeButton) {
            activeButton.classList.remove('bg-indigo-100', 'text-indigo-700');
            activeButton.classList.add('bg-indigo-500', 'text-white');
        }
    }
    
    // Add example text when the page loads
    inputText.placeholder = "Enter text to convert...\nExample: This is an example text";
    
    // Add input event listener to enable real-time conversion
    let lastSelectedCase = 'camel'; // Default case
    
    inputText.addEventListener('input', () => {
        if (inputText.value.trim() && lastSelectedCase) {
            convertCase(lastSelectedCase);
        }
    });
    
    // Update lastSelectedCase when a button is clicked
    const caseButtons = document.querySelectorAll('[id$="-case-btn"], #upper-case-btn, #lower-case-btn');
    caseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const caseType = button.id.replace('-case-btn', '').replace('-btn', '');
            lastSelectedCase = caseType;
        });
    });
});
