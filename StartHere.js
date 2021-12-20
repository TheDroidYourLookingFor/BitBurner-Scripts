/** @param {NS} ns **/
export async function main(ns) {
	if (ns.getHostname() !== "home") {
		throw new Exception("Run the script from home");
	}
	// My Stuff
	var githubURL = "https://raw.githubusercontent.com/TheDroidYourLookingFor/BitBurner-Scripts/main/initDownload.js";
	var outputFileName = "/TheDroid/initDownload.js";

	await ns.wget(githubURL, outputFileName);
	ns.spawn(outputFileName, 1);
}