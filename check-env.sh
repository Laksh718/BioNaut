#!/bin/bash

# BioNaut Deployment Environment Check Script
# This script verifies that all required environment variables are set

echo "🚀 BioNaut Deployment Environment Check"
echo "========================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_env_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}✗${NC} $var_name is not set"
        return 1
    elif [[ "$var_value" == *"localhost"* ]] || [[ "$var_value" == *"127.0.0.1"* ]]; then
        echo -e "${YELLOW}⚠${NC} $var_name: $var_value (localhost detected - not suitable for deployment)"
        return 2
    else
        echo -e "${GREEN}✓${NC} $var_name is set: $var_value"
        return 0
    fi
}

# Track status
all_ok=true
has_warnings=false

# Check required environment variables
echo "Checking required environment variables:"
echo ""

check_env_var "VITE_API_URL"
status=$?
if [ $status -eq 1 ]; then
    all_ok=false
elif [ $status -eq 2 ]; then
    has_warnings=true
fi

check_env_var "VITE_GEMINI_API_KEY"
if [ $? -eq 1 ]; then
    all_ok=false
fi

check_env_var "VITE_SUMMARIZER_API_URL"
if [ $? -eq 1 ]; then
    all_ok=false
fi

echo ""
echo "========================================"

# Final status
if [ "$all_ok" = false ]; then
    echo -e "${RED}❌ Environment check failed!${NC}"
    echo ""
    echo "Please set the missing environment variables:"
    echo ""
    echo "export VITE_API_URL=https://your-backend-api-url.com"
    echo "export VITE_GEMINI_API_KEY=your_gemini_api_key_here"
    echo "export VITE_SUMMARIZER_API_URL=https://summarizer-model.onrender.com"
    echo ""
    echo "Or create a .env file with these variables."
    exit 1
elif [ "$has_warnings" = true ]; then
    echo -e "${YELLOW}⚠️  Warning: Some variables may need attention${NC}"
    echo ""
    echo "Make sure VITE_API_URL points to your deployed backend (not localhost)"
    echo "for production deployments."
    echo ""
    exit 0
else
    echo -e "${GREEN}✅ All environment variables are properly set!${NC}"
    echo ""
    echo "You're ready to build and deploy."
    echo ""
    exit 0
fi
