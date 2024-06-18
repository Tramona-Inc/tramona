/* src/components/_common/Stars.tsx */
import React from 'react';
import { Star } from 'lucide-react';

interface StarsProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Stars component to display rating using stars
 * @param {number} rating - The rating to display (0 to 5)
 * @param {string} size - The size of the stars ('small', 'medium', 'large')
 */
const Stars: React.FC<StarsProps> = ({ rating, size = 'medium' }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  const sizeClass = size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, index) => (
        <Star key={`full-${index}`} className={`text-teal-900 ${sizeClass}`} fill="currentColor" />
      ))}

      {[...Array(emptyStars)].map((_, index) => (
        <Star key={`empty-${index}`} className={`text-gray-300 ${sizeClass}`} fill="none" stroke="currentColor" />
      ))}
    </div>
  );
};

export default Stars;
