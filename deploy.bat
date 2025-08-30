@echo off
echo 🎓 Erasmus Survival Kit - Deployment Setup
echo =========================================

REM Check if firebase config exists
if not exist "js\firebase-config-actual.js" (
    echo ❌ Firebase configuration not found!
    echo Please run setup-firebase-config.bat first to create your Firebase config.
    pause
    exit /b 1
)

REM Check if git is initialized
if not exist .git (
    echo 📦 Initializing Git repository...
    git init
    git branch -M main
) else (
    echo ✅ Git repository already initialized
)

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Please add your GitHub repository as remote origin:
    echo     git remote add origin https://github.com/yourusername/erasmus-survival-kit.git
    echo.
    set /p created="Have you created a GitHub repository? (y/n): "
    if /i "%created%"=="y" (
        set /p repo_url="Enter your GitHub repository URL: "
        git remote add origin "%repo_url%"
        echo ✅ Remote origin added
    ) else (
        echo ❌ Please create a GitHub repository first and run this script again
        pause
        exit /b 1
    )
) else (
    echo ✅ Remote origin already configured
)

REM Stage all files
echo 📦 Staging files for commit...
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if errorlevel 1 (
    echo 💾 Committing changes...
    git commit -m "Deploy Erasmus Survival Kit v1.0"
    echo ✅ Changes committed
) else (
    echo ⚠️  No changes to commit
)

REM Push to main branch
echo 🚀 Pushing to GitHub...
git push -u origin main

echo.
echo 🎉 Deployment complete!
echo.
echo 📋 Next steps:
echo 1. Go to your GitHub repository settings
echo 2. Navigate to Pages section
echo 3. Select 'Deploy from a branch'
echo 4. Choose 'main' branch and '/ (root)' folder
echo 5. Save the settings
echo.
echo 🔗 Your app will be available at:
echo    https://yourusername.github.io/erasmus-survival-kit
echo.
echo ⚠️  Don't forget to:
echo    - Add your GitHub Pages domain to Firebase Auth authorized domains
echo    - Update firebase-config.js with your actual Firebase keys
echo.
echo 🎓 Happy Erasmus journey!
pause
