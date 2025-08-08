const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Prediction endpoint
app.post('/predict', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    
    // Spawn Python process for prediction
    const pythonProcess = spawn('python', ['predict.py', imagePath]);
    
    let output = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
    });

    pythonProcess.on('close', (code) => {
        // Clean up uploaded file
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        if (code !== 0) {
            console.error('Python error:', error);
            return res.status(500).json({ error: 'Prediction failed', details: error });
        }

        try {
            // Parse the output from predict.py
            const lines = output.trim().split('\n');
            const lastLine = lines[lines.length - 1];
            
            // Extract class name from output like "Predicted Class: coral (Class 0)"
            const match = lastLine.match(/Predicted Class: (.+?) \(Class (\d+)\)/);
            if (match) {
                const className = match[1];
                const classIndex = parseInt(match[2]);
                
                res.json({
                    class_name: className,
                    class_index: classIndex,
                    confidence: 0.95 // Mock confidence since predict.py doesn't output it
                });
            } else {
                res.status(500).json({ error: 'Could not parse prediction result' });
            }
        } catch (parseError) {
            res.status(500).json({ error: 'Error parsing prediction result', details: parseError.message });
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Seabed classification API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Upload images to http://localhost:3000 for classification');
});
