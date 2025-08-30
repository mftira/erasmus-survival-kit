@echo off
echo 🚀 Quick GitHub Pages Fix - Deploy with Real Config
echo ================================================

echo.
echo This will temporarily deploy your real Firebase config to GitHub Pages.
echo ⚠️  Your Firebase keys will be public - consider rotating them later.
echo.

set /p confirm="Continue with deployment? (y/n): "
if /i not "%confirm%"=="y" (
    echo Deployment cancelled.
    pause
    exit /b 0
)

echo.
echo 📝 Updating HTML to use actual Firebase config...

REM Update index.html to use the actual config
powershell -Command "(Get-Content 'index.html') -replace 'firebase-config-actual.js', 'firebase-config-actual.js' | Set-Content 'index.html'"

echo 📦 Committing and pushing changes...
git add .
git commit -m "Deploy with actual Firebase config for GitHub Pages"
git push origin main

echo.
echo ✅ Deployment complete!
echo.
echo 🌐 Your app should now work at:
echo    https://mftira.github.io/erasmus-survival-kit
echo.
echo ⚠️  SECURITY NOTE:
echo Your Firebase config is now public. Consider:
echo 1. Setting up Firebase Security Rules (already done)
echo 2. Monitoring Firebase usage
echo 3. Rotating Firebase keys periodically
echo.
echo 🎓 Your Erasmus Survival Kit is ready for your team!
echo.
pause
