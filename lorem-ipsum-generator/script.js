document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const contentTypeRadios = document.querySelectorAll('input[name="content-type"]');
    const contentTypeLabel = document.getElementById('content-type-label');
    const contentCount = document.getElementById('content-count');
    const minMaxHint = document.getElementById('min-max-hint');
    const textStyle = document.getElementById('text-style');
    const startWithLorem = document.getElementById('start-with-lorem');
    const includeHtml = document.getElementById('include-html');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const previewContainer = document.getElementById('preview-container');
    
    // Add the Lorem Ipsum library directly
    const loremIpsumScript = document.createElement('script');
    loremIpsumScript.src = 'https://cdn.jsdelivr.net/npm/lorem-ipsum@2.0.8/dist/lorem-ipsum.min.js';
    document.head.appendChild(loremIpsumScript);
    
    // Event listeners
    contentTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateContentTypeLabel);
    });
    
    generateBtn.addEventListener('click', generateLoremIpsum);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Update content type label and limits based on selection
    function updateContentTypeLabel() {
        const selectedType = document.querySelector('input[name="content-type"]:checked').value;
        contentTypeLabel.textContent = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
        
        // Update min/max values based on content type
        switch (selectedType) {
            case 'paragraphs':
                contentCount.max = 50;
                minMaxHint.textContent = 'Min: 1, Max: 50';
                if (contentCount.value > 50) contentCount.value = 50;
                break;
            case 'sentences':
                contentCount.max = 100;
                minMaxHint.textContent = 'Min: 1, Max: 100';
                if (contentCount.value > 100) contentCount.value = 100;
                break;
            case 'words':
                contentCount.max = 1000;
                minMaxHint.textContent = 'Min: 1, Max: 1000';
                if (contentCount.value > 1000) contentCount.value = 1000;
                break;
        }
    }
    
    // Generate Lorem Ipsum text
    function generateLoremIpsum() {
        const type = document.querySelector('input[name="content-type"]:checked').value;
        const count = parseInt(contentCount.value);
        const style = textStyle.value;
        const startLorem = startWithLorem.checked;
        const html = includeHtml.checked;
        
        // Validate input
        if (isNaN(count) || count < 1) {
            alert('Please enter a valid number.');
            return;
        }
        
        let result = '';
        
        // Generate text based on selected style
        if (style === 'standard') {
            result = generateStandardLoremIpsum(type, count, startLorem, html);
        } else if (style === 'tech') {
            result = generateTechLoremIpsum(type, count, startLorem, html);
        } else if (style === 'startup') {
            result = generateStartupLoremIpsum(type, count, startLorem, html);
        }
        
        // Display result
        previewContainer.innerHTML = result;
    }
    
    // Generate standard Lorem Ipsum
    function generateStandardLoremIpsum(type, count, startLorem, html) {
        // Standard Lorem Ipsum text
        const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.";
        
        // Split into sentences
        const sentences = loremText.split(/[.!?]+/).filter(s => s.trim().length > 0).map(s => s.trim() + '.');
        
        // Split into words
        const words = loremText.split(/\s+/).filter(w => w.length > 0);
        
        let result = '';
        
        switch (type) {
            case 'paragraphs':
                result = generateParagraphsFromText(sentences, count, startLorem, html);
                break;
            case 'sentences':
                result = generateSentencesFromText(sentences, count, startLorem);
                break;
            case 'words':
                result = generateWordsFromText(words, count, startLorem);
                break;
        }
        
        return result;
    }
    
    // Generate tech jargon Lorem Ipsum
    function generateTechLoremIpsum(type, count, startLorem, html) {
        const techWords = getTechWords();
        return generateCustomText(techWords, type, count, startLorem, html, 'tech');
    }
    
    // Generate startup jargon Lorem Ipsum
    function generateStartupLoremIpsum(type, count, startLorem, html) {
        const startupWords = getStartupWords();
        return generateCustomText(startupWords, type, count, startLorem, html, 'startup');
    }
    
    // Generate custom text from word list
    function generateCustomText(wordList, type, count, startLorem, html, style) {
        let result = '';
        
        switch (type) {
            case 'paragraphs':
                result = generateCustomParagraphs(count, wordList, startLorem, style, html);
                break;
            case 'sentences':
                result = generateCustomSentences(count, wordList, startLorem, style);
                break;
            case 'words':
                result = generateCustomWords(count, wordList, startLorem, style);
                break;
        }
        
        return result;
    }
    
    // Generate paragraphs from existing text
    function generateParagraphsFromText(sentences, count, startLorem, html) {
        let paragraphs = [];
        const sentencesPerParagraph = 5;
        
        for (let i = 0; i < count; i++) {
            let paragraph = '';
            const startIndex = (i === 0 && startLorem) ? 0 : Math.floor(Math.random() * (sentences.length - sentencesPerParagraph));
            
            for (let j = 0; j < sentencesPerParagraph; j++) {
                const sentenceIndex = (startIndex + j) % sentences.length;
                paragraph += sentences[sentenceIndex] + ' ';
            }
            
            if (html) {
                paragraphs.push(`<p>${paragraph.trim()}</p>`);
            } else {
                paragraphs.push(paragraph.trim());
            }
        }
        
        return paragraphs.join(html ? '' : '\n\n');
    }
    
    // Generate sentences from existing text
    function generateSentencesFromText(sentences, count, startLorem) {
        let result = [];
        
        for (let i = 0; i < count; i++) {
            const sentenceIndex = (i === 0 && startLorem) ? 0 : Math.floor(Math.random() * sentences.length);
            result.push(sentences[sentenceIndex]);
        }
        
        return result.join(' ');
    }
    
    // Generate words from existing text
    function generateWordsFromText(words, count, startLorem) {
        let result = [];
        
        if (startLorem) {
            // Start with "Lorem ipsum dolor sit amet"
            const loremStart = "Lorem ipsum dolor sit amet".split(' ');
            result = loremStart;
            count -= loremStart.length;
        }
        
        for (let i = 0; i < count; i++) {
            const wordIndex = Math.floor(Math.random() * words.length);
            result.push(words[wordIndex]);
        }
        
        return result.join(' ');
    }
    
    // Generate custom paragraphs for tech/startup styles
    function generateCustomParagraphs(count, wordList, startLorem, style) {
        let paragraphs = [];
        
        for (let i = 0; i < count; i++) {
            // Generate 3-7 sentences per paragraph
            const sentenceCount = Math.floor(Math.random() * 5) + 3;
            let paragraph = generateCustomSentences(sentenceCount, wordList, i === 0 && startLorem, style);
            paragraphs.push(paragraph);
        }
        
        return paragraphs.join('\n\n');
    }
    
    // Generate custom sentences for tech/startup styles
    function generateCustomSentences(count, wordList, startLorem, style) {
        let sentences = [];
        
        for (let i = 0; i < count; i++) {
            // Generate 5-15 words per sentence
            const wordCount = Math.floor(Math.random() * 11) + 5;
            let sentence = '';
            
            if (i === 0 && startLorem) {
                // Start with style-specific opening
                const loremStart = getStyleStart(style);
                sentence = loremStart;
                
                // Add more words if needed
                if (wordCount > loremStart.split(' ').length) {
                    const additionalWords = generateCustomWords(wordCount - loremStart.split(' ').length, wordList, false, style);
                    sentence += ' ' + additionalWords;
                }
            } else {
                sentence = generateCustomWords(wordCount, wordList, false, style);
            }
            
            // Capitalize first letter and add period
            sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
            if (!sentence.endsWith('.')) {
                sentence += '.';
            }
            
            sentences.push(sentence);
        }
        
        return sentences.join(' ');
    }
    
    // Generate custom words for tech/startup styles
    function generateCustomWords(count, wordList, startLorem, style) {
        let words = [];
        
        // Start with style-specific opening if requested
        if (startLorem) {
            const loremStart = getStyleStart(style).split(' ');
            words = loremStart;
            count -= loremStart.length;
        }
        
        // Add random words from the word list
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            words.push(wordList[randomIndex]);
        }
        
        return words.join(' ');
    }
    
    // Get style-specific opening text
    function getStyleStart(style) {
        switch (style) {
            case 'tech':
                return 'Algorithm blockchain cloud data encryption';
            case 'startup':
                return 'Disruptive innovation ecosystem venture capital';
            default:
                return 'Lorem ipsum dolor sit amet';
        }
    }
    
    // Tech jargon word list
    function getTechWords() {
        return [
            'algorithm', 'api', 'application', 'bandwidth', 'binary', 'bit', 'blockchain', 'browser', 'buffer', 'byte',
            'cache', 'cloud', 'code', 'compiler', 'compression', 'cookie', 'cpu', 'data', 'database', 'debug',
            'deployment', 'developer', 'digital', 'domain', 'download', 'encryption', 'endpoint', 'firewall', 'framework', 'frontend',
            'gateway', 'git', 'hardware', 'hash', 'hosting', 'html', 'http', 'interface', 'internet', 'javascript',
            'kernel', 'keyboard', 'latency', 'library', 'linux', 'malware', 'memory', 'microservice', 'middleware', 'network',
            'node', 'offline', 'opensource', 'operating', 'optimization', 'packet', 'parameter', 'parser', 'password', 'platform',
            'plugin', 'processor', 'protocol', 'python', 'query', 'ram', 'repository', 'responsive', 'router', 'runtime',
            'scalability', 'script', 'server', 'software', 'source', 'stack', 'storage', 'syntax', 'system', 'terminal',
            'token', 'upload', 'validation', 'variable', 'virtual', 'virus', 'web', 'website', 'widget', 'wireless'
        ];
    }
    
    // Startup jargon word list
    function getStartupWords() {
        return [
            'accelerator', 'agile', 'angel', 'benchmark', 'bootstrapping', 'brand', 'burn', 'business', 'capital', 'conversion',
            'customer', 'deck', 'disruptive', 'ecosystem', 'entrepreneur', 'equity', 'exit', 'freemium', 'funding', 'growth',
            'hacking', 'incubator', 'innovation', 'investor', 'iteration', 'launch', 'lean', 'leverage', 'market', 'mentor',
            'metrics', 'milestone', 'minimum', 'monetization', 'mvp', 'networking', 'niche', 'pivot', 'pitch', 'platform',
            'product', 'prototype', 'revenue', 'round', 'runway', 'saas', 'scale', 'seed', 'series', 'stakeholder',
            'startup', 'strategy', 'synergy', 'target', 'traction', 'unicorn', 'user', 'valuation', 'venture', 'viral',
            'vision', 'workflow', 'actionable', 'bandwidth', 'best', 'bleeding', 'blue', 'boil', 'bottom', 'core',
            'deliverable', 'disrupt', 'drill', 'edge', 'engage', 'enterprise', 'gamification', 'ideation', 'incentivize', 'influencer',
            'innovate', 'iterate', 'mindshare', 'mission', 'optimize', 'paradigm', 'pivot', 'robust', 'seamless', 'strategic',
            'streamline', 'synergize', 'thought', 'vertical', 'wheelhouse', 'win-win'
        ];
    }
    
    // Copy generated text to clipboard
    function copyToClipboard() {
        // Get text content (without HTML tags if they're included)
        let textToCopy = '';
        
        if (includeHtml.checked) {
            // If HTML is included, we need to get the text content
            textToCopy = previewContainer.innerText;
        } else {
            textToCopy = previewContainer.textContent;
        }
        
        // Check if there's text to copy
        if (!textToCopy || textToCopy === 'Generated text will appear here.') {
            alert('Please generate text first.');
            return;
        }
        
        // Copy to clipboard
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
    
    // Initialize the page
    updateContentTypeLabel();
    
    // Generate Lorem Ipsum on page load
    generateLoremIpsum();
});
