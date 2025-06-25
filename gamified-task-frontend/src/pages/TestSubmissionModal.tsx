import { useState } from 'react';
import TaskSubmissionModal from '../components/TaskSubmissionModal';
import { Button } from '../components/ui/Button';

const TestSubmissionModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const testTask = {
    id: 1,
    title: 'Test Task for File Upload',
    description: 'This is a test task to verify the file upload functionality works correctly.',
    xp_reward: 50
  };

  const handleSubmissionSuccess = () => {
    console.log('Submission successful!');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">🧪 Test File Upload Feature</h1>
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Test Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click the button below to open the submission modal</li>
            <li>• You should see a file upload area with camera icon</li>
            <li>• Try uploading an image, PDF, or other file</li>
            <li>• Write some feedback in the text area</li>
            <li>• Submit to test the complete flow</li>
          </ul>
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full mb-4"
        >
          📤 Open Task Submission Modal
        </Button>

        <div className="text-sm text-gray-600">
          <p><strong>Expected:</strong> Modal with file upload capability</p>
          <p><strong>Features:</strong> Image preview, file validation, feedback form</p>
        </div>

        <TaskSubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={testTask}
          childId={1}
          onSubmissionSuccess={handleSubmissionSuccess}
        />
      </div>
    </div>
  );
};

export default TestSubmissionModal;
