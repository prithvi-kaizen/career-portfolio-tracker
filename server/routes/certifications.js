const express = require('express');
const Certification = require('../models/Certification');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/certifications
// @desc    Get all certifications for user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const certifications = await Certification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(certifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/certifications/:id
// @desc    Get single certification
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const certification = await Certification.findOne({ _id: req.params.id, user: req.user._id });
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    res.json(certification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/certifications
// @desc    Create certification
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, platform, completionDate, certificateLink, credentialId } = req.body;

    const certification = await Certification.create({
      name,
      platform,
      completionDate,
      certificateLink,
      credentialId,
      user: req.user._id
    });

    res.status(201).json(certification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/certifications/:id
// @desc    Update certification
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let certification = await Certification.findOne({ _id: req.params.id, user: req.user._id });

    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    certification = await Certification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(certification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/certifications/:id
// @desc    Delete certification
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const certification = await Certification.findOne({ _id: req.params.id, user: req.user._id });

    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    await Certification.findByIdAndDelete(req.params.id);

    res.json({ message: 'Certification removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
