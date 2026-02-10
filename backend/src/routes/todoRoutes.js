const express = require('express');
const { check, validationResult } = require('express-validator');
const {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// All routes after this middleware are protected
router.use(protect);

router
    .route('/')
    .get(getTodos)
    .post(
        [
            check('title', 'Title is required').not().isEmpty(),
            check('title', 'Title cannot be more than 100 characters').isLength({ max: 100 }),
            validate
        ],
        createTodo
    );

router
    .route('/:id')
    .get(getTodo)
    .put(updateTodo)
    .delete(deleteTodo);

module.exports = router;
