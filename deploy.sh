#!/bin/bash

# Erasmus Survival Kit - Deployment Script
# This script helps deploy the app to GitHub Pages

echo "🎓 Erasmus Survival Kit - Deployment Setup"
echo "========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
else
    echo "✅ Git repository already initialized"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository as remote origin:"
    echo "    git remote add origin https://github.com/yourusername/erasmus-survival-kit.git"
    echo ""
    read -p "Have you created a GitHub repository? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub repository URL: " repo_url
        git remote add origin "$repo_url"
        echo "✅ Remote origin added"
    else
        echo "❌ Please create a GitHub repository first and run this script again"
        exit 1
    fi
else
    echo "✅ Remote origin already configured"
fi

# Stage all files
echo "📦 Staging files for commit..."
git add .

# Commit changes
echo "💾 Committing changes..."
if git diff --staged --quiet; then
    echo "⚠️  No changes to commit"
else
    git commit -m "Deploy Erasmus Survival Kit v1.0"
    echo "✅ Changes committed"
fi

# Push to main branch
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository settings"
echo "2. Navigate to Pages section"
echo "3. Select 'Deploy from a branch'"
echo "4. Choose 'main' branch and '/ (root)' folder"
echo "5. Save the settings"
echo ""
echo "🔗 Your app will be available at:"
echo "   https://yourusername.github.io/erasmus-survival-kit"
echo ""
echo "⚠️  Don't forget to:"
echo "   - Add your GitHub Pages domain to Firebase Auth authorized domains"
echo "   - Update firebase-config.js with your actual Firebase keys"
echo ""
echo "🎓 Happy Erasmus journey!"
