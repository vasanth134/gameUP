import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-full',
        // Variants
        {
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'danger',
          'bg-blue-100 text-blue-800': variant === 'info',
        },
        // Sizes
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        },
        className
      )}
    >
      {children}
    </span>
  );
};

// Task status specific badges
export const TaskStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'submitted':
        return 'info';
      case 'reviewed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </Badge>
  );
};
