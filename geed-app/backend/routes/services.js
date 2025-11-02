const express = require('express');
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const db = require('../utils/dbAdapter');

const router = express.Router();

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      category: req.query.category,
      search: req.query.search
    };

    const result = await db.getAllServices(options);

    res.status(200).json({
      success: true,
      count: result.services.length,
      total: result.total,
      page: result.page,
      pages: result.pages,
      services: result.services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).populate('createdBy', 'name email');
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('shortDescription')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Short description must be between 10 and 200 characters'),
  body('category')
    .isIn(['consulting', 'technology', 'support', 'training', 'marketing', 'other'])
    .withMessage('Invalid category'),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const serviceData = {
      ...req.body,
      createdBy: req.user.id
    };

    const service = await Service.create(serviceData);
    await service.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Short description must be between 10 and 200 characters'),
  body('category')
    .optional()
    .isIn(['consulting', 'technology', 'support', 'training', 'marketing', 'other'])
    .withMessage('Invalid category'),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get service categories
// @route   GET /api/services/categories/list
// @access  Public
router.get('/categories/list', (req, res) => {
  const categories = [
    { value: 'consulting', label: 'Consulting Services' },
    { value: 'technology', label: 'Technology Solutions' },
    { value: 'support', label: 'Customer Support' },
    { value: 'training', label: 'Training & Development' },
    { value: 'marketing', label: 'Marketing & Branding' },
    { value: 'other', label: 'Other Services' }
  ];

  res.status(200).json({
    success: true,
    categories
  });
});

module.exports = router;