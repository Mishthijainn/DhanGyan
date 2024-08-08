import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Upload, X, Share2, Copy, QrCode, Moon, Sun, Github, MessageCircle, Link } from 'lucide-react';
import { Widget } from '@uploadcare/react-widget';
import QRCode from 'qrcode.react';
import { useMouse } from 'react-use';
import axios from 'axios';

const CircleAnimation = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute inset-0 border border-primary/30 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.5, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 0.5,
        }}
      />
    ))}
  </div>
);

const ParticleSystem = () => {
  const count = 69; // Increased particle count
  const particles = [...Array(count)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-blue-400 rounded-full"
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{
        x: [0, Math.random() * 900 - 300], // Increased range
        y: [0, Math.random() * 900 - 300],
        opacity: [0, 1, 0],
        scale: [0, Math.random() * 2 + 0.5, 0], // Added scale animation
      }}
      transition={{
        duration: Math.random() * 5 + 3, // Increased duration
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut", // Smoother animation
      }}
    />
  ));
  return <>{particles}</>;
};

const LiveFileSharing = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [shareLinks, setShareLinks] = useState([]);
  const [shortLinks, setShortLinks] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const { elX, elY } = useMouse(containerRef);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, dimensions.height], [5, -5]);
  const rotateY = useTransform(mouseX, [0, dimensions.width], [-5, 5]);
  const controls = useAnimation();

  useEffect(() => {
    if (isOpen) {
      controls.start({
        scale: [0.9, 1.05, 1],
        transition: { duration: 0.5, ease: "easeOut" }
      });
    }
  }, [isOpen, controls]);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }, [isOpen]);

  useEffect(() => {
    mouseX.set(elX);
    mouseY.set(elY);
  }, [elX, elY]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

 const handleUpload = async (fileInfo) => {
    if (fileInfo) {
      setIsLoading(true);
      const longUrl = `https://ucarecdn.com/${fileInfo.uuid}/`;
      setShareLinks((prevLinks) => [...prevLinks, longUrl]);
      
      try {
        const response = await axios.post('https://api.tinyurl.com/create', {
          url: longUrl,
          domain: 'tiny.one'
        }, {
          headers: {
            'Authorization': `Bearer vjwX3ZgmYj8fsw4XzN5MbQoatqrWQWLGA7Soq3KuiDUZQPzehCrqCaZtidC0`,
            'Content-Type': 'application/json'
          }
        });
        setShortLinks((prevShortLinks) => [...prevShortLinks, response.data.data.tiny_url]);
      } catch (error) {
        console.error('Error shortening URL:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortLinks.join('\n') || shareLinks.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setShareLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
    setShortLinks((prevShortLinks) => prevShortLinks.filter((_, i) => i !== index));
    setSelectedFiles((prevSelected) => prevSelected.filter((_, i) => i !== index));
  };

  const toggleFileSelection = (index) => {
    setSelectedFiles((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter(i => i !== index);
      } else {
        return [...prevSelected, index];
      }
    });
  };

  const generateQR = () => {
    if (selectedFiles.length === 0) return;
    const urls = selectedFiles.map(index => shortLinks[index] || shareLinks[index]);
    setShowQR(urls.join(','));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  if (!isOpen) return null;

 return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.9, y: 50 }}
        animate={controls}
        exit={{ scale: 0.9, y: 50 }}
        style={{ rotateX, rotateY, perspective: 1000 }}
        className={`relative w-full max-w-md p-6 rounded-2xl overflow-hidden 
                    ${darkMode ? 'bg-gray-900/80 text-white' : 'bg-white/80 text-gray-900'}
                    backdrop-blur-lg border border-primary/10 shadow-xl`}
      >
        <CircleAnimation />
        <ParticleSystem />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
        <motion.h2 
          className="text-3xl font-bold mb-6 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          FAST File Sharing
        </motion.h2>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            {...getRootProps()}
            className={`border-dashed border-2 rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary hover:bg-primary/5'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-4" size={48} />
            <p>Drag & drop files here, or click to select</p>
          </motion.div>
        </motion.div>

       <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2"
            >
              {files.map((file, index) => (
                <motion.div
                  key={file.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer
                              ${selectedFiles.includes(index) ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-800'}`}
                  onClick={() => toggleFileSelection(index)}
                >
                  <span className="truncate">{file.name}</span>
                  <div className="flex items-center space-x-2">
                    {shortLinks[index] && (
                      <Link size={16} className="text-primary" />
                    )}
                    <button onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="text-red-500 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="mt-6 flex justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Widget
            publicKey="625ea4f6799cf4e6718e"
            onChange={handleUpload}
            multiple
            className="uploadcare-button"
          />
        </motion.div>

        {shareLinks.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 space-y-4"
          >
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareLinks.join('\n')}
                readOnly
                className="input input-bordered flex-grow"
              />
              <motion.button
                onClick={handleCopy}
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? 'Copied!' : <Copy size={20} />}
              </motion.button>
            </div>
            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={() => setShowQR(!showQR)}
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <QrCode className="mr-2" size={20} />
                {showQR ? 'Hide QR' : 'Show QR'}
              </motion.button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showQR && shareLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-6 flex justify-center"
            >
              <QRCode value={shareLinks[0]} size={200} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex justify-center space-x-4"
        >
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="btn btn-ghost"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          <motion.a
  href="https://github.com"
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-ghost"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
>
  <Github size={20} />
</motion.a>

        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LiveFileSharing;