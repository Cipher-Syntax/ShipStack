import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function StarRating({ rating = 0, onChange, size = 20, className = '', readOnly = false }) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseEnter = (index) => {
        if (!readOnly) setHoverRating(index);
    };

    const handleMouseLeave = () => {
        if (!readOnly) setHoverRating(0);
    };

    const handleClick = (index) => {
        if (!readOnly && onChange) {
            onChange(index);
        }
    };

    return (
        <div className={twMerge('flex items-center gap-1', className)}>
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={readOnly}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                        className={twMerge(
                            'transition-colors duration-200 focus:outline-none',
                            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                        )}
                    >
                        <Star
                            size={size}
                            className={twMerge(
                                isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-border-primary/50'
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
