@echo off
cd /d C:\Users\Administrator\AppData\LocalLow\carbon-master
set GIT_SSH_COMMAND=ssh -i C:/Users/Administrator/AppData/LocalLow/dev-nav/id_ed25519 -o StrictHostKeyChecking=no
git add .
git commit -m "add GitHub Actions workflow"
git push origin main
