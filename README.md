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
