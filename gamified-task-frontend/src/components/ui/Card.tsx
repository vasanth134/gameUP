import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false,
  gradient = false 
}) => {
  return (
    <div
      className={clsx(
        'rounded-2xl shadow-lg transition-all duration-300',
        {
          'bg-white border border-gray-100': !gradient,
          'bg-gradient-to-br from-white to-gray-50 border border-gray-200': gradient,
          'hover:shadow-xl hover:-translate-y-1 cursor-pointer': hover,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={clsx('px-6 py-4 border-b border-gray-100', className)}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={clsx('px-6 py-4', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={clsx('px-6 py-4 border-t border-gray-100', className)}>
    {children}
  </div>
);
