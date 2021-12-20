/** @param {NS} ns **/
export async function main(ns) {
	if (ns.getHostname() !== "home") {
		throw new Exception("Run the script from home");
	}

	// My Stuff
	var githubURL = "https://raw.github.com/TheDroidYourLookingFor/BitBurner-Scripts/master/src/HomeRun.js";
	var outputDirectory = "/";
	var outputFileName = "HomeRun.js";
	var launchAfterDL = false;
	var launchThreads = 1;
	
	await ns.wget(githubURL,outputFileName);
	if (launchAfterDL) s.spawn(outputFileName, launchThreads);
}