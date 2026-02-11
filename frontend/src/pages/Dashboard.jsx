import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    FaPlus, FaSearch, FaEdit, FaTrash, FaCheck, FaArrowUp,
    FaArrowDown, FaCalendarAlt, FaFlag, FaSignOutAlt, FaFilter
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { todoRoute } from '../Routes';

export default function Dashboard() {
    const { logout, token } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        endDate: ''
    });

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${todoRoute}?status=${view}&search=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setTasks(res.data.data);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [view, searchQuery, token, logout, navigate]);

    useEffect(() => {
        if (token) {
            fetchTasks();
        } else {
            navigate('/login');
        }
    }, [fetchTasks, token, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            if (editingTask) {
                await axios.put(`${todoRoute}/${editingTask._id}`, formData, { headers });
            } else {
                const res = await axios.post(todoRoute, formData, { headers });
            }
            setIsModalOpen(false);
            setEditingTask(null);
            setFormData({ title: '', description: '', priority: 'medium', endDate: '' });
            fetchTasks();
        } catch (err) {
            alert(err.response?.data?.error || `Request failed with status ${err.response?.status}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`${todoRoute}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchTasks();
            } catch (err) {
                alert(err.response?.data?.error || 'Delete failed');
            }
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';
            await axios.put(`${todoRoute}/${task._id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            alert(err.response?.data?.error || 'Update failed');
        }
    };

    const handleReorder = async (todoId, direction) => {
        try {
            await axios.put(`${todoRoute}/reorder`, { todoId, direction }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            alert(err.response?.data?.error || 'Reorder failed');
        }
    };

    const openAddModal = () => {
        setEditingTask(null);
        setFormData({ title: '', description: '', priority: 'medium', endDate: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            priority: task.priority || 'medium',
            endDate: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-600 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-600 border-green-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <FaCheck className="text-white text-xl" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Advanced Todo</h1>
                </div>

                <div className="flex-1 max-w-md mx-4 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                >
                    <FaSignOutAlt />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </nav>

            <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">My Dashboard</h2>
                        <p className="text-gray-500">Manage your tasks efficiently</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100 flex">
                            <button
                                onClick={() => setView('pending')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'pending' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setView('completed')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'completed' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Completed
                            </button>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <FaPlus />
                            <span>Add Task</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300 shadow-sm">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCheck className="text-gray-300 text-2xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700">No tasks found</h3>
                        <p className="text-gray-500 mt-2">Time to add some new objectives!</p>
                        <button
                            onClick={openAddModal}
                            className="mt-6 text-blue-600 font-medium hover:underline"
                        >
                            Start by creating your first task
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
                            >
                                <div className="flex items-center space-x-3 w-full sm:w-auto">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {task.serialNumber}
                                    </div>
                                    <button
                                        onClick={() => handleToggleComplete(task)}
                                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${task.status === 'completed'
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-gray-300 hover:border-blue-500'
                                            }`}
                                    >
                                        {task.status === 'completed' && <FaCheck className="text-xs" />}
                                    </button>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <h4 className={`font-semibold text-gray-800 truncate ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                                            {task.title}
                                        </h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm truncate">{task.description}</p>

                                    {task.endDate && (
                                        <div className="flex items-center space-x-1 mt-1 text-gray-400 text-xs">
                                            <FaCalendarAlt />
                                            <span>{new Date(task.endDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                                    {view === 'pending' && (
                                        <div className="flex flex-col items-center mr-2">
                                            <button
                                                onClick={() => handleReorder(task._id, 'up')}
                                                disabled={task.serialNumber === 1}
                                                className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30"
                                            >
                                                <FaArrowUp className="text-xs" />
                                            </button>
                                            <button
                                                onClick={() => handleReorder(task._id, 'down')}
                                                disabled={task.serialNumber === tasks.length}
                                                className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30"
                                            >
                                                <FaArrowDown className="text-xs" />
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => openEditModal(task)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-blue-600 p-6 text-white">
                            <h3 className="text-xl font-bold">{editingTask ? 'Edit Task' : 'New Task'}</h3>
                            <p className="text-blue-100 text-sm">Fill in the details below</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="What needs to be done?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Add some details..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                                    <select
                                        name="priority"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
                                >
                                    {editingTask ? 'Apply Changes' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
