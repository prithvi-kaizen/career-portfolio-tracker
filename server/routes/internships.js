const express = require('express');
const Internship = require('../models/Internship');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/internships
// @desc    Get all internships for user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/internships/:id
// @desc    Get single internship
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findOne({ _id: req.params.id, user: req.user._id });
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json(internship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/internships
// @desc    Create internship
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { company, role, startDate, endDate, status, skills, notes } = req.body;

    const internship = await Internship.create({
      company,
      role,
      startDate,
      endDate,
      status,
      skills,
      notes,
      user: req.user._id
    });

    res.status(201).json(internship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/internships/:id
// @desc    Update internship
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let internship = await Internship.findOne({ _id: req.params.id, user: req.user._id });

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(internship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/internships/:id
// @desc    Delete internship
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const internship = await Internship.findOne({ _id: req.params.id, user: req.user._id });

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    await Internship.findByIdAndDelete(req.params.id);

    res.json({ message: 'Internship removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
