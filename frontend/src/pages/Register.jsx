import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { registerRoute } from '../Routes';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: ''
    });
    
    const [touched, setTouched] = useState({
        username: false,
        email: false,
        password: false
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    // Validation rules - Updated password pattern to be more flexible
    const validationRules = {
        username: {
            required: true,
            minLength: 3,
            maxLength: 20,
            pattern: /^[a-zA-Z0-9_]+$/,
            message: 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        password: {
            required: true,
            minLength: 6,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]{6,}$/,
            message: 'Password must be at least 6 characters with uppercase, lowercase, and number'
        }
    };

    // Validate field
    const validateField = (name, value) => {
        const rules = validationRules[name];
        let error = '';

        if (rules.required && !value.trim()) {
            error = 'This field is required';
        } else if (rules.minLength && value.length < rules.minLength) {
            error = `Minimum ${rules.minLength} characters required`;
        } else if (rules.maxLength && value.length > rules.maxLength) {
            error = `Maximum ${rules.maxLength} characters allowed`;
        } else if (name === 'password') {
            // Special validation for password with detailed messages
            const passwordErrors = [];
            
            if (value.length < 6) {
                passwordErrors.push('at least 6 characters');
            }
            if (!/[a-z]/.test(value)) {
                passwordErrors.push('one lowercase letter');
            }
            if (!/[A-Z]/.test(value)) {
                passwordErrors.push('one uppercase letter');
            }
            if (!/\d/.test(value)) {
                passwordErrors.push('one number');
            }
            
            if (passwordErrors.length > 0) {
                error = `Password must contain: ${passwordErrors.join(', ')}`;
            }
        } else if (rules.pattern && !rules.pattern.test(value)) {
            error = rules.message;
        }

        return error;
    };

    // Handle input change with validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    // Handle blur
    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Check if form is valid
    useEffect(() => {
        const isValid = Object.keys(errors).every(key => !errors[key]) && 
                       Object.values(formData).every(value => value.trim() !== '');
        setIsFormValid(isValid);
    }, [errors, formData]);

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        const allTouched = {};
        Object.keys(touched).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            newErrors[key] = validateField(key, formData[key]);
        });
        setErrors(newErrors);

        // Check if form is valid
        const isValid = Object.values(newErrors).every(error => !error);
        if (!isValid) {
            alert('Please fix all errors before submitting');
            return;
        }

        // Submit the form
        try{
            const res = await axios.post(registerRoute, formData);
            alert('Registration successful!');
        }
        catch(err){
            console.log(err);
            alert('Registration failed!');
        }
        // Add your API call here
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 6) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[\W_]/.test(password)) strength++; // More flexible special character check
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Check specific password requirements
    const checkPasswordRequirement = (regex, password) => {
        return regex.test(password);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                            Create Account
                        </h1>
                        <p className="text-blue-100 text-center mt-2 text-sm md:text-base">
                            Join our community today
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleRegister} className="space-y-6" noValidate>
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaUser className="mr-2 text-blue-600" />
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter your username"
                                        className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                            touched.username && errors.username
                                                ? 'border-red-500 focus:ring-red-200'
                                                : touched.username && !errors.username
                                                ? 'border-green-500 focus:ring-green-200'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    />
                                    <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                        touched.username && errors.username
                                            ? 'text-red-500'
                                            : touched.username && !errors.username
                                                ? 'text-green-500'
                                            : 'text-gray-400'
                                    }`} />
                                    {touched.username && !errors.username && formData.username && (
                                        <FaCheck className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                                    )}
                                    {touched.username && errors.username && (
                                        <FaTimes className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500" />
                                    )}
                                </div>
                                {touched.username && errors.username && (
                                    <p className="text-red-500 text-xs flex items-center">
                                        <FaExclamationTriangle className="mr-1" />
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaEnvelope className="mr-2 text-blue-600" />
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="john@example.com"
                                        className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                            touched.email && errors.email
                                                ? 'border-red-500 focus:ring-red-200'
                                                : touched.email && !errors.email
                                                ? 'border-green-500 focus:ring-green-200'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    />
                                    <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                        touched.email && errors.email
                                            ? 'text-red-500'
                                            : touched.email && !errors.email
                                                ? 'text-green-500'
                                            : 'text-gray-400'
                                    }`} />
                                    {touched.email && !errors.email && formData.email && (
                                        <FaCheck className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                                    )}
                                    {touched.email && errors.email && (
                                        <FaTimes className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500" />
                                    )}
                                </div>
                                {touched.email && errors.email && (
                                    <p className="text-red-500 text-xs flex items-center">
                                        <FaExclamationTriangle className="mr-1" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaLock className="mr-2 text-blue-600" />
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter your password"
                                        className={`w-full px-4 py-3 pl-11 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                            touched.password && errors.password
                                                ? 'border-red-500 focus:ring-red-200'
                                                : touched.password && !errors.password
                                                ? 'border-green-500 focus:ring-green-200'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    />
                                    <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                        touched.password && errors.password
                                            ? 'text-red-500'
                                            : touched.password && !errors.password
                                                ? 'text-green-500'
                                            : 'text-gray-400'
                                    }`} />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600">Password strength:</span>
                                            <span className={`text-xs font-medium ${
                                                passwordStrength >= 4 ? 'text-green-600' :
                                                passwordStrength >= 3 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {passwordStrength >= 4 ? 'Strong' :
                                                 passwordStrength >= 3 ? 'Good' : 'Weak'}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-300 ${
                                                    passwordStrength >= 4 ? 'bg-green-500 w-full' :
                                                    passwordStrength >= 3 ? 'bg-yellow-500 w-3/4' :
                                                    passwordStrength >= 2 ? 'bg-red-500 w-1/2' :
                                                    passwordStrength >= 1 ? 'bg-red-400 w-1/4' : ''
                                                }`}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Password Requirements - Updated */}
                                <div className="space-y-1 pt-2">
                                    <p className="text-xs text-gray-600 font-medium">Password requirements:</p>
                                    <ul className="text-xs text-gray-500 space-y-1">
                                        <li className={`flex items-center ${formData.password.length >= 6 ? 'text-green-600' : ''}`}>
                                            {checkPasswordRequirement(/^.{6,}$/, formData.password) ? 
                                                <FaCheck className="mr-1 text-xs" /> : 
                                                <FaTimes className="mr-1 text-xs" />
                                            }
                                            At least 6 characters
                                        </li>
                                        <li className={`flex items-center ${checkPasswordRequirement(/[a-z]/, formData.password) ? 'text-green-600' : ''}`}>
                                            {checkPasswordRequirement(/[a-z]/, formData.password) ? 
                                                <FaCheck className="mr-1 text-xs" /> : 
                                                <FaTimes className="mr-1 text-xs" />
                                            }
                                            One lowercase letter
                                        </li>
                                        <li className={`flex items-center ${checkPasswordRequirement(/[A-Z]/, formData.password) ? 'text-green-600' : ''}`}>
                                            {checkPasswordRequirement(/[A-Z]/, formData.password) ? 
                                                <FaCheck className="mr-1 text-xs" /> : 
                                                <FaTimes className="mr-1 text-xs" />
                                            }
                                            One uppercase letter
                                        </li>
                                        <li className={`flex items-center ${checkPasswordRequirement(/\d/, formData.password) ? 'text-green-600' : ''}`}>
                                            {checkPasswordRequirement(/\d/, formData.password) ? 
                                                <FaCheck className="mr-1 text-xs" /> : 
                                                <FaTimes className="mr-1 text-xs" />
                                            }
                                            One number
                                        </li>
                                        <li className="flex items-center text-green-600">
                                            <FaCheck className="mr-1 text-xs" />
                                            Special characters are optional
                                        </li>
                                    </ul>
                                </div>
                                
                                {touched.password && errors.password && (
                                    <p className="text-red-500 text-xs flex items-center">
                                        <FaExclamationTriangle className="mr-1" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                    isFormValid
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Register Now
                            </button>
                        </form>

                        {/* Form Status */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Form Status:</span>
                                <span className={`font-medium ${
                                    isFormValid ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {isFormValid ? 'Ready to submit' : 'Please fill all fields correctly'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}