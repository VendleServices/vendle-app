import { useState, useEffect } from 'react';

export const useParallaxImages = (totalImages: number, interval: number = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, interval);

    return () => clearInterval(timer);
  }, [totalImages, interval]);

  return currentIndex;
}; 