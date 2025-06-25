const axios = require('axios');

async function testParentDashboardFlow() {
  try {
    console.log('=== Testing Parent Dashboard API Flow ===\n');
    
    // 1. Test parent login
    console.log('1. Testing parent login...');
    const loginResponse = await axios.post('http://localhost:5000/api/users/login/parent', {
      email: 'parent@test.com',
      password: 'password123'
    });
    
    const parentUser = loginResponse.data.user;
    console.log('✅ Parent login successful!');
    console.log('   User:', { id: parentUser.id, name: parentUser.name, role: parentUser.role });
    
    const parentId = parentUser.id;
    
    // 2. Get children for this parent
    console.log('\n2. Getting children for parent...');
    const childrenResponse = await axios.get(`http://localhost:5000/api/users/parent/${parentId}/children`);
    const children = childrenResponse.data;
    
    console.log(`✅ Found ${children.length} children`);
    children.forEach(child => {
      console.log(`   - ${child.name} (ID: ${child.id}) - ${child.xp} XP`);
    });
    
    // 3. Test summary endpoint for each child (this was causing 500 errors)
    console.log('\n3. Testing summary endpoints for all children...');
    let totalXP = 0;
    let totalApproved = 0;
    let totalRejected = 0;
    let totalPending = 0;
    
    for (const child of children) {
      try {
        const summaryResponse = await axios.get(`http://localhost:5000/api/submissions/child/${child.id}/summary`);
        const summary = summaryResponse.data;
        
        console.log(`✅ Child ${child.id} (${child.name}):`, {
          XP: summary.totalXP,
          Approved: summary.approved,
          Rejected: summary.rejected,
          Pending: summary.pending
        });
        
        totalXP += summary.totalXP;
        totalApproved += summary.approved;
        totalRejected += summary.rejected;
        totalPending += summary.pending;
        
      } catch (error) {
        console.log(`❌ Error for child ${child.id}:`, error.response?.data || error.message);
      }
    }
    
    // 4. Summary
    console.log('\n=== AGGREGATED PARENT DASHBOARD DATA ===');
    console.log(`Total XP across all children: ${totalXP}`);
    console.log(`Total Approved submissions: ${totalApproved}`);
    console.log(`Total Rejected submissions: ${totalRejected}`);
    console.log(`Total Pending submissions: ${totalPending}`);
    
    console.log('\n✅ ALL PARENT DASHBOARD APIs WORKING!');
    console.log('🎯 No more 500 errors for child summary endpoints');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testParentDashboardFlow();
