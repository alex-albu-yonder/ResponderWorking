git checkout $env:BUILD_SOURCEBRANCHNAME 2>&1 | write-host
Write-Host $LastExitCode