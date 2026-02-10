const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const File = require('../models/File');
const Counter = require('../models/Counter');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Save with unique name to prevent overwrite
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// @route   POST api/files/upload
// @desc    Upload a file
// @access  Private
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const { displayName, date } = req.body;

    // Generate Sequential GR Number
    // Find and increment the counter, or create if not exists
    const counter = await Counter.findOneAndUpdate(
      { id: 'grNumber' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // upsert: create if not exists, new: return updated doc
    );

    // Format to 3 digits (e.g., 001, 002, 010, 100)
    // You can adjust '3' to more digits if needed (e.g., padStart(6, '0') for 000001)
    const grNumber = String(counter.seq).padStart(3, '0');

    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      displayName: displayName || req.file.originalname,
      grNumber: grNumber,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path,
      userSelectedDate: date ? new Date(date) : Date.now(),
      owner: req.user.id
    });

    const file = await newFile.save();
    res.json(file);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/files
// @desc    Get all files for user (with filters)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { search, date } = req.query;
    let query = { owner: req.user.id };

    if (search) {
      // Search by display name or GR number
      query.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { grNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (date) {
      // Filter by user selected date (ignoring time for broad match or exact day)
      // Assuming 'date' comes as YYYY-MM-DD
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.userSelectedDate = { $gte: start, $lte: end };
    }

    const files = await File.find(query).sort({ uploadDate: -1 });
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/files/:id
// @desc    Get file info
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: 'File not found' });
    if (file.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(file);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/files/:id/content
// @desc    Serve file content (for preview)
// @access  Private
// NOTE: For better security, we check token here too.
// Since it's a direct link, we might need a token in query param or header.
// For simplicity in this "website" context, we'll assume the frontend sends the header via XHR for preview,
// OR if using img src, we might need a cookie or a signed URL.
// For this MVP, let's assume we fetch blob via axios and display it, so auth header works.
// Or we can allow a query param token.
router.get('/:id/content', async (req, res) => {
    try {
        const token = req.query.token || req.header('x-auth-token');
        if(!token) return res.status(401).send('No token');
        
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).send('File not found');
        if (file.owner.toString() !== userId) {
            return res.status(401).send('Not authorized');
        }

        const filePath = path.join(__dirname, '../', file.path);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found on server');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/files/:id
// @desc    Delete file
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: 'File not found' });
    if (file.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Delete from FS
    const filePath = path.join(__dirname, '../', file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.findByIdAndDelete(req.params.id);
    res.json({ msg: 'File removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
