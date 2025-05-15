document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const markdownInput = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const clearBtn = document.getElementById('clear-btn');
    const exportHtmlBtn = document.getElementById('export-html-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Theme elements
    const body = document.getElementById('body');
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    const editorContainer = document.getElementById('editor-container');
    const previewContainer = document.getElementById('preview-container');
    const guideContainer = document.getElementById('guide-container');
    
    // Initialize marked.js with GitHub Flavored Markdown
    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true,
        mangle: false,
        highlight: function(code, lang) {
            // You could add syntax highlighting here with a library like Prism.js
            return code;
        }
    });
    
    // Sample markdown content
    const sampleMarkdown = `# Welcome to the Markdown Previewer

## GitHub Flavored Markdown

This previewer supports [GitHub Flavored Markdown](https://github.github.com/gfm/).

### Basic Formatting

You can make text **bold**, *italic*, or ~~strikethrough~~.

### Lists

Unordered list:
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

Ordered list:
1. First item
2. Second item
3. Third item

Task list:
- [x] Completed task
- [ ] Incomplete task

### Code

Inline code: \`const greeting = "Hello, world!";\`

Code block:
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('World'));
\`\`\`

### Tables

| Syntax | Description |
| ------ | ----------- |
| Header | Title |
| Paragraph | Text |

### Blockquotes

> This is a blockquote.
>
> It can span multiple lines.

### Images

![Markdown Logo](https://markdown-here.com/img/icon256.png)

### Links

[Visit GitHub](https://github.com)

---

## Export Options

You can export this preview as HTML or PDF using the buttons above.

<details>
<summary>Click to expand</summary>
This content is hidden by default.
</details>

Enjoy using the Markdown Previewer! :rocket:
`;
    
    // Set initial markdown content
    markdownInput.value = sampleMarkdown;
    
    // Initial render
    renderMarkdown();
    
    // Event listeners
    markdownInput.addEventListener('input', renderMarkdown);
    clearBtn.addEventListener('click', clearMarkdown);
    exportHtmlBtn.addEventListener('click', exportHtml);
    exportPdfBtn.addEventListener('click', exportPdf);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Function to render markdown
    function renderMarkdown() {
        const markdown = markdownInput.value;
        // Convert markdown to HTML and sanitize
        const html = DOMPurify.sanitize(marked.parse(markdown));
        preview.innerHTML = html;
    }
    
    // Function to clear markdown
    function clearMarkdown() {
        if (confirm('Are you sure you want to clear the editor?')) {
            markdownInput.value = '';
            renderMarkdown();
        }
    }
    
    // Function to export as HTML
    function exportHtml() {
        const markdown = markdownInput.value;
        if (!markdown.trim()) {
            alert('Please enter some markdown content first.');
            return;
        }
        
        // Convert markdown to HTML
        const html = DOMPurify.sanitize(marked.parse(markdown));
        
        // Create a full HTML document
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Export</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
        }
        @media (max-width: 767px) {
            .markdown-body {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="markdown-body">
        ${html}
    </div>
</body>
</html>`;
        
        // Create a Blob and download
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-export.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Function to export as PDF
    function exportPdf() {
        const markdown = markdownInput.value;
        if (!markdown.trim()) {
            alert('Please enter some markdown content first.');
            return;
        }
        
        // Show loading indicator
        const originalText = exportPdfBtn.textContent;
        exportPdfBtn.textContent = 'Generating PDF...';
        exportPdfBtn.disabled = true;
        
        // Create a temporary container for PDF export
        const tempContainer = document.createElement('div');
        tempContainer.className = 'markdown-body';
        tempContainer.style.padding = '20px';
        tempContainer.style.maxWidth = '800px';
        tempContainer.style.margin = '0 auto';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.color = 'black';
        tempContainer.innerHTML = DOMPurify.sanitize(marked.parse(markdown));
        
        // Temporarily append to document but hide it
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        document.body.appendChild(tempContainer);
        
        // Configure PDF options
        const options = {
            margin: [10, 10, 10, 10],
            filename: 'markdown-export.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Generate PDF
        html2pdf().from(tempContainer).set(options).save().then(() => {
            // Clean up
            document.body.removeChild(tempContainer);
            exportPdfBtn.textContent = originalText;
            exportPdfBtn.disabled = false;
        }).catch(error => {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
            document.body.removeChild(tempContainer);
            exportPdfBtn.textContent = originalText;
            exportPdfBtn.disabled = false;
        });
    }
    
    // Function to toggle dark/light mode
    function toggleTheme() {
        const isDarkMode = body.classList.toggle('dark-mode');
        
        if (isDarkMode) {
            // Apply dark mode styles
            body.style.backgroundColor = '#1a1a1a';
            header.style.backgroundColor = '#2c3e50';
            footer.style.backgroundColor = '#2c3e50';
            editorContainer.style.backgroundColor = '#2d2d2d';
            editorContainer.style.color = '#e0e0e0';
            previewContainer.style.backgroundColor = '#2d2d2d';
            previewContainer.style.color = '#e0e0e0';
            guideContainer.style.backgroundColor = '#2d2d2d';
            guideContainer.style.color = '#e0e0e0';
            markdownInput.style.backgroundColor = '#3d3d3d';
            markdownInput.style.color = '#e0e0e0';
            markdownInput.style.borderColor = '#555';
            preview.style.backgroundColor = '#3d3d3d';
            preview.style.color = '#e0e0e0';
            preview.style.borderColor = '#555';
            
            // Add GitHub dark mode CSS
            const existingLink = document.querySelector('link[href*="github-markdown-css"]');
            if (existingLink) {
                existingLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-dark.min.css';
            }
            
            // Update theme toggle button
            themeToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light Mode
            `;
            themeToggle.classList.remove('text-blue-700', 'bg-white');
            themeToggle.classList.add('text-yellow-400', 'bg-gray-800');
        } else {
            // Apply light mode styles
            body.style.backgroundColor = '';
            header.style.backgroundColor = '';
            footer.style.backgroundColor = '';
            editorContainer.style.backgroundColor = '';
            editorContainer.style.color = '';
            previewContainer.style.backgroundColor = '';
            previewContainer.style.color = '';
            guideContainer.style.backgroundColor = '';
            guideContainer.style.color = '';
            markdownInput.style.backgroundColor = '';
            markdownInput.style.color = '';
            markdownInput.style.borderColor = '';
            preview.style.backgroundColor = '';
            preview.style.color = '';
            preview.style.borderColor = '';
            
            // Restore GitHub light mode CSS
            const existingLink = document.querySelector('link[href*="github-markdown-css"]');
            if (existingLink) {
                existingLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css';
            }
            
            // Update theme toggle button
            themeToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark Mode
            `;
            themeToggle.classList.remove('text-yellow-400', 'bg-gray-800');
            themeToggle.classList.add('text-blue-700', 'bg-white');
        }
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+S or Cmd+S to export as HTML
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            exportHtml();
        }
        
        // Ctrl+P or Cmd+P to export as PDF
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            exportPdf();
        }
    });
});
