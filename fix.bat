@echo off
cd /d C:\Users\Administrator\AppData\LocalLow\carbon-master
del create-repo.bat
del create-repo.ps1
git add -A
git commit --amend -m "add GitHub Actions workflow"
set GIT_SSH_COMMAND=ssh -i C:/Users/Administrator/AppData/LocalLow/dev-nav/id_ed25519 -o StrictHostKeyChecking=no
git push origin main --force
