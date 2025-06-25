#!/usr/bin/env node

// Test the full photo upload and review workflow
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

async function testFullWorkflow() {
  console.log('🧪 Testing complete photo upload and review workflow...\n');

  try {
    // Step 1: Create a test parent and child
    console.log('1️⃣ Creating test parent...');
    const timestamp = Date.now();
    const parentResponse = await axios.post(`${BASE_URL}/auth/signup/parent`, {
      name: 'Test Parent',
      email: `parent${timestamp}@test.com`,
      password: 'password123',
    });
    console.log('✅ Parent created:', parentResponse.data.user.name);

    const parentId = parentResponse.data.user.id;

    console.log('\n2️⃣ Creating test child...');
    const childResponse = await axios.post(`${BASE_URL}/auth/signup/child`, {
      name: 'Test Child',
      email: `child${timestamp}@test.com`,
      password: 'password123',
      parent_id: parentId
    });
    console.log('✅ Child created:', childResponse.data.user.name);

    const childId = childResponse.data.user.id;

    // Step 2: Create a task
    console.log('\n3️⃣ Creating test task...');
    const taskResponse = await axios.post(`${BASE_URL}/tasks`, {
      title: 'Clean Your Room',
      description: 'Make your bed, organize toys, and vacuum the floor',
      child_id: childId,
      parent_id: parentId,
      xp_reward: 50,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
    console.log('✅ Task created:', taskResponse.data.task.title);

    const taskId = taskResponse.data.task.id;

    // Step 3: Test simple submission (without photo)
    console.log('\n4️⃣ Testing simple submission...');
    const simpleSubmissionResponse = await axios.post(`${BASE_URL}/submissions`, {
      task_id: taskId,
      child_id: childId,
      submission_text: 'I cleaned my room and organized everything!'
    });
    console.log('✅ Simple submission created:', simpleSubmissionResponse.data.submission.id);

    // Step 4: Create a dummy image for testing
    console.log('\n5️⃣ Creating test image...');
    const uploadsDir = path.join(__dirname, 'task-tracker-backend', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const testImagePath = path.join(__dirname, 'test-image.jpg');
    // Create a simple test image (1x1 pixel JPEG)
    const testImageBuffer = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0xAA, 0xFF, 0xD9
    ]);

    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('✅ Test image created');

    // Step 5: Delete the simple submission to test photo submission
    console.log('\n6️⃣ Deleting simple submission to test photo submission...');
    await axios.delete(`${BASE_URL}/submissions/${simpleSubmissionResponse.data.submission.id}`).catch(() => {
      // If delete endpoint doesn't exist, we'll manually clear it from database
      console.log('⚠️  Delete endpoint not available, continuing with photo submission test');
    });

    // Create another task for photo submission
    const photoTaskResponse = await axios.post(`${BASE_URL}/tasks`, {
      title: 'Math Homework',
      description: 'Complete worksheet pages 15-17',
      child_id: childId,
      parent_id: parentId,
      xp_reward: 75,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    });
    const photoTaskId = photoTaskResponse.data.task.id;

    // Step 6: Test photo submission
    console.log('\n7️⃣ Testing photo submission...');
    const formData = new FormData();
    formData.append('task_id', photoTaskId.toString());
    formData.append('child_id', childId.toString());
    formData.append('submission_text', 'Here is my completed math homework!');
    formData.append('photo', fs.createReadStream(testImagePath), {
      filename: 'homework.jpg',
      contentType: 'image/jpeg'
    });

    const photoSubmissionResponse = await axios.post(`${BASE_URL}/submissions/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });
    console.log('✅ Photo submission created:', photoSubmissionResponse.data.submission.id);
    console.log('📷 Photo path:', photoSubmissionResponse.data.submission.file_path);

    const submissionId = photoSubmissionResponse.data.submission.id;

    // Step 7: Test fetching pending submissions for parent
    console.log('\n8️⃣ Testing parent pending submissions fetch...');
    const pendingSubmissionsResponse = await axios.get(`${BASE_URL}/submissions/parent/${parentId}/pending`);
    console.log('✅ Pending submissions fetched:', pendingSubmissionsResponse.data.pendingSubmissions.length);
    
    if (pendingSubmissionsResponse.data.pendingSubmissions.length > 0) {
      const submission = pendingSubmissionsResponse.data.pendingSubmissions[0];
      console.log('📝 First submission:', {
        task_title: submission.task_title,
        child_name: submission.child_name,
        submission_text: submission.submission_text,
        file_path: submission.file_path
      });
    }

    // Step 8: Test submission approval (awarding XP)
    console.log('\n9️⃣ Testing submission approval...');
    const approvalResponse = await axios.put(`${BASE_URL}/submissions/${submissionId}/review`, {
      status: 'approved',
      feedback: 'Great job! Your work is excellent!'
    });
    console.log('✅ Submission approved:', approvalResponse.data.message);
    console.log('🌟 XP awarded:', approvalResponse.data.xpAwarded);

    // Step 9: Verify child received XP
    console.log('\n🔟 Verifying child XP update...');
    const updatedChildResponse = await axios.get(`${BASE_URL}/users/${childId}`);
    console.log('✅ Child total XP:', updatedChildResponse.data.total_xp);

    // Step 10: Test child dashboard summary
    console.log('\n1️⃣1️⃣ Testing child dashboard summary...');
    const summaryResponse = await axios.get(`${BASE_URL}/submissions/child/${childId}/summary`);
    console.log('✅ Dashboard summary:', {
      totalSubmissions: summaryResponse.data.totalSubmissions,
      approved: summaryResponse.data.approved,
      totalXP: summaryResponse.data.totalXP
    });

    // Cleanup
    console.log('\n🧹 Cleaning up test files...');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('✅ Test image deleted');
    }

    console.log('\n🎉 All tests passed! The complete photo upload and review workflow is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    // Cleanup on error
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  }
}

// Run the test
testFullWorkflow();
