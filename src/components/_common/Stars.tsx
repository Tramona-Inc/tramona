/* src/components/_common/Stars.tsx */
import React from 'react';
import { Star } from 'lucide-react';
import { range } from 'lodash';

interface StarsProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
}

const Stars: React.FC<StarsProps> = ({ rating, size = 'medium' }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  const sizeClass = size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <div className="flex items-center space-x-1">
      {[range(fullStars)].map((_, index) => (
        <Star key={`full-${index}`} className={`text-teal-900 ${sizeClass}`} fill="currentColor" />
      ))}

      {[range(emptyStars)].map((_, index) => (
        <Star key={`empty-${index}`} className={`text-gray-300 ${sizeClass}`} fill="none" stroke="currentColor" />
      ))}
    </div>
  );
};

export default Stars;
