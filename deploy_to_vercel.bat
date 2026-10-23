@echo off
set "PATH=C:\Program Files\nodejs;C:\Program Files\GitHub CLI;C:\Users\drsum\AppData\Local\GitHubDesktop\app-3.6.5\resources\app\git\cmd;%PATH%"
echo ========================================================
echo        InkVerse - Vercel Deployment Helper
echo ========================================================
echo.
echo Deploying InkVerse to Vercel production...
call "C:\Program Files\nodejs\npx.cmd" vercel --prod --yes
echo.
echo ========================================================
echo Deployment to Vercel complete!
echo ========================================================
pause
