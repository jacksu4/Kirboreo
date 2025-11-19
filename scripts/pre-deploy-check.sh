#!/bin/bash

# Pre-Deployment Check Script for Kirboreo AI
# Validates project readiness before deploying to production

set -e

echo "🚀 Kirboreo AI - Pre-Deployment Check"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from project root${NC}"
    exit 1
fi

echo "📋 Running pre-deployment checks..."
echo ""

# 1. Check Node version
echo "1️⃣  Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required. Current: $(node -v)${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"
fi
echo ""

# 2. Check environment variables
echo "2️⃣  Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local not found${NC}"
    echo "   Create it using .env.example as template"
else
    # Check required variables
    REQUIRED_VARS=("OPENAI_API_KEY" "PINECONE_API_KEY" "NEXT_PUBLIC_SANITY_PROJECT_ID")
    ALL_PRESENT=true
    
    for var in "${REQUIRED_VARS[@]}"; do
        if ! grep -q "^${var}=" .env.local 2>/dev/null; then
            echo -e "${RED}❌ Missing: ${var}${NC}"
            ALL_PRESENT=false
        fi
    done
    
    if [ "$ALL_PRESENT" = true ]; then
        echo -e "${GREEN}✅ All required environment variables present${NC}"
    else
        echo -e "${RED}❌ Some environment variables are missing${NC}"
        exit 1
    fi
fi
echo ""

# 3. Install dependencies
echo "3️⃣  Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm ci --silent
else
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi
echo ""

# 4. Run linter
echo "4️⃣  Running linter..."
if npm run lint --silent > /dev/null 2>&1; then
    echo -e "${GREEN}✅ No linting errors${NC}"
else
    echo -e "${RED}❌ Linting errors found${NC}"
    echo "   Run 'npm run lint' to see details"
    exit 1
fi
echo ""

# 5. Build project
echo "5️⃣  Building project..."
if npm run build > /tmp/build.log 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    echo "   Check /tmp/build.log for details"
    exit 1
fi
echo ""

# 6. Check for sensitive files
echo "6️⃣  Checking for sensitive files..."
SENSITIVE_FILES=(".env" ".env.local" ".env.production" "*.pem" "*.key")
FOUND_SENSITIVE=false

for pattern in "${SENSITIVE_FILES[@]}"; do
    if git ls-files | grep -q "$pattern" 2>/dev/null; then
        echo -e "${RED}❌ Found sensitive file in git: $pattern${NC}"
        FOUND_SENSITIVE=true
    fi
done

if [ "$FOUND_SENSITIVE" = true ]; then
    echo -e "${RED}❌ Remove sensitive files from git before deploying${NC}"
    exit 1
else
    echo -e "${GREEN}✅ No sensitive files in repository${NC}"
fi
echo ""

# 7. Check git status
echo "7️⃣  Checking git status..."
if [ -d ".git" ]; then
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✅ Working directory clean${NC}"
    else
        echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
        echo "   Commit changes before deploying"
    fi
    
    # Check if on main/master branch
    BRANCH=$(git branch --show-current)
    if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
        echo -e "${GREEN}✅ On main branch: $BRANCH${NC}"
    else
        echo -e "${YELLOW}⚠️  Not on main branch (current: $BRANCH)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Not a git repository${NC}"
fi
echo ""

# 8. Check package.json
echo "8️⃣  Validating package.json..."
if node -e "require('./package.json')" 2>/dev/null; then
    echo -e "${GREEN}✅ package.json is valid${NC}"
else
    echo -e "${RED}❌ package.json has syntax errors${NC}"
    exit 1
fi
echo ""

# Summary
echo ""
echo "======================================"
echo -e "${GREEN}✅ All checks passed!${NC}"
echo "======================================"
echo ""
echo "📦 Ready for deployment!"
echo ""
echo "Next steps:"
echo "  1. git add . && git commit -m 'Ready for production'"
echo "  2. git push origin main"
echo "  3. Deploy to Vercel: vercel --prod"
echo ""
echo "Or use Vercel GitHub integration for automatic deployment."
echo ""

exit 0

