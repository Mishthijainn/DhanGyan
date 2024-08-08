import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Trash2, Download, X, Hand, Pencil, Eraser, Palette, Shapes, Circle, Type, Undo, Redo, Wind, Maximize2, Square, MinusSquare } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import { recognize } from 'js-simplify';
import * as tf from '@tensorflow/tfjs';

const AIScribble = ({ onClose, onScoreUpdate }) => {
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [isHandposeReady, setIsHandposeReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(5);
  const [eraserSize, setEraserSize] = useState(20);
  const [gesture, setGesture] = useState('');
  const [toolMode, setToolMode] = useState('draw');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [recognizedShape, setRecognizedShape] = useState(null);
  const [score, setScore] = useState(0);
  const [writingMode, setWritingMode] = useState(false);
  const [shakiness, setShakiness] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isDrawingStraightLine, setIsDrawingStraightLine] = useState(false);
  const [layers, setLayers] = useState([{ id: 1, visible: true }]);
  const [activeLayer, setActiveLayer] = useState(1);
  const [webcamError, setWebcamError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const handposeModelRef = useRef(null);
  const lastPointRef = useRef(null);
  const pathRef = useRef([]);
  const straightLineStartRef = useRef(null);

  const loadHandposeModel = useCallback(async () => {
    try {
      setLoadingStatus('Loading Handpose model...');
      handposeModelRef.current = await handpose.load();
      setIsHandposeReady(true);
      setLoadingStatus('Handpose model loaded successfully!');
      setError(null);
    } catch (err) {
      console.error('Error loading Handpose model:', err);
      setError(`Failed to load Handpose model. Please check your internet connection and try again.`);
      setIsHandposeReady(false);
    }
  }, []);

  const distance = (a, b) => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  };

  useEffect(() => {
    loadHandposeModel();
  }, [loadHandposeModel]);

  const drawOnCanvas = useCallback((ctx, x, y) => {
    const canvasWidth = ctx.canvas.width;
    const adjustedX = canvasWidth - x;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
  
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
  
    if (!lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(adjustedX, y);
    } else {
      const lastX = canvasWidth - lastPointRef.current.x;
      const lastY = lastPointRef.current.y;
      const controlX = lastX + (Math.random() - 0.5) * shakiness;
      const controlY = lastY + (Math.random() - 0.5) * shakiness;
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.quadraticCurveTo(controlX, controlY, adjustedX, y);
    }
    ctx.stroke();
  
    lastPointRef.current = { x, y };
    pathRef.current.push([adjustedX, y]);
  }, [currentColor, brushSize, shakiness]);

  const drawStraightLine = useCallback((ctx, startX, startY, endX, endY) => {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }, [currentColor, brushSize]);

  const eraseFromCanvas = useCallback((ctx, x, y) => {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, eraserSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }, [eraserSize]);

  const handleBrushSizeChange = useCallback((delta) => {
    setBrushSize(prevSize => Math.max(1, Math.min(prevSize + delta, 20)));
  }, []);

  const recognizeShape = useCallback(() => {
    if (pathRef.current.length < 10) return;
    const result = recognize(pathRef.current);
    const shapes = ['circle', 'rectangle', 'triangle', 'line', 'arrow'];
    setRecognizedShape(shapes.includes(result) ? result : 'unknown');
    if (shapes.includes(result)) {
      setScore(prevScore => prevScore + 10);
    }
  }, []);

  const handleGesture = useCallback((gesture, hand, ctx) => {
    const indexTip = hand.annotations.indexFinger[3];
    const [x, y] = [indexTip[0], indexTip[1]];
    
    switch (gesture) {
      case 'point':
        setToolMode('draw');
        if (writingMode) {
          if (isDrawingStraightLine) {
            if (!straightLineStartRef.current) {
              straightLineStartRef.current = { x, y };
            } else {
              drawStraightLine(ctx, straightLineStartRef.current.x, straightLineStartRef.current.y, x, y);
              straightLineStartRef.current = null;
              saveToUndoStack();
            }
          } else {
            drawOnCanvas(ctx, x, y);
          }
        }
        break;
      case 'peace':
        setToolMode('color');
        setShowColorPicker(true);
        break;
      case 'palm':
        setToolMode('erase');
        if (writingMode) {
          eraseFromCanvas(ctx, x, y);
        }
        break;
      case 'fist':
        setToolMode('move');
        lastPointRef.current = null;
        pathRef.current = [];
        break;
      case 'thumbsUp':
        recognizeShape();
        break;
      case 'pinch':
        setWritingMode(!writingMode);
        break;
      case 'spread':
        setShakiness(prevShakiness => Math.min(prevShakiness + 5, 20));
        break;
      case 'rock':
        setShakiness(prevShakiness => Math.max(prevShakiness - 5, 0));
        break;
    }
  }, [drawOnCanvas, eraseFromCanvas, recognizeShape, writingMode, isDrawingStraightLine, drawStraightLine]);

  const recognizeGesture = useCallback((hand) => {
    const thumb = hand.annotations.thumb;
    const indexFinger = hand.annotations.indexFinger;
    const middleFinger = hand.annotations.middleFinger;
    const ringFinger = hand.annotations.ringFinger;
    const pinky = hand.annotations.pinky;
  
    const thumbTip = thumb[3];
    const indexTip = indexFinger[3];
    const middleTip = middleFinger[3];
    const ringTip = ringFinger[3];
    const pinkyTip = pinky[3];
  
    const thumbIndexDistance = distance(thumbTip, indexTip);
    const indexMiddleDistance = distance(indexTip, middleTip);
    const middleRingDistance = distance(middleTip, ringTip);
    const ringPinkyDistance = distance(ringTip, pinkyTip);
  
    if (thumbIndexDistance < 30 && indexMiddleDistance > 40) return 'point';
    if (indexMiddleDistance < 30 && middleRingDistance > 40) return 'peace';
    if (indexMiddleDistance < 30 && middleRingDistance < 30 && ringPinkyDistance < 30) return 'palm';
    if (thumbIndexDistance < 30 && indexMiddleDistance < 30 && middleRingDistance < 30 && ringPinkyDistance < 30) return 'fist';
    if (thumbTip[1] < indexTip[1] && thumbTip[1] < middleTip[1] && thumbTip[1] < ringTip[1] && thumbTip[1] < pinkyTip[1]) return 'thumbsUp';
    if (distance(thumbTip, indexTip) < 20) return 'pinch';
    if (indexMiddleDistance > 50 && middleRingDistance > 50 && ringPinkyDistance > 50) return 'spread';
    if (indexTip[1] > middleTip[1] && middleTip[1] > ringTip[1] && ringTip[1] > pinkyTip[1]) return 'rock';
    return 'open';
  }, []);

  const processFrame = useCallback(async () => {
    if (!isPlaying || !handposeModelRef.current) return;
  
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const drawingCtx = drawingCanvas.getContext('2d');
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    ctx.drawImage(drawingCanvas, 0, 0);
    
    if (showGrid) {
      drawGrid(ctx);
    }
    
    try {
      const predictions = await handposeModelRef.current.estimateHands(video);
      if (predictions.length > 0) {
        const hand = predictions[0];
        const gesture = recognizeGesture(hand);
        setGesture(gesture);
        handleGesture(gesture, hand, drawingCtx);
      } else {
        lastPointRef.current = null;
      }
    } catch (err) {
      console.error('Error in hand pose estimation:', err);
    }
  
    requestAnimationFrame(processFrame);
  }, [isPlaying, handleGesture, recognizeGesture, showGrid]);

  const initializeGame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;

    if (!video || !canvas || !drawingCanvas) {
      console.error("Video or canvas elements not found");
      return;
    }

    const ctx = canvas.getContext('2d');
    const drawingCtx = drawingCanvas.getContext('2d');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawingCanvas.width = video.videoWidth;
      drawingCanvas.height = video.videoHeight;

      setWebcamError(null);
      requestAnimationFrame(processFrame);
    } catch (err) {
      console.error("Error accessing the webcam", err);
      setWebcamError("Failed to access the webcam. Please ensure you've granted the necessary permissions.");
    }
  }, [processFrame]);


  useEffect(() => {
    if (isPlaying && isHandposeReady) {
      initializeGame();
    }
  }, [isPlaying, isHandposeReady, initializeGame]);

  const handleClearCanvas = () => {
    const drawingCanvas = drawingCanvasRef.current;
    const drawingCtx = drawingCanvas.getContext('2d');
    saveToUndoStack();
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    setRecognizedShape(null);
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const drawingCanvas = drawingCanvasRef.current;
      const drawingCtx = drawingCanvas.getContext('2d');
      const lastAction = undoStack.pop();
      setRedoStack(prevStack => [...prevStack, drawingCanvas.toDataURL()]);
      setUndoStack([...undoStack]);
      const img = new Image();
      img.onload = () => {
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawingCtx.drawImage(img, 0, 0);
      };
      img.src = lastAction;
    }
  }, [undoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const drawingCanvas = drawingCanvasRef.current;
      const drawingCtx = drawingCanvas.getContext('2d');
      const nextAction = redoStack.pop();
      saveToUndoStack();
      setRedoStack([...redoStack]);
      const img = new Image();
      img.onload = () => {
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        drawingCtx.drawImage(img, 0, 0);
      };
      img.src = nextAction;
    }
  }, [redoStack]);

  const saveToUndoStack = useCallback(() => {
    const drawingCanvas = drawingCanvasRef.current;
    setUndoStack(prevStack => [...prevStack, drawingCanvas.toDataURL()]);
    setRedoStack([]);
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'ai-scribble-drawing.png';
    link.href = dataURL;
    link.click();
  };

  const handleClose = () => {
    onScoreUpdate(score);
    onClose();
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const drawGrid = (ctx) => {
    const gridSize = 20;
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
    }

    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
    }

    ctx.stroke();
  };

  const ColorPalette = () => (
    <div className="flex space-x-2 mt-2">
      {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#000000'].map(color => (
        <button
          key={color}
          className={`w-6 h-6 rounded-full border-2 ${color === currentColor ? 'border-white' : 'border-transparent'}`}
          style={{backgroundColor: color}}
          onClick={() => setCurrentColor(color)}
        />
      ))}
    </div>
  );

  const LayerManager = () => (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Layers</h3>
      {layers.map(layer => (
        <div key={layer.id} className="flex items-center space-x-2 mb-1">
          <input
            type="checkbox"
            checked={layer.visible}
            onChange={() => toggleLayerVisibility(layer.id)}
          />
          <span className={layer.id === activeLayer ? 'font-bold' : ''}>
            Layer {layer.id}
          </span>
          <button onClick={() => setActiveLayer(layer.id)} className="px-2 py-1 bg-blue-500 text-white rounded">
            Activate
          </button>
        </div>
      ))}
      <button onClick={addNewLayer} className="mt-2 px-2 py-1 bg-green-500 text-white rounded">
        Add Layer
      </button>
    </div>
  );

  const toggleLayerVisibility = (layerId) => {
    setLayers(prevLayers => prevLayers.map(layer => 
      layer.id === layerId ? {...layer, visible: !layer.visible} : layer
    ));
  };

  const addNewLayer = () => {
    const newLayerId = layers.length + 1;
    setLayers(prevLayers => [...prevLayers, { id: newLayerId, visible: true }]);
    setActiveLayer(newLayerId);
  };

  return (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 ${isFullscreen ? 'fullscreen' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-6xl h-[90vh] text-white relative"
      >
        <h2 className="text-3xl font-bold mb-4 text-purple-400">AI Scribble</h2>
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <AnimatePresence>
        {webcamError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-600 text-white p-4 rounded-md mb-4 relative"
          >
              <p>{webcamError}</p>
            <button
              onClick={() => setWebcamError(null)}
              className="absolute top-2 right-2 text-white hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
        {!isHandposeReady ? (
          <div className="text-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"
            ></motion.div>
            <p>{loadingStatus}</p>
          </div>
        ) : (
          <div className="relative h-[calc(100%-6rem)]">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted></video>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
            <canvas ref={drawingCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none"></canvas>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-2 left-2 bg-gray-800/80 p-2 rounded"
            >
              Current Gesture: {gesture}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-2 right-2 bg-gray-800/80 p-2 rounded"
            >
              Tool: {toolMode}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-14 right-2 bg-gray-800/80 p-2 rounded"
            >
              Writing Mode: {writingMode ? 'On' : 'Off'}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-26 right-2 bg-gray-800/80 p-2 rounded"
            >
              Shakiness: {shakiness}
            </motion.div>
            <AnimatePresence>
              {recognizedShape && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute bottom-2 left-2 bg-green-500/80 p-2 rounded"
                >
                  Recognized Shape: {recognizedShape}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div className="mt-4 flex flex-wrap justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn bg-purple-600 hover:bg-purple-700 text-white p-2 rounded"
          >
            {isPlaying ? <Pause /> : <Play />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleBrushSizeChange(1)}
            className="btn bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            <ZoomIn />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleBrushSizeChange(-1)}
            className="btn bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            <ZoomOut />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleUndo}
            className="btn bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded"
          >
            <Undo />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRedo}
            className="btn bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded"
          >
            <Redo />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClearCanvas}
            className="btn bg-red-600 hover:bg-red-700 text-white p-2 rounded"
          >
            <Trash2 />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDownload}
            className="btn bg-green-600 hover:bg-green-700 text-white p-2 rounded"
          >
            <Download />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setWritingMode(!writingMode)}
            className={`btn ${writingMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'} text-white p-2 rounded`}
          >
            <Type />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className="btn bg-teal-600 hover:bg-teal-700 text-white p-2 rounded"
          >
            <Maximize2 />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowGrid(!showGrid)}
            className={`btn ${showGrid ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-600 hover:bg-gray-700'} text-white p-2 rounded`}
          >
            <Square />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDrawingStraightLine(!isDrawingStraightLine)}
            className={`btn ${isDrawingStraightLine ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-600 hover:bg-gray-700'} text-white p-2 rounded`}
          >
            <MinusSquare />
          </motion.button>
        </div>
        <ColorPalette />
        <div className="mt-4">
          <label htmlFor="eraserSize" className="block mb-2">Eraser Size: {eraserSize}</label>
          <input 
            type="range" 
            id="eraserSize"
            min="1" 
            max="50" 
            value={eraserSize} 
            onChange={(e) => setEraserSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <LayerManager />
        <AnimatePresence>
          {showColorPicker && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-4 flex justify-center"
            >
              <HexColorPicker color={currentColor} onChange={setCurrentColor} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-4 text-center text-gray-300">
          <p>Gestures:</p>
          <div className="flex flex-wrap justify-center space-x-4 mt-2">
            <div className="flex items-center">
              <Hand size={24} className="mr-2" /> Palm = Erase
            </div>
            <div className="flex items-center">
              <Pencil size={24} className="mr-2" /> Point = Draw
            </div>
            <div className="flex items-center">
              <Palette size={24} className="mr-2" /> Peace Sign = Change Color
            </div>
            <div className="flex items-center">
              <Shapes size={24} className="mr-2" /> Thumbs Up = Recognize Shape
            </div>
            <div className="flex items-center">
              <Circle size={24} className="mr-2" /> Pinch = Toggle Writing Mode
            </div>
            <div className="flex items-center">
              <Wind size={24} className="mr-2" /> Spread Fingers = Increase Shakiness
            </div>
            <div className="flex items-center">
              <Eraser size={24} className="mr-2" /> Rock = Decrease Shakiness
            </div>
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-2xl font-bold text-yellow-400"
        >
          Score: {score}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AIScribble;