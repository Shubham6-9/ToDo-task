const mongoose = require('mongoose');
const Todo = require('../models/Todo');

exports.getTodos = async (req, res, next) => {
    try {
        const { status, search } = req.query;

        let query = { user: req.user.id };

        if (status) {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const todos = await Todo.find(query).sort({ serialNumber: 1 });

        res.status(200).json({
            success: true,
            count: todos.length,
            data: todos
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                error: `Todo not found with id of ${req.params.id}`
            });
        }

        if (todo.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: `User ${req.user.id} is not authorized to access this todo`
            });
        }

        res.status(200).json({
            success: true,
            data: todo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.createTodo = async (req, res, next) => {
    try {

        req.body.user = new mongoose.Types.ObjectId(req.user.id);

        if (req.body.endDate === '') {
            delete req.body.endDate;
        }

        const count = await Todo.countDocuments({ user: req.user.id, status: 'pending' });
        req.body.serialNumber = count + 1;

        const todo = await Todo.create(req.body);

        res.status(201).json({ success: true, data: todo });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateTodo = async (req, res, next) => {
    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                error: `Todo not found with id of ${req.params.id}`
            });
        }

        if (todo.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: `User ${req.user.id} is not authorized to update this todo`
            });
        }

        if (req.body.endDate === '') {
            req.body.endDate = null;
        }

        todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: todo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                error: `Todo not found with id of ${req.params.id}`
            });
        }

        if (todo.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: `User ${req.user.id} is not authorized to delete this todo`
            });
        }

        const deletedSerialNumber = todo.serialNumber;
        const todoStatus = todo.status;

        await todo.deleteOne();

        if (todoStatus === 'pending') {
            const remainingTodos = await Todo.find({
                user: req.user.id,
                status: 'pending',
                serialNumber: { $gt: deletedSerialNumber }
            }).sort({ serialNumber: 1 });

            for (const remainingTodo of remainingTodos) {
                await Todo.findByIdAndUpdate(remainingTodo._id, {
                    serialNumber: remainingTodo.serialNumber - 1
                });
            }
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.reorderTodos = async (req, res, next) => {
    try {
        const { todoId, direction } = req.body;

        const todo = await Todo.findById(todoId);

        if (!todo) {
            return res.status(404).json({
                success: false,
                error: 'Todo not found'
            });
        }

        if (todo.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to reorder this todo'
            });
        }

        const currentSerial = todo.serialNumber;
        let targetSerial;

        if (direction === 'up') {
            targetSerial = currentSerial - 1;
            if (targetSerial < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot move task up, already at the top'
                });
            }
        } else if (direction === 'down') {
            targetSerial = currentSerial + 1;
            const maxSerial = await Todo.countDocuments({
                user: req.user.id,
                status: todo.status
            });
            if (targetSerial > maxSerial) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot move task down, already at the bottom'
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid direction. Use "up" or "down"'
            });
        }

        const swapTodo = await Todo.findOne({
            user: req.user.id,
            status: todo.status,
            serialNumber: targetSerial
        });

        if (!swapTodo) {
            return res.status(404).json({
                success: false,
                error: 'No task found to swap with'
            });
        }

        await Todo.findByIdAndUpdate(todo._id, { serialNumber: targetSerial });
        await Todo.findByIdAndUpdate(swapTodo._id, { serialNumber: currentSerial });

        const todos = await Todo.find({
            user: req.user.id,
            status: todo.status
        }).sort({ serialNumber: 1 });

        res.status(200).json({
            success: true,
            data: todos
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
