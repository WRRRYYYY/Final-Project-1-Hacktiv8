const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { create,getAll,update,remove} = require('../controllers/reflectionController')
router.use(authMiddleware)
// Create a new reflection
router.post('/', authMiddleware,create)

// Get all reflections of the logged-in user
router.get('/', authMiddleware, getAll)

// Update a reflection of the logged-in user
router.put('/:id', authMiddleware, update)

// Delete a reflection of the logged-in user
router.delete('/:id', authMiddleware, remove)

module.exports = router;