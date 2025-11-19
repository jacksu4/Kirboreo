#!/bin/bash

echo "🚀 Running Kirboreo Test Suite"
echo "================================"

# Run tests with coverage
npm run test:coverage

# Check if coverage meets threshold (simple check)
# In a real CI pipeline, we'd parse the coverage report
echo ""
echo "📊 Coverage Report Generated"
echo "See coverage/lcov-report/index.html for details"

