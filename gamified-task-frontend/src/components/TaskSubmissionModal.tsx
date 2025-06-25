import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, FileText, Send, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import API from '../services/api';
import toast from 'react-hot-toast';

interface TaskSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: number;
    title: string;
    description: string;
    xp_reward: number;
  };
  childId: number;
  onSubmissionSuccess: () => void;
}

const TaskSubmissionModal: React.FC<TaskSubmissionModalProps> = ({
  isOpen,
  onClose,
  task,
  childId,
  onSubmissionSuccess,
}) => {
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitWithoutPhoto, setSubmitWithoutPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!submissionText.trim() && !selectedFile && !submitWithoutPhoto) {
      toast.error('Please add some text or upload a photo');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('task_id', task.id.toString());
      formData.append('child_id', childId.toString());
      formData.append('submission_text', submissionText.trim() || 'Task completed');

      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      const endpoint = selectedFile ? '/submissions/upload' : '/submissions';
      const response = await API.post(endpoint, formData, {
        headers: {
          'Content-Type': selectedFile ? 'multipart/form-data' : 'application/json',
        },
      });

      if (response.data.success) {
        toast.success('🎉 Task submitted successfully!');
        onSubmissionSuccess();
        onClose();
        // Reset form
        setSubmissionText('');
        setSelectedFile(null);
        setPreviewUrl(null);
        setSubmitWithoutPhoto(false);
      }
    } catch (error: any) {
      console.error('Submission failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit task';
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSubmissionText('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setSubmitWithoutPhoto(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">📤 Submit Task</h2>
                    <p className="text-gray-600 mt-1">{task.title}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Task Info */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-gray-700 text-sm mb-3">{task.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      🌟 {task.xp_reward} XP Reward
                    </span>
                  </div>
                </div>

                {/* Submission Text */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Tell us about your work
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Describe what you did to complete this task..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Photo Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Camera className="h-4 w-4 inline mr-1" />
                    Add a photo (optional)
                  </label>
                  
                  {!previewUrl ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Click to upload a photo</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={removeFile}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit without photo option */}
                {!selectedFile && !submissionText.trim() && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800 mb-2">
                          You can submit this task without a photo or description.
                        </p>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={submitWithoutPhoto}
                            onChange={(e) => setSubmitWithoutPhoto(e.target.checked)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            disabled={isSubmitting}
                          />
                          <span className="text-sm text-yellow-700">
                            Submit as completed (no photo/description needed)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || (!submissionText.trim() && !selectedFile && !submitWithoutPhoto)}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Task
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskSubmissionModal;
