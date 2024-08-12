import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, Trophy, Clock, Brain, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const hardcodedQuestions = [
  {
    question: "What is compound interest?",
    options: [
      "Interest calculated on the initial principal only",
      "Interest calculated on the initial principal and accumulated interest",
      "A type of tax deduction",
      "A fee charged by banks"
    ],
    correctIndex: 1,
    explanation: "Compound interest is calculated on both the initial principal and the accumulated interest from previous periods.",
    category: "Savings"
  },
  {
    question: "What is diversification in investing?",
    options: [
      "Putting all your money in one stock",
      "Investing only in real estate",
      "Spreading investments across various asset classes",
      "Investing only in government bonds"
    ],
    correctIndex: 2,
    explanation: "Diversification involves spreading investments across different asset classes to reduce risk.",
    category: "Investing"
  },
  {
    question: "What is a bull market?",
    options: [
      "A market where prices are falling",
      "A market where prices are rising",
      "A market for agricultural products",
      "A market only for experienced investors"
    ],
    correctIndex: 1,
    explanation: "A bull market is characterized by rising prices and optimistic investor sentiment.",
    category: "Market Knowledge"
  },
  {
    question: "What is a credit score?",
    options: [
      "Your bank account balance",
      "A numerical representation of your creditworthiness",
      "The amount of debt you owe",
      "Your annual income"
    ],
    correctIndex: 1,
    explanation: "A credit score is a numerical representation of your creditworthiness based on your credit history.",
    category: "Credit"
  },
  {
    question: "What is inflation?",
    options: [
      "The rise in the stock market",
      "The increase in interest rates",
      "The general increase in prices and fall in the purchasing value of money",
      "The decrease in unemployment"
    ],
    correctIndex: 2,
    explanation: "Inflation is the rate at which the general level of prices for goods and services is rising, and consequently, the purchasing power of currency is falling.",
    category: "Economic Concepts"
  },
  {
    question: "What is a mutual fund?",
    options: [
      "A type of bank account",
      "A pool of money managed by professional investors",
      "A government bond",
      "A type of cryptocurrency"
    ],
    correctIndex: 1,
    explanation: "A mutual fund is a professionally managed investment fund that pools money from many investors to purchase securities.",
    category: "Investing"
  },
  {
    question: "What is a recession?",
    options: [
      "A period of economic growth",
      "A decrease in the stock market",
      "A significant decline in economic activity lasting more than a few months",
      "An increase in government spending"
    ],
    correctIndex: 2,
    explanation: "A recession is a period of temporary economic decline during which trade and industrial activity are reduced, generally identified by a fall in GDP in two successive quarters.",
    category: "Economic Concepts"
  },
  {
    question: "What is a 401(k)?",
    options: [
      "A type of loan",
      "A retirement savings plan sponsored by an employer",
      "A government welfare program",
      "A type of health insurance"
    ],
    correctIndex: 1,
    explanation: "A 401(k) is a retirement savings plan sponsored by an employer. It lets workers save and invest a piece of their paycheck before taxes are taken out.",
    category: "Retirement"
  },
  {
    question: "What is a stock?",
    options: [
      "A type of bond",
      "A loan given to a company",
      "Ownership in a portion of a company",
      "A guaranteed return on investment"
    ],
    correctIndex: 2,
    explanation: "A stock represents ownership in a company. When you buy a stock, you're buying a small piece of that company.",
    category: "Investing"
  },
  {
    question: "What is a bear market?",
    options: [
      "A market where prices are rising",
      "A market where prices are falling",
      "A market for commodities",
      "A market only for short-term trading"
    ],
    correctIndex: 1,
    explanation: "A bear market is characterized by falling prices and typically pessimistic investor sentiment.",
    category: "Market Knowledge"
  }
];

const FinancialQuiz = ({ onClose, onScoreUpdate }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameState, setGameState] = useState('ready');
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [categoryScores, setCategoryScores] = useState({});
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = () => {
    const shuffledQuestions = [...hardcodedQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    setGameState('playing');
    setScore(0);
    setTimeLeft(180);
    setCurrentQuestionIndex(0);
    setStreak(0);
    setCategoryScores({});
  };

  const handleAnswer = (selectedIndex) => {
    setSelectedAnswer(selectedIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    setScore((prevScore) => prevScore + (isCorrect ? 10 : 0));
    setStreak((prevStreak) => isCorrect ? prevStreak + 1 : 0);
    
    setCategoryScores((prevScores) => ({
      ...prevScores,
      [currentQuestion.category]: (prevScores[currentQuestion.category] || 0) + (isCorrect ? 1 : 0)
    }));

    setFeedback({
      isCorrect,
      message: isCorrect ? "Correct! Well done!" : "Oops! That's not right."
    });

    setTimeout(() => {
      setFeedback(null);
      setShowHint(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        endGame();
      }
    }, 3000);
  };

  const endGame = () => {
    setGameState('finished');
    onScoreUpdate(score);
  };

  const getHint = () => {
    setShowHint(true);
  };

  const getPersonalizedFeedback = () => {
    const percentage = (score / (questions.length * 10)) * 100;
    if (percentage >= 80) {
      return "Excellent work! You have a strong understanding of financial concepts. Keep it up!";
    } else if (percentage >= 60) {
      return "Good job! You have a solid foundation, but there's room for improvement. Consider studying the areas you struggled with.";
    } else {
      return "You're on the right track, but there's definitely room for improvement. Don't get discouraged - keep learning and practicing!";
    }
  };

  const getCategoryData = () => {
    return Object.entries(categoryScores).map(([category, score]) => ({
      subject: category,
      A: (score / questions.filter(q => q.category === category).length) * 100,
      fullMark: 100,
    }));
  };

  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getCategoryData()}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-6 rounded-3xl shadow-2xl max-w-2xl w-full m-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Dhan Gyan AI Financial Quiz</h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white hover:text-red-300 transition-colors"
          >
            <XCircle size={28} />
          </motion.button>
        </div>
        <div className="flex justify-between mb-6 text-white">
          <motion.div whileHover={{ scale: 1.1 }} className="flex items-center bg-blue-700 p-2 rounded-lg shadow-md">
            <Trophy className="mr-2" size={20} />
            <span className="font-semibold text-sm md:text-lg">{score}</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="flex items-center bg-purple-700 p-2 rounded-lg shadow-md">
            <Clock className="mr-2" size={20} />
            <span className="font-semibold text-sm md:text-lg">{timeLeft}s</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="flex items-center bg-pink-700 p-2 rounded-lg shadow-md">
            <Brain className="mr-2" size={20} />
            <span className="font-semibold text-sm md:text-lg">x{streak}</span>
          </motion.div>
        </div>

        {gameState === 'ready' && (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgb(255,255,255)" }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="btn w-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg text-xl"
          >
            Start Financial Adventure
          </motion.button>
        )}

        {gameState === 'playing' && questions.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-4 md:p-6 mt-4 shadow-xl"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-indigo-800">{questions[currentQuestionIndex].question}</h3>
              <div className="space-y-3">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, boxShadow: "0px 0px 8px rgba(79, 70, 229, 0.6)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    className={`btn w-full ${
                      selectedAnswer === index 
                        ? selectedAnswer === questions[currentQuestionIndex].correctIndex
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-green-100 text-green-800'
                    } font-semibold py-3 rounded-lg transition-colors duration-300 text-sm md:text-lg overflow-hidden`}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="block truncate">{option}</span>
                  </motion.button>
                ))}
              </div>
              <div className="flex space-x-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(79, 70, 229, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={getHint}
                  className="btn bg-yellow-400 text-indigo-800 font-semibold py-2 px-4 rounded-lg flex items-center justify-center text-sm md:text-lg flex-grow"
                  disabled={showHint}
                >
                  <Lightbulb className="mr-2" size={20} />
                  Hint
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(79, 70, 229, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="btn bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center text-sm md:text-lg flex-grow"
                >
                  <HelpCircle className="mr-2" size={20} />
                  Explain
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-4 p-4 rounded-xl ${
                feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              <div className="font-semibold text-lg">{feedback.message}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-yellow-100 text-yellow-800 p-4 rounded-xl mt-4"
            >
              <div>
                <span className="font-semibold text-lg">Hint:</span>
                <p className="text-md">{questions[currentQuestionIndex].explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-blue-100 text-blue-800 p-4 rounded-xl mt-4"
            >
              <div>
                <span className="font-semibold text-lg">Explanation:</span>
                <p className="text-md">{questions[currentQuestionIndex].explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === 'finished' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-white"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Financial Quest Complete!</h3>
            <p className="text-xl md:text-2xl mb-6">Your Wealth of Knowledge: {score} points</p>
            <p className="mb-6 text-lg">{getPersonalizedFeedback()}</p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgb(255,255,255)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="btn bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-xl mb-4 text-lg"
            >
              {showAnalysis ? "Hide Analysis" : "Show Detailed Analysis"}
            </motion.button>
            <AnimatePresence>
              {showAnalysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl p-4 md:p-6 mt-4 shadow-xl text-black"
                >
                  <h4 className="text-xl font-bold mb-4 text-indigo-800">Your Financial Expertise</h4>
                  <div className="flex justify-center mb-4">
                    {renderRadarChart()}
                  </div>
                  <div className="text-left">
                    <h5 className="font-bold text-lg mb-2">Category Breakdown:</h5>
                    {Object.entries(categoryScores).map(([category, score]) => (
                      <p key={category} className="mb-2">
                        <span className="font-semibold">{category}:</span> {score} / {questions.filter(q => q.category === category).length} correct
                        <motion.div
                          className="bg-blue-200 h-4 rounded-full mt-1 overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: `${(score / questions.filter(q => q.category === category).length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="bg-blue-500 h-full rounded-full"></div>
                        </motion.div>
                      </p>
                    ))}
                  </div>
                  <div className="mt-4">
                    <h5 className="font-bold text-lg mb-2">Recommendations:</h5>
                    <ul className="list-disc list-inside">
                      {Object.entries(categoryScores).map(([category, score]) => {
                        const totalQuestions = questions.filter(q => q.category === category).length;
                        const percentageCorrect = (score / totalQuestions) * 100;
                        let recommendation;
                        if (percentageCorrect < 50) {
                          recommendation = `Focus on improving your knowledge in ${category}. Consider studying more about this topic.`;
                        } else if (percentageCorrect < 80) {
                          recommendation = `You have a good foundation in ${category}, but there's room for improvement. Review the concepts you missed.`;
                        } else {
                          recommendation = `Excellent work in ${category}! Keep up the good work and consider exploring advanced topics in this area.`;
                        }
                        return <li key={category} className="mb-2">{recommendation}</li>;
                      })}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgb(255,255,255)" }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="btn bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-xl text-lg"
              >
                Embark Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgb(255,255,255)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="btn bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl text-lg"
              >
                Exit Quest
              </motion.button>
            </div>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="mt-6 bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FinancialQuiz;