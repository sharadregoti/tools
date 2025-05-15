document.addEventListener('DOMContentLoaded', () => {
    // DOM elements - Input
    const htmlInput = document.getElementById('html-input');
    const fileInput = document.getElementById('file-input');
    const pasteBtn = document.getElementById('paste-btn');
    const clearInputBtn = document.getElementById('clear-input-btn');
    
    // DOM elements - Options
    const sanitizeInput = document.getElementById('sanitize-input');
    const headingsOption = document.getElementById('headings-option');
    const codeBlocksOption = document.getElementById('code-blocks-option');
    const tablesOption = document.getElementById('tables-option');
    
    // DOM elements - Output
    const markdownOutput = document.getElementById('markdown-output');
    const previewContainer = document.getElementById('preview-container');
    const copyBtn = document.getElementById('copy-btn');
    const clearOutputBtn = document.getElementById('clear-output-btn');
    
    // DOM elements - Buttons
    const convertBtn = document.getElementById('convert-btn');
    
    // Initialize TurndownService
    let turndownService = new TurndownService({
        headingStyle: 'atx',
        hr: '---',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced'
    });
    
    // Sample HTML content
    const sampleHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Sample HTML Document</title>
</head>
<body>
    <h1>HTML to Markdown Converter</h1>
    <p>This is a <strong>sample</strong> HTML document to demonstrate the conversion to Markdown.</p>
    
    <h2>Features</h2>
    <ul>
        <li>Converts headings</li>
        <li>Handles <em>emphasis</em> and <strong>strong text</strong></li>
        <li>Converts lists (ordered and unordered)</li>
        <li>Preserves <a href="https://example.com">links</a></li>
    </ul>
    
    <h3>Code Example</h3>
    <pre><code>function helloWorld() {
    console.log("Hello, world!");
}
</code></pre>
    
    <h3>Table Example</h3>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>HTML</td>
                <td>HyperText Markup Language</td>
            </tr>
            <tr>
                <td>Markdown</td>
                <td>Lightweight markup language</td>
            </tr>
        </tbody>
    </table>
    
    <blockquote>
        <p>Markdown is a lightweight markup language with plain-text-formatting syntax.</p>
    </blockquote>
    
    <hr>
    
    <p>Try converting this HTML to see how it looks in Markdown!</p>
</body>
</html>`;
    
    // Event listeners
    convertBtn.addEventListener('click', convertHtmlToMarkdown);
    pasteBtn.addEventListener('click', pasteFromClipboard);
    clearInputBtn.addEventListener('click', clearInput);
    clearOutputBtn.addEventListener('click', clearOutput);
    copyBtn.addEventListener('click', copyToClipboard);
    fileInput.addEventListener('change', handleFileUpload);
    
    // Add event listeners for options
    sanitizeInput.addEventListener('change', updateTurndownOptions);
    headingsOption.addEventListener('change', updateTurndownOptions);
    codeBlocksOption.addEventListener('change', updateTurndownOptions);
    tablesOption.addEventListener('change', updateTurndownOptions);
    
    // Add drag and drop support for file input
    const dropZone = document.querySelector('.border-dashed');
    
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
        dropZone.classList.add('border-purple-500', 'bg-purple-50');
    }
    
    function unhighlight() {
        dropZone.classList.remove('border-purple-500', 'bg-purple-50');
    }
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            fileInput.files = files;
            handleFileUpload({ target: { files: files } });
        }
    }
    
    // Function to update Turndown options
    function updateTurndownOptions() {
        // Re-initialize TurndownService with current options
        turndownService = new TurndownService({
            headingStyle: 'atx',
            hr: '---',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced'
        });
        
        // Add table support if enabled
        if (tablesOption.checked) {
            turndownService.addRule('tables', {
                filter: ['table'],
                replacement: function(content, node) {
                    // This is a simplified table conversion
                    // For complex tables, you might want to use a more robust solution
                    const rows = Array.from(node.querySelectorAll('tr'));
                    
                    if (rows.length === 0) return '';
                    
                    const headerRow = rows[0];
                    const bodyRows = rows.slice(1);
                    
                    // Process header row
                    const headers = Array.from(headerRow.querySelectorAll('th,td')).map(cell => {
                        return cell.textContent.trim();
                    });
                    
                    // Create header line
                    let markdown = '| ' + headers.join(' | ') + ' |\n';
                    
                    // Create separator line
                    markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
                    
                    // Process body rows
                    bodyRows.forEach(row => {
                        const cells = Array.from(row.querySelectorAll('td')).map(cell => {
                            return cell.textContent.trim();
                        });
                        markdown += '| ' + cells.join(' | ') + ' |\n';
                    });
                    
                    return markdown;
                }
            });
        }
        
        // Disable headings conversion if not enabled
        if (!headingsOption.checked) {
            turndownService.remove('headings');
        }
        
        // Disable code blocks conversion if not enabled
        if (!codeBlocksOption.checked) {
            turndownService.remove('fencedCodeBlock');
            turndownService.remove('codeBlock');
        }
    }
    
    // Function to convert HTML to Markdown
    function convertHtmlToMarkdown() {
        let html = htmlInput.value.trim();
        
        if (!html) {
            alert('Please enter some HTML content first.');
            return;
        }
        
        try {
            // Sanitize HTML if option is checked
            if (sanitizeInput.checked) {
                html = DOMPurify.sanitize(html);
            }
            
            // Convert HTML to Markdown
            const markdown = turndownService.turndown(html);
            
            // Display the result
            markdownOutput.value = markdown;
            
            // Update preview
            updatePreview(markdown);
        } catch (error) {
            console.error('Conversion error:', error);
            markdownOutput.value = 'Error converting HTML to Markdown: ' + error.message;
        }
    }
    
    // Function to update the preview
    function updatePreview(markdown) {
        // This function updates the preview container with the converted Markdown
        
        // Note: For a full-featured Markdown preview, you would typically:
        // 1. Use a Markdown parser like marked.js to convert Markdown to HTML
        // 2. Apply styling to the HTML to make it look like rendered Markdown
        // 3. Sanitize the HTML to prevent XSS attacks
        
        // In this simplified version, we're just displaying the raw Markdown text
        // with basic formatting to preserve whitespace and line breaks
        
        // The whitespace-pre-wrap class ensures that whitespace and line breaks are preserved
        // while still allowing the text to wrap within the container
        previewContainer.innerHTML = `<pre class="whitespace-pre-wrap">${escapeHtml(markdown)}</pre>`;
        
        // For a more advanced implementation, you could:
        // 1. Add syntax highlighting for code blocks
        // 2. Render tables as HTML tables
        // 3. Convert links to clickable anchors
        // 4. Show images inline
        // 5. Add a toggle between raw Markdown and rendered HTML view
    }
    
    // Helper function to escape HTML for preview
    function escapeHtml(text) {
        // This function safely escapes HTML special characters to prevent
        // any HTML in the Markdown from being interpreted as actual HTML
        // This is important for security (prevents XSS) and for displaying
        // HTML tags as text rather than rendering them
        
        // Create a temporary div element
        const div = document.createElement('div');
        
        // Set its text content to the input text
        // This automatically escapes HTML special characters
        div.textContent = text;
        
        // Return the escaped HTML
        return div.innerHTML;
        
        // Alternative implementation using string replacement:
        // return text
        //     .replace(/&/g, "&amp;")
        //     .replace(/</g, "&lt;")
        //     .replace(/>/g, "&gt;")
        //     .replace(/"/g, "&quot;")
        //     .replace(/'/g, "&#039;");
    }
    
    // Function to paste from clipboard
    function pasteFromClipboard() {
        navigator.clipboard.readText()
            .then(text => {
                htmlInput.value = text;
            })
            .catch(err => {
                console.error('Failed to read clipboard:', err);
                alert('Failed to read from clipboard. Please paste manually.');
            });
    }
    
    // Function to handle file upload
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Check if it's an HTML file
        if (!file.name.toLowerCase().endsWith('.html') && !file.name.toLowerCase().endsWith('.htm')) {
            alert('Please select an HTML file (.html or .htm)');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            htmlInput.value = e.target.result;
        };
        reader.onerror = function() {
            alert('Error reading file');
        };
        reader.readAsText(file);
    }
    
    // Function to clear input
    function clearInput() {
        htmlInput.value = '';
    }
    
    // Function to clear output
    function clearOutput() {
        markdownOutput.value = '';
        previewContainer.innerHTML = '';
    }
    
    // Function to copy to clipboard
    function copyToClipboard() {
        const text = markdownOutput.value;
        
        if (!text) {
            alert('No Markdown to copy.');
            return;
        }
        
        navigator.clipboard.writeText(text)
            .then(() => {
                // Change button text temporarily
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('bg-green-600');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.remove('bg-green-600');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy to clipboard. Please try again.');
            });
    }
    
    // Initialize with sample HTML
    htmlInput.placeholder = "Paste or type HTML here...\n\nExample:\n" + sampleHtml.substring(0, 300) + "...";
    
    // Initialize Turndown options
    updateTurndownOptions();
});
