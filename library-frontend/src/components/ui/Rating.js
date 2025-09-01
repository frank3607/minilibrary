 import React, { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const Rating = ({ value = 0, max = 5 }) => {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), max);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 0.5; // allows half-star
      setAnimatedValue(Math.min(current, safeValue));
      if (current >= safeValue) clearInterval(interval);
    }, 200); // delay per star
    return () => clearInterval(interval);
  }, [safeValue]);

  return (
    <div
      className="flex items-center space-x-1"
      aria-label={`Rating: ${safeValue} out of ${max}`}
    >
      {[...Array(max)].map((_, index) => {
        const starNumber = index + 1;
        const isFilled = animatedValue >= starNumber;
        const isHalf = animatedValue >= starNumber - 0.5 && animatedValue < starNumber;
        const shouldGlow = isFilled || isHalf;

        return (
          <span
            key={index}
            className={`transition-transform duration-300 ease-in-out hover:scale-110 ${
              shouldGlow ? 'animate-glow' : ''
            }`}
          >
            {isFilled ? (
              <FaStar className="text-yellow-500 drop-shadow-sm" />
            ) : isHalf ? (
              <FaStarHalfAlt className="text-yellow-500 drop-shadow-sm" />
            ) : (
              <FiStar className="text-gray-400" />
            )}
          </span>
        );
      })}
      <style>
        {`
          @keyframes glow {
            0% { transform: scale(0.8); filter: drop-shadow(0 0 0px gold); opacity: 0.6; }
            50% { transform: scale(1.2); filter: drop-shadow(0 0 8px gold); opacity: 1; }
            100% { transform: scale(1); filter: drop-shadow(0 0 0px gold); opacity: 1; }
          }
          .animate-glow {
            animation: glow 0.4s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Rating;
