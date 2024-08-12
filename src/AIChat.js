import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Loader, Image as ImageIcon, Trash, Copy, Mic, Volume2, Sun, Moon, Cloud, CloudRain, Thermometer } from 'lucide-react';
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
const WEATHER_API_KEY = '38bbd278ec684e78921132440240308';
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
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript;
                setTranscript(transcript);
                setInput(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            console.log('Speech recognition not supported');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

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

    const handleImageIconClick = () => {
        fileInputRef.current.click();
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setInput(`Analyze this image: ${file.name}`);
        }
    };

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

    const Avatar = ({ children, className}) => (
      <motion.div
        className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${className}`}
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4158D0" />
              <stop offset="50%" stopColor="#C850C0" />
              <stop offset="100%" stopColor="#FFCC70" />
            </linearGradient>
          </defs>
          
          <circle cx="50" cy="50" r="48" fill="url(#glowGradient)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="50" cy="50" r="40" fill="url(#bodyGradient)">
            <animate attributeName="r" values="40;42;40" dur="2s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="35" cy="45" r="8" fill="white">
            <animate attributeName="cy" values="45;43;45" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="45" r="8" fill="white">
            <animate attributeName="cy" values="45;43;45" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="45" r="4" fill="#333">
            <animate attributeName="cx" values="33;37;33" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="45" r="4" fill="#333">
            <animate attributeName="cx" values="63;67;63" dur="3s" repeatCount="indefinite" />
          </circle>
          
          <path d="M 30 65 Q 50 80 70 65" stroke="white" strokeWidth="4" fill="none">
            <animate attributeName="d" values="M 30 65 Q 50 80 70 65; M 30 75 Q 50 60 70 75; M 30 65 Q 50 80 70 65" dur="5s" repeatCount="indefinite" />
          </path>
          
          <line x1="50" y1="10" x2="50" y2="20" stroke="white" strokeWidth="2">
            <animate attributeName="y2" values="20;18;20" dur="1s" repeatCount="indefinite" />
          </line>
          <circle cx="50" cy="8" r="3" fill="white">
            <animate attributeName="r" values="3;4;3" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.div>
    );
    
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
                    q: 'auto:ip',
                    aqi: 'no'
                }
            });
            setWeather(response.data);
        } catch (error) {
            console.error('Error fetching weather:', error);
            setWeather({ current: { condition: { text: 'Cloudy' } } });
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        let timeGreeting = '';
        if (hour < 5) timeGreeting = "Happy late night";
        else if (hour < 12) timeGreeting = "Good morning";
        else if (hour < 18) timeGreeting = "Good afternoon";
        else timeGreeting = "Good evening";

        let weatherGreeting = '';
        if (weather && weather.current) {
            weatherGreeting = `Hello I am Prisha your Ai Whats your Name ?  The weather is currently ${weather.current.condition.text.toLowerCase()}.`;
        }

        return `${timeGreeting}, ${userName}! ${weatherGreeting}`;
    };
    const handleSendMessage = async () => {
        if (input.trim() === '' && !image) return;

        const userMessage = { text: input, sender: 'user', image };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            if (!userName) {
                setUserName(input);
                const aiResponse = `Nice to meet you, ${input}! How can I assist you today? Feel free to ask me anything or even send an image for analysis!`;
                setMessages(prevMessages => [...prevMessages, { text: aiResponse, sender: 'ai' }]);
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

        const parts = text.split(/(\*\*.*?\*\*)|(```[\s\S]*?```)|(\n\s*[-*]\s.*)/g).filter(Boolean);

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
            if (part.match(/^\n\s*[-*]\s/)) {
                return <li key={index}>{part.replace(/^\n\s*[-*]\s/, '')}</li>;
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
      if (!weather || !weather.current) {
          return <Thermometer size={20} />;
      }
  
      const { temp_c, condition } = weather.current;
      const { text } = condition;
  
      return (
          <div className="flex items-center">
              {(() => {
                  switch (text.toLowerCase()) {
                      case 'sunny': return <Sun size={20} />;
                      case 'cloudy': return <Cloud size={20} />;
                      case 'rainy': return <CloudRain size={20} />;
                      default: return <Thermometer size={20} />;
                  }
              })()}
              <span className="ml-1">{temp_c}°C</span>
          </div>
      );
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
                                <h3 className="text-white font-bold text-lg">PRISM Ai ⟁</h3>
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
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-end mb-4`}
                                        >
                                            {message.sender === 'ai' && (
                                                <Avatar className="mr-2">AI</Avatar>
                                            )}
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
                                                        onClick={() => readAloud(message.text)}
                                                        className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                                    >
                                                        <Volume2 size={16} />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                            {message.sender === 'user' && (
                                                <Avatar className="ml-2">
                                                    {userName ? userName[0].toUpperCase() : 'U'}
                                                </Avatar>
                                            )}
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
                                        onClick={handleImageIconClick}
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
                                        onClick={toggleListening}
                                        className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} ${isListening ? 'text-red-500' : ''} relative`}
                                    >
                                        <Mic size={20} />
                                        <AnimatePresence>
                                            {isListening && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                                                >
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ repeat: Infinity, duration: 1 }}
                                                        className="w-full h-full bg-red-500 rounded-full opacity-75"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                </div>
                                <div className="flex items-center relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder={isListening ? 'Listening...' : 'Type a message...'}
                                        className={`w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                    />
                                    <AnimatePresence>
                                        {isListening && (
                                            <motion.div
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="absolute right-10 top-1/2 transform -translate-y-1/2"
                                            >
                                                <motion.div
                                                    animate={{ scaleY: [1, 2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                                    className={`w-1 h-4 mx-0.5 ${theme === 'dark' ? 'bg-purple-500' : 'bg-blue-500'}`}
                                                />
                                                <motion.div
                                                    animate={{ scaleY: [1, 1.5, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                                                    className={`w-1 h-4 mx-0.5 ${theme === 'dark' ? 'bg-pink-500' : 'bg-green-500'}`}
                                                />
                                                <motion.div
                                                    animate={{ scaleY: [1, 1.8, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.5, delay: 0.4 }}
                                                    className={`w-1 h-4 mx-0.5 ${theme === 'dark' ? 'bg-purple-500' : 'bg-blue-500'}`}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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