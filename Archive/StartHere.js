/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	if (ns.getHostname() !== "home") {
		throw new Exception("Run the script from home");
	}

	var githubURL = "https://raw.githubusercontent.com/TheDroidYourLookingFor/BitBurner-Scripts/main/initDownload.js";
	var outputFileName = usrDirectory + "initDownload.js";

	await ns.wget(githubURL, outputFileName);
	ns.run(outputFileName, 1);
}