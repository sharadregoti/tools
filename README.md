# Tools Collection

A collection of useful web-based tools for developers and users.

## Available Tools

### 1. JSON to YAML Converter

A simple, fast, and free online tool to convert JSON data to YAML format.

- **Features**:
  - Clean, responsive interface
  - JSON validation
  - Error handling
  - Copy to clipboard functionality
  - Sample JSON data
  - SEO-friendly

### 2. YAML to JSON Converter

A simple, fast, and free online tool to convert YAML data to JSON format.

- **Features**:
  - Clean, responsive interface
  - YAML validation
  - Error handling
  - Copy to clipboard functionality
  - Sample YAML data
  - SEO-friendly

### 3. Random JSON Generator

A configurable tool to generate random JSON data for testing and development purposes.

- **Features**:
  - Configurable number of top-level fields
  - Adjustable nesting level
  - Customizable array length and string length
  - Option to include/exclude specific data types
  - Error handling
  - Copy to clipboard functionality
  - SEO-friendly

### 4. Random YAML Generator

A configurable tool to generate random YAML data for testing and development purposes.

- **Features**:
  - Configurable number of top-level fields
  - Adjustable nesting level
  - Customizable array length and string length
  - Option to include/exclude specific data types
  - YAML style options (flow style or block style)
  - Error handling
  - Copy to clipboard functionality
  - SEO-friendly

### 5. Random Password Generator

A secure tool to generate strong, customizable passwords for your accounts and applications.

- **Features**:
  - Adjustable password length (5-128 characters)
  - Character type selection (uppercase, lowercase, numbers, special characters)
  - Minimum requirements for numbers and special characters
  - Option to avoid ambiguous characters
  - Password strength indicator
  - Real-time password generation
  - Copy to clipboard functionality
  - Security tips and best practices
  - SEO-friendly

### 6. Image Cropper

A simple tool to crop and adjust images directly in your browser.

- **Features**:
  - Upload images via drag & drop, file selection, or clipboard paste
  - Multiple aspect ratio options (free, 1:1, 4:3, 16:9, 2:3)
  - Rotate image functionality
  - Zoom and pan capabilities
  - High-quality image output
  - Download cropped images
  - Client-side processing (no server uploads)
  - Mobile-friendly interface
  - SEO-friendly

### 7. UUID Generator

Generate Universally Unique Identifiers (UUID v4) instantly.

- **Features**:
  - Adjustable count (generate multiple UUIDs at once)
  - Option for hyphenated or non-hyphenated format
  - Copy individual UUIDs to clipboard
  - Copy all generated UUIDs to clipboard
  - SEO-friendly

### 8. Base64 Encoder/Decoder

Convert text and files to/from Base64 format.

- **Features**:
  - Text encoding and decoding
  - File encoding and decoding
  - Drag and drop file support
  - Auto-detection of valid Base64 input
  - Copy results to clipboard
  - Download decoded files
  - SEO-friendly

### 9. Lorem Ipsum Generator

Generate dummy text for your designs, layouts, and mockups.

- **Features**:
  - Generate paragraphs, sentences, or words
  - Choose between different text styles (standard Lorem Ipsum, tech jargon, startup buzzwords)
  - Option to start with the classic "Lorem ipsum dolor sit amet"
  - Include HTML tags for easy integration into web projects
  - Copy to clipboard functionality
  - SEO-friendly

### 10. Case Converter

Convert text between different case formats.

- **Features**:
  - Convert to camelCase, snake_case, kebab-case, PascalCase
  - Convert to UPPERCASE, lowercase, Title Case, Sentence case
  - Convert to CONSTANT_CASE
  - Real-time conversion as you type
  - Keyboard shortcut for quick copying (Ctrl+Shift+C)
  - Intelligent handling of various input formats
  - SEO-friendly

### 11. URL Encoder/Decoder

Encode and decode URLs and query parameters.

- **Features**:
  - Component encoding/decoding (encodeURIComponent/decodeURIComponent)
  - URI encoding/decoding (encodeURI/decodeURI)
  - Live input/output update
  - Special characters reference table
  - Copy to clipboard functionality
  - Clear UX for special characters
  - SEO-friendly

### 12. Markdown Previewer

Preview Markdown in real-time with GitHub Flavored Markdown support.

- **Features**:
  - Live preview while typing
  - Support for GitHub Flavored Markdown
  - Dark/light mode toggle
  - Export to HTML or PDF
  - Comprehensive Markdown syntax guide
  - Keyboard shortcuts for common actions
  - Sample content to get started
  - SEO-friendly

### 13. HTML to Markdown Converter

Convert HTML content to clean, readable Markdown format.

- **Features**:
  - Paste, upload, or type HTML content
  - File upload with drag and drop support
  - Option to sanitize HTML input
  - Configurable conversion options (headings, code blocks, tables)
  - Preview of converted Markdown
  - Copy to clipboard functionality
  - Detailed explanation of conversion features
  - SEO-friendly

## Technologies Used

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript
- js-yaml library

## How to Use

### Local Usage
1. Open the main index.html file in your browser
2. Select the tool you want to use
3. Follow the instructions on the tool's page

### Live Version
You can access the live version of these tools at:
https://sharadregoti.github.io/tools/

## Development

Each tool is contained in its own directory with the following structure:

```
tool-name/
  ├── index.html
  └── script.js
```

To add a new tool, create a new directory with the appropriate files and update the main index.html file to include a link to the new tool.

## Deployment

This project is deployed using GitHub Pages. The live version is available at:
https://sharadregoti.github.io/tools/

### Deployment Process

1. The site is deployed from the `gh-pages` branch of the repository
2. Any changes pushed to this branch will be automatically deployed

### Updating the Live Site

To update the live site after making changes:

1. Make your changes to the code
2. Commit and push to the master branch:
   ```
   git add .
   git commit -m "Your commit message"
   git push origin master
   ```
3. Update the gh-pages branch:
   ```
   git checkout gh-pages
   git merge master
   git push origin gh-pages
   git checkout master
   ```

This process ensures that your live site stays in sync with your latest development changes.
