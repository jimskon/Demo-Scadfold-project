#!/bin/bash
set -eecho "Starting deployment..."git checkout cdsetup
git pull
echo "Installing root dependencies..."
npm install
echo "Building frontend..."
cd client
npm install
npm run build
echo "Installing backend dependencies..."
cd ../server
npm install
echo "Restarting app with PM2..."
pm2 restart demo-scaffold
echo "Deployment complete."