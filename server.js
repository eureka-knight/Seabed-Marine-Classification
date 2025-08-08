const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const PYTHON_COMMAND = process.env.PYTHON_COMMAND || 'python';

// Enable CORS
app.use(cors({ origin: '*' }));

// Serve frontend files (optional)
app.use(express.static('.'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Prediction route
app.post('/predict', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imagePath = req.file.path;

    try {
        const result = await runPythonPrediction(imagePath);
        console.log(result)
        const parsed = parsePrediction(result);
        console.log(parsed)

        // Clean up the uploaded image
        fs.unlink(imagePath, (err) => {
            if (err) console.warn('⚠️ Failed to delete uploaded image:', err);
        });

        if (!parsed) {
            return res.status(500).json({ error: 'Failed to parse prediction output' });
        }

        return res.json({
            class_name: parsed.className,
            class_index: parsed.classIndex,
            confidence: parsed.confidence
        });

    } catch (err) {
        fs.unlink(imagePath, () => { }); // Attempt delete even on error
        console.error('❌ Prediction error:', err.message);
        return res.status(500).json({ error: 'Prediction failed', details: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] 🚀 Server is running at http://localhost:${PORT}`);
});

// Run Python script and return output
function runPythonPrediction(imagePath) {
    return new Promise((resolve, reject) => {
        const process = spawn(PYTHON_COMMAND, ['predict.py', imagePath]);

        let output = '';
        let error = '';

        process.stdout.on('data', (data) => {
            output += data.toString();
        });

        process.stderr.on('data', (data) => {
            error += data.toString();
        });

        process.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(error || 'Unknown error from Python script'));
            }
            resolve(output.trim());
        });
    });
}

// Parse output from Python
function parsePrediction(output) {
    const classMatch = output.match(/Predicted Class:\s*(.+?)\s*\(Class\s*(\d+)\)/);
    const confidenceMatch = output.match(/Confidence:\s*([\d.]+)%?/);

    if (!classMatch || !confidenceMatch) {
        console.error('❌ Could not extract prediction:', output);
        return null;
    }

    return {
        className: classMatch[1].trim(),
        classIndex: parseInt(classMatch[2], 10),
        confidence: parseFloat(confidenceMatch[1]).toFixed(2)
    };
}

