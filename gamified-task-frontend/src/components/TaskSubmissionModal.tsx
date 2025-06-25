import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, FileText, Send, File, Image, Video, Music, Presentation } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'ppt':
      case 'pptx':
        return <Presentation className="h-8 w-8 text-orange-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="h-8 w-8 text-purple-500" />;
      case 'mp3':
      case 'wav':
        return <Music className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const isImageFile = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension || '');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (based on backend allowed types)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 
                           'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                           'video/mp4', 'audio/mp3', 'audio/wav'];
      const allowedExtensions = ['jpeg', 'jpg', 'png', 'pdf', 'ppt', 'pptx', 'mp4', 'mp3', 'wav'];
      
      const extension = file.name.toLowerCase().split('.').pop();
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension || '')) {
        toast.error('File type not supported. Allowed: Images, PDF, PowerPoint, MP4, MP3, WAV');
        return;
      }

      // Validate file size (max 50MB as per backend)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview for images
      if (isImageFile(file.name)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
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
    // Require either text feedback or file upload (or both)
    if (!submissionText.trim() && !selectedFile) {
      toast.error('Please provide feedback AND/OR upload a file to submit your task');
      return;
    }

    // Encourage both feedback and file for better submissions
    if (!submissionText.trim()) {
      toast.error('Please add your feedback and thoughts about this task');
      return;
    }

    if (!selectedFile) {
      // Ask for confirmation if no file is uploaded
      const confirmed = window.confirm(
        'You haven\'t uploaded any file. Most tasks require uploading photos or files of your work. Are you sure you want to submit without a file?'
      );
      if (!confirmed) return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('task_id', task.id.toString());
      formData.append('child_id', childId.toString());
      formData.append('submission_text', submissionText.trim());

      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      const endpoint = selectedFile ? '/submissions/upload' : '/submissions';
      const response = await API.post(endpoint, formData, {
        headers: selectedFile ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        toast.success('🎉 Great job! Your task has been submitted successfully!');
        onSubmissionSuccess();
        onClose();
        // Reset form
        setSubmissionText('');
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        toast.error('Failed to submit task. Please try again.');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to submit task');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSubmissionText('');
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                    <p className="text-sm text-purple-600 font-medium">Reward: {task.xp_reward} XP</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Task Description */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2">Task Instructions:</h3>
                  <p className="text-blue-800">{task.description}</p>
                </div>

                {/* Submission Text Area */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Task Feedback & Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Please describe:
• What you did to complete this task
• What you learned from this task
• Any challenges you faced
• Questions or feedback for your parent/teacher"
                    disabled={isSubmitting}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[140px] resize-vertical text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 <strong>Tip:</strong> The more details you share, the better feedback you'll receive!
                  </p>
                </div>

                {/* File Upload Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    � Upload Your Work (Required for most tasks)
                  </label>
                  
                  {!selectedFile ? (
                    <div className="space-y-3">
                      {/* Main Upload Area */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer bg-gradient-to-br from-purple-25 to-blue-25"
                      >
                        <div className="flex justify-center mb-4">
                          <div className="p-3 bg-purple-100 rounded-full">
                            <Camera className="h-8 w-8 text-purple-600" />
                          </div>
                        </div>
                        <p className="text-gray-700 font-medium mb-2">📷 Take a Photo or Upload File</p>
                        <p className="text-sm text-gray-600 mb-3">
                          Upload photos of your homework, projects, drawings, or any files
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">📷 Photos</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">📄 PDF</span>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">📊 PPT</span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">🎵 Audio</span>
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">🎥 Video</span>
                        </div>
                      </div>
                      
                      {/* Helper Text */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <div className="text-blue-500 mt-0.5">💡</div>
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Examples of what to upload:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside">
                              <li>Photos of completed homework or worksheets</li>
                              <li>Pictures of art projects, crafts, or experiments</li>
                              <li>Videos of presentations or demonstrations</li>
                              <li>Audio recordings of reading or speaking practice</li>
                              <li>PDF documents or presentation files</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-green-300 rounded-lg p-4 bg-green-50">
                      {/* Image Preview */}
                      {previewUrl ? (
                        <div className="relative mb-4">
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg border-2 border-green-300 shadow-sm"
                            />
                            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              ✅ Ready to submit
                            </div>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={removeFile}
                            disabled={isSubmitting}
                            className="absolute top-2 right-2 bg-white shadow-md hover:bg-gray-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        /* File Info Display */
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              {getFileIcon(selectedFile.name)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 truncate max-w-xs">
                                📎 {selectedFile.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Size: {formatFileSize(selectedFile.size)}
                              </p>
                              <p className="text-xs text-green-600 font-medium">
                                ✅ File ready for submission
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeFile}
                            disabled={isSubmitting}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.ppt,.pptx,.mp4,.mp3,.wav"
                    className="hidden"
                    disabled={isSubmitting}
                    capture="environment"
                  />
                </div>

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
                    disabled={isSubmitting || !submissionText.trim()}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting your work...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit My Work! 🎉
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
