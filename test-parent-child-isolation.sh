#!/bin/bash

echo "🔧 Testing Parent-Child Task Isolation"
echo "======================================"

BASE_URL="http://localhost:5000/api"

echo ""
echo "1. Testing Parent 1 (Test Parent):"
echo "   - Should see their children: Test Child (ID: 2), Emma Johnson (ID: 3)"
echo "   - Should see only tasks they created"

echo ""
echo "👥 Parent 1's Children:"
curl -s "$BASE_URL/users/parent/1/children" | jq '.'

echo ""
echo "📋 Parent 1's Tasks:"
curl -s "$BASE_URL/tasks?userId=1&role=parent" | jq '.[] | {id, title, child_name}'

echo ""
echo "2. Testing Parent 3 (Sarah Johnson):"
echo "   - Should see their children: Emma Johnson (ID: 3)"
echo "   - Should see only tasks they created"

echo ""
echo "👥 Parent 3's Children:"
curl -s "$BASE_URL/users/parent/3/children" | jq '.'

echo ""
echo "📋 Parent 3's Tasks:"
curl -s "$BASE_URL/tasks?userId=3&role=parent" | jq '.[] | {id, title, child_name}'

echo ""
echo "3. Testing Child 2 (Test Child):"
echo "   - Should see only tasks assigned to them by their parent"

echo ""
echo "📋 Child 2's Tasks:"
curl -s "$BASE_URL/tasks?userId=2&role=child" | jq '.[] | {id, title, parent_name}'

echo ""
echo "4. Testing Child 3 (Emma Johnson):"
echo "   - Should see only tasks assigned to them by their parent"

echo ""
echo "📋 Child 3's Tasks:"
curl -s "$BASE_URL/tasks?userId=3&role=child" | jq '.[] | {id, title, parent_name}'

echo ""
echo "✅ Test complete!"
echo ""
echo "Expected behavior:"
echo "- Parent 1 should only see tasks they created for their children (2, 3)"
echo "- Parent 3 should only see tasks they created for their children"
echo "- Child 2 should only see tasks assigned to them"
echo "- Child 3 should only see tasks assigned to them"
echo "- No cross-contamination between different parent-child groups"
