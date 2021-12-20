/** @param {NS} ns **/
export async function main(ns) {
	if (ns.getHostname() !== "home") {
		throw new Exception("Run the script from home");
	}
	// My Stuff
	var githubURL = "https://raw.githubusercontent.com/TheDroidYourLookingFor/BitBurner-Scripts/main/StartHere.js";
	var outputFileName = "/TheDroid/StartHere.js";
	var launchAfterDL = false;
	var launchThreads = 1;
	
	await ns.wget(githubURL,outputFileName);
	if (launchAfterDL) ns.spawn("StartHere.js", launchThreads);
}