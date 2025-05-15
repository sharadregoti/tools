document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const uploadSection = document.getElementById('uploadSection');
    const cropperSection = document.getElementById('cropperSection');
    const resultSection = document.getElementById('resultSection');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const preview = document.getElementById('preview');
    
    const aspectRatioOptions = document.querySelectorAll('.aspect-ratio-option');
    const cropBtn = document.getElementById('cropBtn');
    const rotateLeftBtn = document.getElementById('rotateLeftBtn');
    const rotateRightBtn = document.getElementById('rotateRightBtn');
    const resetBtn = document.getElementById('resetBtn');
    const newImageBtn = document.getElementById('newImageBtn');
    
    const croppedImage = document.getElementById('croppedImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const cropAnotherBtn = document.getElementById('cropAnotherBtn');
    const uploadAnotherBtn = document.getElementById('uploadAnotherBtn');
    
    // Variables
    let cropper = null;
    let originalImage = null;
    
    // Initialize
    init();
    
    // Initialize function
    function init() {
        // Set up event listeners
        setupEventListeners();
        
        // Set "Free" as the default aspect ratio
        aspectRatioOptions[0].classList.add('active');
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // File input change
        fileInput.addEventListener('change', handleFileSelect);
        
        // Select file button click
        selectFileBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Dropzone click
        dropzone.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Drag and drop events
        dropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', function() {
            dropzone.classList.remove('dragover');
        });
        
        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                handleFile(e.dataTransfer.files[0]);
            }
        });
        
        // Paste from clipboard
        document.addEventListener('paste', function(e) {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    handleFile(blob);
                    break;
                }
            }
        });
        
        // Aspect ratio options
        aspectRatioOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                aspectRatioOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Set aspect ratio
                const ratio = this.getAttribute('data-ratio');
                
                if (cropper) {
                    if (ratio === 'free') {
                        cropper.setAspectRatio(NaN);
                    } else {
                        const [numerator, denominator] = ratio.split('/');
                        cropper.setAspectRatio(numerator / denominator);
                    }
                }
            });
        });
        
        // Crop button
        cropBtn.addEventListener('click', cropImage);
        
        // Rotate buttons
        rotateLeftBtn.addEventListener('click', function() {
            cropper.rotate(-90);
        });
        
        rotateRightBtn.addEventListener('click', function() {
            cropper.rotate(90);
        });
        
        // Reset button
        resetBtn.addEventListener('click', function() {
            cropper.reset();
        });
        
        // New image button
        newImageBtn.addEventListener('click', resetTool);
        
        // Crop another button
        cropAnotherBtn.addEventListener('click', function() {
            resultSection.classList.add('hidden');
            cropperSection.classList.remove('hidden');
        });
        
        // Upload another button
        uploadAnotherBtn.addEventListener('click', resetTool);
    }
    
    // Handle file select
    function handleFileSelect(e) {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    }
    
    // Handle file
    function handleFile(file) {
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showError('Please select an image file.');
            return;
        }
        
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showError('Image size should be less than 10MB.');
            return;
        }
        
        // Create file reader
        const reader = new FileReader();
        
        // File reader load event
        reader.onload = function(e) {
            // Store original image for reset
            originalImage = e.target.result;
            
            // Set preview image source
            preview.src = e.target.result;
            
            // Show cropper section
            uploadSection.classList.add('hidden');
            cropperSection.classList.remove('hidden');
            resultSection.classList.add('hidden');
            
            // Initialize cropper
            initCropper();
        };
        
        // Read file as data URL
        reader.readAsDataURL(file);
    }
    
    // Initialize cropper
    function initCropper() {
        // Destroy existing cropper if any
        if (cropper) {
            cropper.destroy();
        }
        
        // Get active aspect ratio
        let aspectRatio = NaN;
        const activeOption = document.querySelector('.aspect-ratio-option.active');
        
        if (activeOption) {
            const ratio = activeOption.getAttribute('data-ratio');
            
            if (ratio !== 'free') {
                const [numerator, denominator] = ratio.split('/');
                aspectRatio = numerator / denominator;
            }
        }
        
        // Initialize cropper
        cropper = new Cropper(preview, {
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: aspectRatio,
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false
        });
    }
    
    // Crop image
    function cropImage() {
        if (!cropper) {
            showError('Please upload an image first.');
            return;
        }
        
        try {
            // Get cropped canvas
            const canvas = cropper.getCroppedCanvas({
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            });
            
            if (!canvas) {
                showError('Failed to crop the image. Please try again.');
                return;
            }
            
            // Convert canvas to data URL
            const croppedImageUrl = canvas.toDataURL('image/png');
            
            // Set cropped image source
            croppedImage.src = croppedImageUrl;
            
            // Set download link
            downloadBtn.href = croppedImageUrl;
            
            // Show result section
            cropperSection.classList.add('hidden');
            resultSection.classList.remove('hidden');
        } catch (error) {
            showError('An error occurred while cropping the image: ' + error.message);
        }
    }
    
    // Reset tool
    function resetTool() {
        // Reset file input
        fileInput.value = '';
        
        // Destroy cropper if any
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        
        // Reset preview image
        preview.src = '';
        
        // Reset cropped image
        croppedImage.src = '';
        
        // Reset download link
        downloadBtn.href = '#';
        
        // Show upload section
        uploadSection.classList.remove('hidden');
        cropperSection.classList.add('hidden');
        resultSection.classList.add('hidden');
        
        // Hide error message
        hideError();
    }
    
    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(hideError, 5000);
    }
    
    // Hide error message
    function hideError() {
        errorContainer.classList.add('hidden');
    }
});
