// Class names mapping (same as in predict.py)
const CLASS_NAMES = [
    "coral", "crab", "diver", "eel", "fish",
    "fishInGroups", "flatworm", "jellyfish", "marine_dolphin", "octopus",
    "rayfish", "seaAnemone", "seaCucumber", "seaSlug", "seaUrchin",
    "shark", "shrimp", "squid", "starfish", "turtle"
];

// DOM elements
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const result = document.getElementById('result');
const loading = document.getElementById('loading');
const predictedClass = document.getElementById('predictedClass');
const confidence = document.getElementById('confidence');

// Handle file upload
imageInput.addEventListener('change', handleImageUpload);

// Handle drag and drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    preview.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    preview.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    preview.addEventListener(eventName, unhighlight, false);
});

preview.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    preview.style.borderColor = '#667eea';
    preview.style.backgroundColor = '#f0f4ff';
}

function unhighlight() {
    preview.style.borderColor = '#bdc3c7';
    preview.style.backgroundColor = '#f8f9fa';
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleImageUpload(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            displayImage(file);
            predictImage(file);
        } else {
            alert('Please select a valid image file.');
        }
    }
}

function displayImage(file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.onload = () => URL.revokeObjectURL(img.src);

    preview.innerHTML = '';
    preview.appendChild(img);
}

async function predictImage(file) {
    // Show loading
    loading.style.display = 'block';
    result.style.display = 'none';

    try {
        // Create FormData
        const formData = new FormData();
        formData.append('image', file);

        // Send to backend
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Prediction failed');
        }

        const data = await response.json();

        // Display results
        predictedClass.textContent = data.class_name;
        confidence.textContent = `${data.confidence}%`;

        result.style.display = 'block';

    } catch (error) {
        console.error('Error:', error);
        alert('Error making prediction. Please try again.');
    } finally {
        loading.style.display = 'none';
    }
}
