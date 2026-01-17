import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { identifyBrick } from './services/visionService.js';
import { searchParts, getPartDetails, getSetsWithPart } from './services/rebrickableService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: "Papa's Brick Builder is running! 🧱" });
});

// Identify LEGO brick from uploaded image
app.post('/api/identify', upload.single('image'), async (req, res) => {
  try {
    if (!req.file && !req.body.imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    let imageData;
    let mediaType;

    if (req.file) {
      imageData = req.file.buffer.toString('base64');
      mediaType = req.file.mimetype;
    } else {
      // Handle base64 image from camera capture
      const base64Data = req.body.imageBase64;
      const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        mediaType = matches[1];
        imageData = matches[2];
      } else {
        mediaType = 'image/jpeg';
        imageData = base64Data;
      }
    }

    console.log('🔍 Identifying LEGO brick...');
    const identification = await identifyBrick(imageData, mediaType);

    console.log('✅ Brick identified:', identification);
    res.json(identification);
  } catch (error) {
    console.error('Error identifying brick:', error);
    res.status(500).json({ error: 'Failed to identify brick', details: error.message });
  }
});

// Search for LEGO parts by name/description
app.get('/api/parts/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const parts = await searchParts(query);
    res.json(parts);
  } catch (error) {
    console.error('Error searching parts:', error);
    res.status(500).json({ error: 'Failed to search parts', details: error.message });
  }
});

// Get details for a specific part
app.get('/api/parts/:partNum', async (req, res) => {
  try {
    const { partNum } = req.params;
    const details = await getPartDetails(partNum);
    res.json(details);
  } catch (error) {
    console.error('Error getting part details:', error);
    res.status(500).json({ error: 'Failed to get part details', details: error.message });
  }
});

// Get sets that contain a specific part
app.get('/api/parts/:partNum/sets', async (req, res) => {
  try {
    const { partNum } = req.params;
    const sets = await getSetsWithPart(partNum);
    res.json(sets);
  } catch (error) {
    console.error('Error getting sets:', error);
    res.status(500).json({ error: 'Failed to get sets', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`
  🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱

     Papa's Brick Builder Server
     Running on port ${PORT}

     Ready to identify LEGO bricks! 🔍

  🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱
  `);
});
