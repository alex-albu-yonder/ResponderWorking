$config = Get-Content -Raw -Path bower.json | ConvertFrom-Json
$branchName = 'v' + $config.version
$branchNameRemote = "origin/$($branchName)"

$branchesRemote = git branch -r
$didFoundBranch = $false
ForEach($branch in $branchesRemote) {
	Write-Host "branch $($branch)"
	if($branch.Trim() -eq $branchNameRemote) {
		Write-Host "found branch"
		$didFoundBranch = $true
	}
}

if($didFoundBranch) {
	$host.ui.WriteErrorLine("Error while branching due to an already existing branch with the same name. 
	Please make sure you have updated the version number in the bower.json file")
	Write-Error "Error while branching"
}
else {
	Write-Host "Is going to branch"
	git branch $branchName 2>&1 | write-host
	git push -u origin $branchName 2>&1 | write-host
}