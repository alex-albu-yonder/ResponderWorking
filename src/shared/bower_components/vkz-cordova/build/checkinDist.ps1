git add .\dist 2>&1 | write-host
git status 2>&1 | write-host
git commit -m "***NO_CI*** release checkin" 2>&1 | write-host
git push 2>&1 | write-host