import React, { useEffect, useRef } from 'react';

const StarField = () => {
  const starRef = useRef(null);

  useEffect(() => {
    const generateStars = () => {
      const starCount = 200;
      let i = 0;
      while (i < starCount) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starRef.current.appendChild(star);
        i++;
      }
    };

    generateStars();
  }, []);

  return <div ref={starRef} className="star-field absolute inset-0 overflow-hidden"></div>;
};

export default StarField;