#!/bin/bash

# Deploy oth.surf backend to Render
# This script automates the deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== oth.surf Backend Deployment ===${NC}"
echo ""

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    echo -e "${YELLOW}Render CLI not found. Installing...${NC}"
    npm install -g @rendercloud/cli
fi

# Check if logged in
if ! render whoami &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Render. Please run: render login${NC}"
    echo "Or use: render login --api-key <your-api-key>"
    exit 1
fi

# Get API key if not set
API_KEY="${RENDER_API_KEY}"
if [ -z "$API_KEY" ]; then
    echo -e "${YELLOW}No RENDER_API_KEY found in environment.${NC}"
    echo "Getting API key from Render..."
    render config set api-key
    API_KEY=$(render config get api-key)
fi

# Create the service
echo -e "${GREEN}Creating Render service...${NC}"

# Create render.yaml if it doesn't exist
if [ ! -f "render.yaml" ]; then
    echo -e "${RED}Error: render.yaml not found${NC}"
    exit 1
fi

# Deploy
echo -e "${GREEN}Deploying to Render...${NC}"
render up -f render.yaml

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "Your backend is now live at:"
RENDER_URL=$(render list --json | grep -o '"url":"[^"]*' | head -1 | cut -d'"' -f4)
echo "https://$RENDER_URL"
echo ""
echo "You can use this URL in the frontend API_URL:"
echo "https://$RENDER_URL/api"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Copy the URL above"
echo "2. Update frontend/src/index.js with the API_URL"
echo "3. Build and test the menubar app"
echo "4. Create the DMG: cd frontend && npm run package"
