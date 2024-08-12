import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, DollarSign, Users, Book, ArrowRight, ArrowLeft, Eye, EyeOff, User, Mail, Lock, Calendar, MapPin, Briefcase, Heart, X, Sun, Moon, Coins, PiggyBank, TrendingUp } from 'lucide-react';

const LoginSignupPage = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    address: '',
    occupation: '',
    interests: [],
    financialGoal: ''
  });

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInterestChange = (interest) => {
    const updatedInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    setFormData({ ...formData, interests: updatedInterests });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onLogin();
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderSignupStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  className="appearance-none border rounded w-full py-2 px-3 pl-10 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white dark:bg-white dark:text-gray-800"
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  className="appearance-none border rounded w-full py-2 px-3 pl-10 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white dark:bg-white dark:text-gray-800"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  className="appearance-none border rounded w-full py-2 px-3 pl-10 leading-tight focus:outline-none focus:shadow-outline pr-10 bg-gray-700 text-white dark:bg-white dark:text-gray-800"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-white">Personal Details</h3>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="age">
                Age
              </label>
              <div className="relative">
                <Calendar className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  className="appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="gender">
                Gender
              </label>
              <div className="relative">
                <User className="absolute top-3 left-3 text-gray-400" size={18} />
                <select
                  className="appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="address">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute top-3 left-3 text-gray-400" size={18} />
                <textarea
                  className="appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
                  id="address"
                  placeholder="Enter your address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-white">Interests & Goals</h3>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="occupation">
                Occupation
              </label>
              <div className="relative">
                <Briefcase className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  className="appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
                  id="occupation"
                  type="text"
                  placeholder="Enter your occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Interests
              </label>
              <div className="flex flex-wrap -mx-2">
                {['Budgeting', 'Investing', 'Saving', 'Entrepreneurship', 'Personal Finance'].map((interest) => (
                  <motion.div
                    key={interest}
                    className="px-2 mb-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="button"
                      className={`py-2 px-4 rounded-full text-sm font-semibold ${
                        formData.interests.includes(interest)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                      onClick={() => handleInterestChange(interest)}
                    >
                      {interest}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="financialGoal">
                Financial Goal
              </label>
              <div className="relative">
                <TrendingUp className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  className="appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
                  id="financialGoal"
                  type="text"
                  placeholder="Enter your financial goal"
                  name="financialGoal"
                  value={formData.financialGoal}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-100 transition-colors duration-300`}>
      <div className={`bg-gray-800 dark:bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md relative transition-colors duration-300`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-300 dark:hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <button
          onClick={toggleDarkMode}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-300 dark:hover:text-gray-700"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <div className="p-8">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold text-purple-500 flex items-center justify-center">
              Dhan Gyan <Sparkles className="ml-2 text-yellow-500" />
            </h2>
            <p className="text-gray-400 dark:text-gray-600 mt-2">Financial Literacy for a Brighter Future</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-gray-300 dark:text-gray-700" htmlFor="email">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                      <input
                        className="appearance-none border rounded w-full py-2 px-3 pl-10 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white dark:bg-white dark:text-gray-800"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-6 relative">
                    <label className="block text-sm font-bold mb-2 text-gray-300 dark:text-gray-700" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                      <input
                        className="appearance-none border rounded w-full py-2 px-3 pl-10 leading-tight focus:outline-none focus:shadow-outline pr-10 bg-gray-700 text-white dark:bg-white dark:text-gray-800"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                renderSignupStep()
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-6">
              {!isLogin && currentStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-300 dark:hover:bg-gray-400 text-white dark:text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline flex items-center"
                  onClick={prevStep}
                  type="button"
                >
                  <ArrowLeft className="mr-2" size={16} /> Back
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline flex items-center"
                type={isLogin || currentStep === 2 ? "submit" : "button"}
                onClick={isLogin ? null : (currentStep < 2 ? nextStep : null)}
              > 
                {isLogin ? 'Sign In' : currentStep < 2 ? 'Next' : 'Sign Up'}
                {!isLogin && <ArrowRight className="ml-2" size={16} />}
              </motion.button>
            </div>
          </form>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block align-baseline font-bold text-sm text-purple-400 hover:text-purple-300 dark:text-purple-600 dark:hover:text-purple-700"
              onClick={toggleView}
              type="button"
            >
              {isLogin ? 'Create an account' : 'Already have an account?'}
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="px-8 py-4 bg-gray-700 dark:bg-gray-200 border-t border-gray-600 dark:border-gray-300 mt-6 rounded-lg"
          >
            <h3 className="text-center text-gray-300 dark:text-gray-700 font-semibold mb-4">Why Choose Dhan Gyan?</h3>
            <div className="flex justify-around">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                <DollarSign className="mx-auto text-green-400 dark:text-green-600" size={24} />
                <p className="text-sm mt-2 text-gray-300 dark:text-gray-700">Financial Skills</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                <Users className="mx-auto text-blue-400 dark:text-blue-600" size={24} />
                <p className="text-sm mt-2 text-gray-300 dark:text-gray-700">Community Support</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                <Book className="mx-auto text-purple-400 dark:text-purple-600" size={24} />
                <p className="text-sm mt-2 text-gray-300 dark:text-gray-700">Expert Resources</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6"
          >
            <h3 className="text-center text-gray-300 dark:text-gray-700 font-semibold mb-4">Start Your Financial Journey</h3>
            <div className="flex justify-around">
              <motion.div 
                className="text-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                <Coins className="mx-auto text-yellow-400 dark:text-yellow-600" size={24} />
                <p className="text-sm mt-2 text-gray-300">Learn Saving</p>
           </motion.div>
           <motion.div 
             className="text-center cursor-pointer"
             whileHover={{ scale: 1.1 }}
             transition={{ type: 'spring', stiffness: 300, damping: 10 }}
           >
             <PiggyBank className="mx-auto text-pink-400" size={24} />
             <p className="text-sm mt-2 text-gray-300">Budget Mastery</p>
           </motion.div>
           <motion.div 
             className="text-center cursor-pointer"
             whileHover={{ scale: 1.1 }}
             transition={{ type: 'spring', stiffness: 300, damping: 10 }}
           >
             <TrendingUp className="mx-auto text-green-400" size={24} />
             <p className="text-sm mt-2 text-gray-300">Invest Wisely</p>
           </motion.div>
         </div>
       </motion.div>
     </div>
   </div>
 </div>
);
};

export default LoginSignupPage;