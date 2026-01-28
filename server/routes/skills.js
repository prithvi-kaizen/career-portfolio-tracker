const express = require('express');
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/skills
// @desc    Get all skills for user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/skills/:id
// @desc    Get single skill
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/skills
// @desc    Create skill
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, proficiency, category, status } = req.body;

    const skill = await Skill.create({
      name,
      proficiency,
      category,
      status,
      user: req.user._id
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.json({ message: 'Skill removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
