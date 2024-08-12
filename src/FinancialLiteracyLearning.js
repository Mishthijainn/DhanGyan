import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaMoon, FaSun, FaSearch, FaExpandAlt, FaGraduationCap, FaPiggyBank, FaChartLine } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import confetti from 'canvas-confetti';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_KEY = 'AIzaSyAsxnp7YgiJIfZWoaYkRFWIatgcrjBZh18';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const FinancialLiteracyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [learningStreak, setLearningStreak] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextPageToken, setNextPageToken] = useState('');
  const [categories, setCategories] = useState(['All', 'Investing', 'Budgeting', 'Credit', 'Taxes', 'Entrepreneurship', 'Retirement', 'Cryptocurrency', 'Coding', 'Cooking', 'College Life']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [userName, setUserName] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [learningGoals, setLearningGoals] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    fetchCourses();
    const storedStreak = localStorage.getItem('learningStreak');
    if (storedStreak) {
      setLearningStreak(parseInt(storedStreak));
    }
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setShowProfileModal(true);
    }
    generateLeaderboard();
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('learningStreak', learningStreak.toString());
  }, [learningStreak]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: `${selectedCategory !== 'All' ? selectedCategory : 'financial literacy'} ${selectedCategory === 'All' ? 'for women and youth' : ''}`,
          type: 'playlist',
          maxResults: 15,
          key: API_KEY,
        },
      });
      setCourses(response.data.items);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchVideos = useCallback(async (playlistId, pageToken = '') => {
    try {
      const response = await axios.get(`${BASE_URL}/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId: playlistId,
          maxResults: 15,
          pageToken: pageToken,
          key: API_KEY,
        },
      });
      if (pageToken === '') {
        setVideos(response.data.items);
      } else {
        setVideos(prevVideos => [...prevVideos, ...response.data.items]);
      }
      setNextPageToken(response.data.nextPageToken || '');
      if (!currentVideo) {
        setCurrentVideo(response.data.items[0]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }, [currentVideo]);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchVideos(course.id.playlistId);
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
  };

  const handleQuizCompletion = (score) => {
    setUserScore(prevScore => {
      const newScore = prevScore + score;
      updateLeaderboard(newScore);
      return newScore;
    });
    setQuizOpen(false);
    setLearningStreak(prevStreak => prevStreak + 1);
    if (learningStreak % 5 === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const generateQuiz = () => {
    setCurrentQuiz({
      questions: [
        {
          question: "What is compound interest?",
          options: [
            "Interest calculated on the initial principal only",
            "Interest calculated on the initial principal and accumulated interest",
            "A type of loan",
            "A savings account"
          ],
          correctAnswer: 1
        },
        {
          question: "Which of the following is considered a good debt?",
          options: [
            "Credit card debt",
            "Payday loans",
            "Student loans for education",
            "High-interest personal loans"
          ],
          correctAnswer: 2
        },
        {
          question: "What is diversification in investing?",
          options: [
            "Putting all your money in one stock",
            "Spreading investments across various assets to reduce risk",
            "Investing only in bonds",
            "Keeping all your money in a savings account"
          ],
          correctAnswer: 1
        }
      ]
    });
    setQuizOpen(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadMoreVideos = () => {
    if (selectedCourse && nextPageToken) {
      fetchVideos(selectedCourse.id.playlistId, nextPageToken);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleRating = (courseId, rating) => {
    setRatings(prevRatings => ({ ...prevRatings, [courseId]: rating }));
  };

  const handleComment = (courseId, comment) => {
    setComments(prevComments => ({
      ...prevComments,
      [courseId]: [...(prevComments[courseId] || []), comment]
    }));
  };

  const generateLeaderboard = () => {
    const fakeUsers = [
      { name: "Alice", score: 850 },
      { name: "Bob", score: 720 },
      { name: "Charlie", score: 690 },
      { name: "Diana", score: 610 },
      { name: "Evan", score: 580 }
    ];
    setLeaderboard([...fakeUsers, { name: userName, score: userScore }].sort((a, b) => b.score - a.score));
  };

  const updateLeaderboard = (newScore) => {
    const updatedLeaderboard = leaderboard.map(user =>
      user.name === userName ? { ...user, score: newScore } : user
    );
    setLeaderboard(updatedLeaderboard.sort((a, b) => b.score - a.score));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    setShowProfileModal(false);
    generateLeaderboard();
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const newGoal = e.target.elements.goal.value;
    setLearningGoals([...learningGoals, { text: newGoal, completed: false }]);
    setShowGoalModal(false);
  };

  const toggleGoalCompletion = (index) => {
    const updatedGoals = [...learningGoals];
    updatedGoals[index].completed = !updatedGoals[index].completed;
    setLearningGoals(updatedGoals);
  };

  return (
    <div className={`financial-literacy-learning container mx-auto p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900'} ${isFullScreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Financial Wisdom Hub</h2>
        <div className="flex items-center">
          <button onClick={toggleFullScreen} className="btn btn-circle mr-2 bg-purple-500 hover:bg-purple-600">
            <FaExpandAlt />
          </button>
          <button onClick={toggleDarkMode} className="btn btn-circle bg-yellow-500 hover:bg-yellow-600">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Explore financial wisdom..."
            className={`w-full p-3 pl-10 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-purple-400" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-4 flex flex-wrap"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategorySelect(category)}
            className={`btn mr-2 mb-2 ${selectedCategory === category ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} border-2 border-purple-600 hover:bg-purple-100`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>
      
      <AnimatePresence>
        {!selectedCourse ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id.playlistId}
                className={`card ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl cursor-pointer overflow-hidden`}
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCourseSelect(course)}
              >
                <figure className="relative">
                  {course.snippet.thumbnails && course.snippet.thumbnails.medium && (
                    <img src={course.snippet.thumbnails.medium.url} alt={course.snippet.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-bold">Start Learning</p>
                  </div>
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">{course.snippet.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{course.snippet.description.slice(0, 100)}...</p>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`cursor-pointer ${star <= (ratings[course.id.playlistId] || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRating(course.id.playlistId, star);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="selected-course"
          >
            <button
              onClick={() => setSelectedCourse(null)}
              className="btn bg-purple-600 hover:bg-purple-700 text-white mb-4"
            >
              Back to Courses
            </button>
            <h3 className="text-2xl font-bold mb-4">{selectedCourse.snippet.title}</h3>
            <div className="flex flex-col lg:flex-row">
              <div className="video-player w-full lg:w-3/4 mb-4 lg:mb-0">
                {currentVideo && (
                  <div className="relative rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      width="100%"
                      height="480"
                      src={`https://www.youtube.com/embed/${currentVideo.snippet.resourceId.videoId}`}
                      title={currentVideo.snippet.title}
                      frameBorder="0"
                      allowFullScreen
                      className="w-full"
                    ></iframe>
                    <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <h4 className="text-xl font-semibold mb-2">{currentVideo.snippet.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{currentVideo.snippet.description}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <button onClick={generateQuiz} className="btn bg-green-500 hover:bg-green-600 text-white">Take Quiz</button>
                      <div className="flex items-center">
                        <FaGraduationCap className="text-purple-500 mr-2" />
                        <span>Learning Streak: {learningStreak} days</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-8">
                  <h4 className="text-2xl font-bold mb-4">Learning Goals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningGoals.map((goal, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-lg shadow ${goal.completed ? 'bg-green-100 dark:bg-green-800' : 'bg-white dark:bg-gray-700'}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={goal.completed}
                            onChange={() => toggleGoalCompletion(index)}
                            className="mr-3"
                          />
                          <span className={goal.completed ? 'line-through' : ''}>{goal.text}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="mt-4 btn bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Add Learning Goal
                  </button>
                </div>
              </div>
              <div className="video-list w-full lg:w-1/4 lg:ml-4 overflow-y-auto max-h-[600px]">
                <h4 className="text-xl font-bold mb-4">Course Videos</h4>
                <InfiniteScroll
                  dataLength={videos.length}
                  next={loadMoreVideos}
                  hasMore={!!nextPageToken}
                  loader={<h4>Loading...</h4>}
                  scrollableTarget="scrollableDiv"
                >
                  {videos.map((video) => (
                    <motion.div
                      key={video.id}
                      className={`video-item p-2 cursor-pointer ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                      } ${currentVideo && currentVideo.id === video.id ? 'border-l-4 border-purple-500' : ''}`}
                      onClick={() => handleVideoSelect(video)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center">
                        {video.snippet.thumbnails && video.snippet.thumbnails.default && (
                          <img
                            src={video.snippet.thumbnails.default.url}
                            alt={video.snippet.title}
                            className="w-20 h-20 object-cover rounded-md mr-3"
                          />
                        )}
                        <p className="text-sm font-medium">{video.snippet.title}</p>
                      </div>
                    </motion.div>
                  ))}
                </InfiniteScroll>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-2xl font-bold mb-4">Discussion</h4>
              <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {comments[selectedCourse.id.playlistId] && comments[selectedCourse.id.playlistId].map((comment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <p className="text-sm">{comment}</p>
                  </motion.div>
                ))}
                <textarea
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Share your thoughts..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleComment(selectedCourse.id.playlistId, e.target.value);
                      e.target.value = '';
                    }
                  }}
                ></textarea>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className={`stats shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaStar size={24} className="text-yellow-400" />
            </div>
            <div className="stat-title">Your Score</div>
            <div className="stat-value text-primary">{userScore}</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <FaChartLine size={24} className="text-green-500" />
            </div>
            <div className="stat-title">Learning Streak</div>
            <div className="stat-value text-secondary">{learningStreak}</div>
          </div>
        </div>

        <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-xl font-bold mb-4">Financial Health Tracker</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { month: 'Jan', savings: 1000, investment: 500 },
              { month: 'Feb', savings: 1200, investment: 600 },
              { month: 'Mar', savings: 1100, investment: 700 },
              { month: 'Apr', savings: 1400, investment: 800 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="#8884d8" />
              <Line type="monotone" dataKey="investment" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <h3 className="text-2xl font-bold mb-4">Leaderboard</h3>
        <div className={`overflow-x-auto rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="table w-full">
            <thead>
              <tr className="bg-purple-500 text-white">
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={index} className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg max-w-md w-full`}
          >
            <h3 className="text-2xl font-bold mb-4">Welcome to Financial Wisdom Hub!</h3>
            <form onSubmit={handleProfileSubmit}>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`w-full p-2 mb-4 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                required
              />
              <button type="submit" className="btn bg-purple-600 hover:bg-purple-700 text-white w-full">
                Start Learning
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg max-w-md w-full`}
          >
            <h3 className="text-2xl font-bold mb-4">Set a New Learning Goal</h3>
            <form onSubmit={handleGoalSubmit}>
              <input
                type="text"
                name="goal"
                placeholder="Enter your learning goal"
                className={`w-full p-2 mb-4 rounded-lg border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                required
              />
              <button type="submit" className="btn bg-blue-500 hover:bg-blue-600 text-white w-full">
                Add Goal
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {quizOpen && currentQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg max-w-lg w-full`}
          >
            <h3 className="text-2xl font-bold mb-4">Financial Literacy Quiz</h3>
            {currentQuiz.questions.map((q, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{q.question}</p>
                {q.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="block mt-2">
                    <input type="radio" name={`question-${index}`} value={optionIndex} className="mr-2" />
                    {option}
                  </label>
                ))}
              </div>
            ))}
            <button onClick={() => handleQuizCompletion(10)} className="btn bg-green-500 hover:bg-green-600 text-white w-full mt-4">
              Submit Quiz
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FinancialLiteracyLearning;