import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes, FaUser, FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation rules
  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    password: {
      required: true,
      minLength: 6,
      message: 'Password must be at least 6 characters'
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

  const handleLogin = async (e) => {
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
      return;
    }

    // Simulate login process
    setIsLoading(true);
    try {
      // Add your API call here
      console.log('Logging in with:', { ...formData, rememberMe });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      alert('Login successful!');
      // Redirect or handle successful login here
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Social login handlers
  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Add social login logic here
  };

  // Forgot password handler
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Add forgot password logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Welcome Back
            </h1>
            <p className="text-emerald-100 text-center mt-2 text-sm md:text-base">
              Sign in to your account
            </p>
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6" noValidate>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FaEnvelope className="mr-2 text-emerald-600" />
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
                    className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 transition-all ${touched.email && errors.email
                        ? 'border-red-500 focus:ring-red-200'
                        : touched.email && !errors.email
                          ? 'border-emerald-500 focus:ring-emerald-200'
                          : 'border-gray-300 focus:ring-emerald-500 focus:border-transparent'
                      }`}
                    disabled={isLoading}
                  />
                  <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${touched.email && errors.email
                      ? 'text-red-500'
                      : touched.email && !errors.email
                        ? 'text-emerald-500'
                        : 'text-gray-400'
                    }`} />
                  {touched.email && !errors.email && formData.email && (
                    <FaCheck className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  )}
                  {touched.email && errors.email && (
                    <FaTimes className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs flex items-center">
                    <FaTimes className="mr-1 text-xs" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FaLock className="mr-2 text-emerald-600" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pl-11 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all ${touched.password && errors.password
                        ? 'border-red-500 focus:ring-red-200'
                        : touched.password && !errors.password
                          ? 'border-emerald-500 focus:ring-emerald-200'
                          : 'border-gray-300 focus:ring-emerald-500 focus:border-transparent'
                      }`}
                    disabled={isLoading}
                  />
                  <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${touched.password && errors.password
                      ? 'text-red-500'
                      : touched.password && !errors.password
                        ? 'text-emerald-500'
                        : 'text-gray-400'
                    }`} />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-red-500 text-xs flex items-center">
                    <FaTimes className="mr-1 text-xs" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 relative ${isFormValid && !isLoading
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Form Status */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Form Status:</span>
                  <span className={`font-medium ${isFormValid ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                    {isFormValid ? 'Ready to sign in' : 'Please fill all fields correctly'}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/" className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
              Create account
            </Link>
          </p>
          <p className="text-gray-500 text-xs">
            By signing in, you agree to our Terms and Privacy Policy
          </p>
        </div>

      </div>
    </div>
  );
}