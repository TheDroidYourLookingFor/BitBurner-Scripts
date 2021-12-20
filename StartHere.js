/** @param {NS} ns **/
export async function main(ns) {
	if (ns.getHostname() !== "home") {
		throw new Exception("Run the script from home");
	}
	// My Stuff
	var githubURL = "https://raw.githubusercontent.com/TheDroidYourLookingFor/BitBurner-Scripts/main/initDownload.js";
	var outputFileName = "/TheDroid/initDownload.js";
	var launchAfterDL = false;
	var launchThreads = 1;
	
	await ns.wget(githubURL,outputFileName);
	if (launchAfterDL) ns.spawn("initDownload.js", launchThreads);
}