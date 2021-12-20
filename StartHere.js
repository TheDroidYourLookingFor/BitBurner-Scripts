/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	if (ns.getHostname() !== "home") {
		throw new Exception("Run the script from home");
	}
	async function createConfig(ns) {
		await ns.write(usrDirectory + "userConfig.awesome",
			+ "," + "Version"
			+ "," + "1.00"
			+ "," + "outputDir"
			+ "," + usrDirectory
			+ "," + "autoManageHacking"
			+ "," + "true"
			+ "," + "autoManageHackNet"
			+ "," + "false"
			+ "," + "autoManageHackNetNodes"
			+ "," + "8"
			+ "," + "autoManageStock"
			+ "," + "true"
			+ "," + "autoManageServers"
			+ "," + "false"
			+ "," + "autoManageServersRam"
			+ "," + "8"
			+ "," + "autoManageHomeSrv"
			+ "," + "true"
			+ "\r\n");
	}
	createConfig(ns);
	// My Stuff
	var githubURL = "https://raw.githubusercontent.com/TheDroidYourLookingFor/BitBurner-Scripts/main/initDownload.js";
	var outputFileName = usrDirectory + "initDownload.js";

	await ns.wget(githubURL, outputFileName);
	ns.run(outputFileName, 1);
}