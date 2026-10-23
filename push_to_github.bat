@echo off
set "PATH=C:\Program Files\nodejs;C:\Program Files\GitHub CLI;C:\Users\drsum\AppData\Local\GitHubDesktop\app-3.6.5\resources\app\git\cmd;%PATH%"
echo ========================================================
echo        InkVerse - GitHub Repository Push Helper
echo ========================================================
echo.
echo Step 1: Logging in to GitHub (if not already authenticated)...
gh auth login -w -p https
echo.
echo Step 2: Creating public repository 'InkVerse' and pushing main branch...
gh repo create InkVerse --public --source=. --remote=origin --push
echo.
echo Step 3: Verifying remote...
git remote -v
git push -u origin main
echo.
echo ========================================================
echo Repository created and pushed successfully to GitHub!
echo ========================================================
pause
