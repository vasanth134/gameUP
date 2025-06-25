import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface TaskStatusDropdownProps {
  taskId: number;
  currentStatus: string;
  onStatusUpdate: (taskId: number, newStatus: string) => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
  { value: 'submitted', label: 'Submitted', color: 'text-blue-600' },
  { value: 'approved', label: 'Approved', color: 'text-green-600' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-600' },
  { value: 'not_submitted', label: 'Not Submitted', color: 'text-gray-600' },
];

export const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({
  taskId,
  currentStatus,
  onStatusUpdate,
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await API.put(`/tasks/${taskId}/status`, { 
        status: newStatus,
        parentId: user?.id 
      });
      onStatusUpdate(taskId, newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update task status:', error);
      alert('Failed to update task status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentOption = statusOptions.find(option => option.value === currentStatus);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className="flex items-center space-x-2 px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
      >
        <span className={`text-sm font-medium ${currentOption?.color || 'text-gray-600'}`}>
          {currentOption?.label || 'Unknown'}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-100 ${
                  option.value === currentStatus ? 'bg-blue-50' : ''
                }`}
              >
                <span className={option.color}>{option.label}</span>
                {option.value === currentStatus && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-md flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};
