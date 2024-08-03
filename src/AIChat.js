import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Loader, Image as ImageIcon, Trash, Copy, Mic, Volume2, Sun, Moon, Cloud, CloudRain } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLeopard } from "@picovoice/leopard-react";
import axios from 'axios';

const API_KEY = 'AIzaSyDEOaasipW4UGqYSYaKdOPKHio2hrhfigI';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const API_URL_VISION = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';
const PICOVOICE_ACCESS_KEY = '5MQQc8dKvmWzkZ/yagEE2dHM7IobxY8SzKpF4UnFuH4v1rm5YxMqVQ==';
const WEATHER_API_KEY = '44ad69f45d8d4d7a8a1110757240308';
const WEATHER_API_URL = 'http://api.weatherapi.com/v1/current.json';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [userName, setUserName] = useState('');
    const [image, setImage] = useState(null);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [weather, setWeather] = useState(null);


    useEffect(() => {
        if (isSidebarOpen && messages.length === 0) {
          fetchWeather();
        }
      }, [isSidebarOpen]);
    
      useEffect(() => {
        if (weather && messages.length === 0) {
          const greeting = getGreeting();
          setMessages([{ text: greeting, sender: 'ai' }]);
        }
      }, [weather]);

  const {
    result,
    isLoaded,
    error,
    init,
    startRecording,
    stopRecording,
  } = useLeopard();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getGreeting();
      setMessages([{ text: `${greeting} I'm your AI assistant. What's your name?`, sender: 'ai' }]);
    }
  }, [isOpen]);

  useEffect(() => {
    initLeopard();
    fetchWeather();
  }, []);

  useEffect(() => {
    if (result && result.transcript) {
      setInput(result.transcript);
    }
  }, [result]);

  const initLeopard = async () => {
    try {
      await init(
        PICOVOICE_ACCESS_KEY,
        { publicPath: "/path/to/your/model/file.pv" },
        { enableAutomaticPunctuation: true }
      );
    } catch (err) {
      console.error("Failed to initialize Leopard:", err);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          key: WEATHER_API_KEY,
          q: 'auto:ip', // This will use the user's IP to get their location
          aqi: 'no'
        }
      });
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather({ current: { condition: { text: 'Unknown' } } });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    if (hour < 12) timeGreeting = "Good morning!";
    else if (hour < 18) timeGreeting = "Good afternoon!";
    else timeGreeting = "Good evening!";
    
    let weatherGreeting = '';
    if (weather && weather.current) {
      weatherGreeting = `The weather is currently ${weather.current.condition.text.toLowerCase()}.`;
    }

    return `${timeGreeting} ${weatherGreeting} I'm your AI assistant. What's your name?`;
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' && !image) return;

    const userMessage = { text: input, sender: 'user', image };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      if (!userName) {
        setUserName(input);
        const aiResponse = `Nice to meet you, ${input}! How can I assist you today? Feel free to ask me anything or even send an image for analysis!`;
        setMessages(prevMessages => [...prevMessages, userMessage, { text: aiResponse, sender: 'ai' }]);
      } else {
        let response;
        if (image) {
          const imageData = await getBase64(image);
          response = await fetch(`${API_URL_VISION}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: input || "What's in this image?" },
                  { inline_data: { mime_type: image.type, data: imageData.split(',')[1] } }
                ]
              }]
            }),
          });
        } else {
          response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] }),
          });
        }

        const data = await response.json();
        const aiMessage = { text: parseMessage(data.candidates[0].content.parts[0].text), sender: 'ai' };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = { text: 'Sorry, I encountered an error. Please try again.', sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }

    setIsTyping(false);
    setImage(null);
  };


  const parseMessage = (text) => {
    if (typeof text !== 'string') {
      console.error('Text is not a string:', text);
      return text;
    }

    const parts = text.split(/(\*\*.*?\*\*)|(```[\s\S]*?```)/g).filter(Boolean);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('```') && part.endsWith('```')) {
        const [, language, code] = part.match(/```(\w+)?\s*([\s\S]*?)```/) || [];
        return (
          <div key={index} className="relative">
            <SyntaxHighlighter
              language={language || 'javascript'}
              style={vscDarkPlus}
              className="rounded-md my-2"
            >
              {code}
            </SyntaxHighlighter>
            <button
              onClick={() => copyToClipboard(code)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <Copy size={16} />
            </button>
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Text copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy text');
    });
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setInput(`Analyze this image: ${file.name}`);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setImage(null);
    setIsTyping(false);
    setUserName('');
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
      setIsRecording(false);
    } else {
      await startRecording();
      setIsRecording(true);
    }
  };

  const readAloud = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getWeatherIcon = () => {
    switch(weather) {
      case 'sunny': return <Sun size={20} />;
      case 'cloudy': return <Cloud size={20} />;
      case 'rainy': return <CloudRain size={20} />;
      default: return null;
    }
  };

  const chatBackgroundStyle = {
    backgroundImage: theme === 'dark' 
      ? 'url("https://www.transparenttextures.com/patterns/cubes.png")'
      : 'url("https://www.transparenttextures.com/patterns/bright-squares.png")',
    backgroundBlendMode: 'overlay',
  };

  return (
    <>
      <motion.button
        className={`fixed bottom-4 right-4 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-400 to-green-400'} text-white p-4 rounded-full shadow-lg z-50`}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed top-0 right-0 w-96 h-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} shadow-2xl overflow-hidden z-40`}
          >
            <div className="flex flex-col h-full">
              <div className={`flex justify-between items-center ${theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-blue-400 to-green-400'} p-4`}>
                <h3 className="text-white font-bold text-lg">AI Assistant</h3>
                <div className="flex items-center space-x-2">
                  {getWeatherIcon()}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="text-white hover:text-gray-200"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>
              <div
                ref={chatContainerRef}
                className={`flex-grow overflow-y-auto p-4 space-y-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                style={chatBackgroundStyle}
              >
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`max-w-3/4 p-3 rounded-lg ${
                          message.sender === 'user'
                            ? theme === 'dark' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-400 to-blue-400'
                            : theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                        } ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                      >
                        {message.image && (
                          <img src={URL.createObjectURL(message.image)} alt="Uploaded" className="max-w-full h-auto rounded mb-2" />
                        )}
                        {message.text}
                        <div className="flex justify-end mt-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyToClipboard(message.text)}
                            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} mr-2`}
                          >
                            <Copy size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>readAloud(message.text)}
                            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                          >
                            <Volume2 size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-start"
                  >
                    <div className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} p-3 rounded-lg flex items-center`}>
                      <Loader className="animate-spin" size={20} />
                      <span className="ml-2">Typing...</span>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className={`p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current.click()}
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    <ImageIcon size={20} />
                  </motion.button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    <Trash size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleRecording}
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} ${isRecording ? 'text-red-500' : ''}`}
                  >
                    <Mic size={20} />
                  </motion.button>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className={`w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} ml-2`}
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer position="bottom-center" autoClose={3000} theme={theme} />
    </>
  );
};

export default AIChat;