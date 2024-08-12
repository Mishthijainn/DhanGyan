import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Briefcase, BookOpen, Search, ChevronDown, ChevronUp, 
  Calendar, MapPin, DollarSign, Clock, Award
} from 'lucide-react';

const API_KEY = 'e1c172c7e9msh89d49113a771d76p19c7d3jsnd9559d808b7b';
const API_HOST = 'sarkari-result.p.rapidapi.com';

const CareerDevelopment = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('admissions');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`https://${API_HOST}/scrape/${activeTab}`, {
          headers: {
            'X-RapidAPI-Host': API_HOST,
            'X-RapidAPI-Key': API_KEY
          }
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to fetch ${activeTab} data. Please try again later.`);
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TabButton = ({ name, icon: Icon, isActive }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActiveTab(name)}
      className={`flex items-center px-4 py-2 rounded-full ${
        isActive ? 'bg-white text-purple-600' : 'text-white'
      }`}
    >
      <Icon className="mr-2" size={20} />
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </motion.button>
  );

  const DataCard = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white p-4 rounded-lg shadow-md mb-4"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
            <p className="text-gray-600">{item.organization || 'N/A'}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </motion.button>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              {item.date && <p className="text-gray-700 mb-2"><Calendar className="inline mr-2" size={16} /> {item.date}</p>}
              {item.location && <p className="text-gray-700 mb-2"><MapPin className="inline mr-2" size={16} /> {item.location}</p>}
              {item.details && <p className="text-gray-700">{item.details}</p>}
              <motion.a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-full inline-block"
              >
                Learn More
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-purple-600">Loading {activeTab}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button onClick={() => setActiveTab(activeTab)} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-full">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="career-development bg-gradient-to-r from-purple-500 to-indigo-600 p-4 md:p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-6">Career Development</h2>
      
      <div className="flex space-x-4 mb-6">
        <TabButton name="admissions" icon={Briefcase} isActive={activeTab === 'admissions'} />
        <TabButton name="results" icon={BookOpen} isActive={activeTab === 'results'} />
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => <DataCard key={index} item={item} />)
          ) : (
            <p className="text-white text-center">No {activeTab} found. Try a different search term.</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CareerDevelopment;