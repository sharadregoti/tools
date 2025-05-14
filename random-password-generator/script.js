document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const passwordDisplay = document.getElementById('passwordDisplay');
    const passwordLength = document.getElementById('passwordLength');
    const passwordLengthNumber = document.getElementById('passwordLengthNumber');
    const includeUppercase = document.getElementById('includeUppercase');
    const includeLowercase = document.getElementById('includeLowercase');
    const includeNumbers = document.getElementById('includeNumbers');
    const includeSymbols = document.getElementById('includeSymbols');
    const minNumbers = document.getElementById('minNumbers');
    const minSymbols = document.getElementById('minSymbols');
    const avoidAmbiguous = document.getElementById('avoidAmbiguous');
    const generateBtn = document.getElementById('generateBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const copyBtn = document.getElementById('copyBtn');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*';
    
    // Ambiguous characters
    const ambiguousChars = 'Il1O0';

    // Sync range and number inputs
    passwordLength.addEventListener('input', function() {
        passwordLengthNumber.value = passwordLength.value;
        if (passwordDisplay.textContent !== 'Generate a password') {
            generatePassword();
        }
    });

    passwordLengthNumber.addEventListener('input', function() {
        // Ensure value is within range
        let value = parseInt(passwordLengthNumber.value);
        if (isNaN(value)) {
            value = 14;
        } else if (value < 5) {
            value = 5;
        } else if (value > 128) {
            value = 128;
        }
        passwordLengthNumber.value = value;
        passwordLength.value = value;
        
        if (passwordDisplay.textContent !== 'Generate a password') {
            generatePassword();
        }
    });

    // Generate button click handler
    generateBtn.addEventListener('click', generatePassword);
    
    // Refresh button click handler
    refreshBtn.addEventListener('click', generatePassword);

    // Copy button click handler
    copyBtn.addEventListener('click', function() {
        if (passwordDisplay.textContent === 'Generate a password') {
            return;
        }
        
        // Try to use the modern clipboard API first
        if (navigator.clipboard) {
            navigator.clipboard.writeText(passwordDisplay.textContent)
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

    // Fallback copy method
    function fallbackCopy() {
        // Create a temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = passwordDisplay.textContent;
        textarea.style.position = 'fixed';  // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopiedFeedback();
            }
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
        
        document.body.removeChild(textarea);
    }

    // Show copied feedback
    function showCopiedFeedback() {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        `;
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }

    // Generate password function
    function generatePassword() {
        // Validate inputs
        if (!validateInputs()) {
            return;
        }
        
        const length = parseInt(passwordLength.value);
        const minNumCount = parseInt(minNumbers.value);
        const minSymCount = parseInt(minSymbols.value);
        
        // Get available character sets based on options
        let availableChars = '';
        let requiredChars = [];
        
        if (includeUppercase.checked) {
            availableChars += uppercaseChars;
        }
        
        if (includeLowercase.checked) {
            availableChars += lowercaseChars;
        }
        
        if (includeNumbers.checked) {
            availableChars += numberChars;
            // Add required numbers
            for (let i = 0; i < minNumCount; i++) {
                requiredChars.push(getRandomChar(numberChars));
            }
        }
        
        if (includeSymbols.checked) {
            availableChars += symbolChars;
            // Add required symbols
            for (let i = 0; i < minSymCount; i++) {
                requiredChars.push(getRandomChar(symbolChars));
            }
        }
        
        // Remove ambiguous characters if option is selected
        if (avoidAmbiguous.checked) {
            for (let i = 0; i < ambiguousChars.length; i++) {
                availableChars = availableChars.replace(ambiguousChars[i], '');
            }
            
            // Also remove from required chars
            requiredChars = requiredChars.filter(char => !ambiguousChars.includes(char));
            
            // Re-add required chars if they were filtered out
            if (includeNumbers.checked) {
                const numCharsWithoutAmbiguous = numberChars.split('').filter(char => !ambiguousChars.includes(char)).join('');
                while (requiredChars.filter(char => numberChars.includes(char)).length < minNumCount) {
                    requiredChars.push(getRandomChar(numCharsWithoutAmbiguous));
                }
            }
            
            if (includeSymbols.checked) {
                const symCharsWithoutAmbiguous = symbolChars.split('').filter(char => !ambiguousChars.includes(char)).join('');
                while (requiredChars.filter(char => symbolChars.includes(char)).length < minSymCount) {
                    requiredChars.push(getRandomChar(symCharsWithoutAmbiguous));
                }
            }
        }
        
        // Check if we have enough characters to generate the password
        if (availableChars.length === 0) {
            passwordDisplay.textContent = 'Please select at least one character type';
            return;
        }
        
        // Check if we can satisfy minimum requirements
        if (requiredChars.length > length) {
            passwordDisplay.textContent = 'Password length too short for minimum requirements';
            return;
        }
        
        // Generate the password
        let password = '';
        
        // First, add all required characters
        password += requiredChars.join('');
        
        // Then fill the rest with random characters
        for (let i = password.length; i < length; i++) {
            password += getRandomChar(availableChars);
        }
        
        // Shuffle the password to mix the required characters
        password = shuffleString(password);
        
        // Display the password
        passwordDisplay.textContent = password;
        
        // Update strength indicator
        updateStrengthIndicator(password);
    }

    // Validate inputs function
    function validateInputs() {
        // Check if at least one character type is selected
        if (!includeUppercase.checked && !includeLowercase.checked && 
            !includeNumbers.checked && !includeSymbols.checked) {
            passwordDisplay.textContent = 'Please select at least one character type';
            return false;
        }
        
        // Check if minimum numbers is valid
        if (includeNumbers.checked) {
            let value = parseInt(minNumbers.value);
            if (isNaN(value) || value < 0) {
                minNumbers.value = 0;
            } else if (value > parseInt(passwordLength.value)) {
                minNumbers.value = passwordLength.value;
            }
        } else {
            minNumbers.value = 0;
        }
        
        // Check if minimum symbols is valid
        if (includeSymbols.checked) {
            let value = parseInt(minSymbols.value);
            if (isNaN(value) || value < 0) {
                minSymbols.value = 0;
            } else if (value > parseInt(passwordLength.value)) {
                minSymbols.value = passwordLength.value;
            }
        } else {
            minSymbols.value = 0;
        }
        
        // Check if combined minimums exceed password length
        const totalMinimum = parseInt(minNumbers.value) + parseInt(minSymbols.value);
        if (totalMinimum > parseInt(passwordLength.value)) {
            passwordDisplay.textContent = 'Minimum requirements exceed password length';
            return false;
        }
        
        return true;
    }

    // Get random character from a string
    function getRandomChar(charSet) {
        return charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    // Shuffle a string
    function shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    // Update strength indicator
    function updateStrengthIndicator(password) {
        // Calculate password strength
        const length = password.length;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[!@#$%^&*]/.test(password);
        
        const charsetScore = (hasUppercase ? 1 : 0) + 
                            (hasLowercase ? 1 : 0) + 
                            (hasNumbers ? 1 : 0) + 
                            (hasSymbols ? 1 : 0);
        
        // Calculate score (0-100)
        let score = 0;
        
        // Length score (up to 40 points)
        if (length >= 14) {
            score += 40;
        } else if (length >= 10) {
            score += 30;
        } else if (length >= 8) {
            score += 20;
        } else {
            score += 10;
        }
        
        // Character set score (up to 40 points)
        score += charsetScore * 10;
        
        // Bonus for length and variety (up to 20 points)
        if (length >= 14 && charsetScore >= 3) {
            score += 20;
        } else if (length >= 10 && charsetScore >= 2) {
            score += 10;
        }
        
        // Update strength bar
        strengthBar.style.width = `${score}%`;
        
        // Update color based on score
        if (score >= 80) {
            strengthBar.className = 'bg-green-500 h-2.5 rounded-full';
            strengthText.textContent = 'Strong';
        } else if (score >= 60) {
            strengthBar.className = 'bg-yellow-500 h-2.5 rounded-full';
            strengthText.textContent = 'Good';
        } else if (score >= 40) {
            strengthBar.className = 'bg-orange-500 h-2.5 rounded-full';
            strengthText.textContent = 'Moderate';
        } else {
            strengthBar.className = 'bg-red-500 h-2.5 rounded-full';
            strengthText.textContent = 'Weak';
        }
    }

    // Add event listeners for option changes
    includeUppercase.addEventListener('change', function() {
        if (passwordDisplay.textContent !== 'Generate a password') {
            generatePassword();
        }
    });
    
    includeLowercase.addEventListener('change', function() {
        if (passwordDisplay.textContent !== 'Generate a password') {
            generatePassword();
        }
    });
    
    includeNumbers.addEventListener('change', function() {
        if (!includeNumbers.checked) {
            minNumbers.value = 0;
        }
        if (passwordDisplay.textContent !== 'Generate a password') {
            generatePassword();
        }
    });
    
    includeSymbols.addEventListener('change', function() {
        if (!includeSymbols.checked) {
            minSymbols.value = 0;
        }
        if (passwordDisplay.textContent !== 'Generate a password') {
            generatePassword();
        }
    });
    
    minNumbers.addEventListener('input', function() {
        if (passwordDisplay.textContent !== 'Generate a password') {
            generatePassword();
        }
    });
    
    minSymbols.addEventListener('input', function() {
        if (passwordDisplay.textContent !== 'Generate a password') {
            generatePassword();
        }
    });
    
    avoidAmbiguous.addEventListener('change', function() {
        if (passwordDisplay.textContent !== 'Generate a password') {
            generatePassword();
        }
    });
});
