const express = require('express');
const { check, validationResult } = require('express-validator');
const {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    reorderTodos
} = require('../controllers/todoController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMsg = errors.array().map(err => err.msg).join(', ');
        return res.status(400).json({ success: false, error: errorMsg });
    }
    return next();
};

router.use(protect);

router.put('/reorder', reorderTodos);

router
    .route('/')
    .get(getTodos)
    .post(
        check('title', 'Title is required').not().isEmpty(),
        check('title', 'Title cannot be more than 100 characters').isLength({ max: 100 }),
        validate,
        createTodo
    );

router
    .route('/:id')
    .get(getTodo)
    .put(updateTodo)
    .delete(deleteTodo);

module.exports = router;
