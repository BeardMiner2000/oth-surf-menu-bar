#!/bin/bash

# oth.surf Backend Deployment Script
# This script automates backend deployment to Render

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     oth.surf Backend Deployment to Render                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found!"
    echo ""
    echo "To install Render CLI:"
    echo "  1. Visit: https://render.com/docs/cli-install"
    echo "  2. Run: curl -s https://render.com/install | bash"
    echo "  3. Login: render login"
    echo ""
    echo "OR use the dashboard directly:"
    echo "  https://dashboard.render.com"
    exit 1
fi

# Check if logged in
echo "Checking Render login status..."
if ! render whoami &> /dev/null; then
    echo "❌ Not logged in to Render"
    echo ""
    echo "To login:"
    echo "  render login"
    echo ""
    echo "Or use: https://dashboard.render.com"
    exit 1
fi

echo "✅ Logged in to Render"
echo ""

# Navigate to backend directory
cd ~/projects/oth-surf-menu-bar/backend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in backend directory"
    exit 1
fi

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found"
    echo ""
    echo "Creating render.yaml..."
    cat > render.yaml << 'EOF'
services:
  - type: web
    name: oth-surf-scraper
    env: node
    buildCommand: "cd backend && npm install"
    startCommand: "cd backend && npm start"
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: OTH_SURF_URL
        value: https://oth.surf
    region: oregon
    branch: main
    autoDeploy: false
EOF
    echo "✅ Created render.yaml"
fi

# Display deployment info
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     Deployment Information                                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Service Name: oth-surf-scraper"
echo "Environment: Node.js"
echo "Build Command: cd backend && npm install"
echo "Start Command: cd backend && npm start"
echo "Region: Oregon"
echo ""
echo "Environment Variables:"
echo "  - NODE_ENV: production"
echo "  - PORT: 10000"
echo "  - OTH_SURF_URL: https://oth.surf"
echo ""

# Deploy
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              Deploying to Render...                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "This will:"
echo "  1. Create a new web service (or use existing)"
echo "  2. Build your application"
echo "  3. Deploy to production"
echo ""
echo "⏳ Starting deployment..."
echo ""

# Use Render dashboard for deployment (more reliable)
echo "Opening Render dashboard for deployment..."
open https://dashboard.render.com/new/web/github.com

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. The Render dashboard will open in your browser"
echo "2. Connect your GitHub repository (oth-surf-menu-bar)"
echo "3. Review the configuration (already set up)"
echo "4. Click 'Create Web Service'"
echo "5. Copy the generated URL when complete"
echo ""
echo "Your API URL will look like:"
echo "  https://oth-surf-scraper.onrender.com"
echo ""
echo "Then update frontend/src/index.js with:"
echo "  const API_URL = 'https://oth-surf-scraper.onrender.com/api';"
echo ""
echo "✅ Deployment script complete!"
