/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	var autoManageHacking = true;
	var autoManageHackNet = false;
	var autoManageHackNetNodes = 8;
	var autoManageStock = true;
	var autoManageServers = false;
	var autoManageServersRam = 8;
	var autoManageHomeSrv = true;
	var minsToSleep = 5;

	while (true) {
		if (autoManageHacking && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Deployment.js", ns.getHostname())) {
			ns.run(usrDirectory + "Manager-Deployment.js", 1);
		}

		if (autoManageHackNet && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Hacknet.js", ns.getHostname()) && ns.hacknet.numNodes() < autoManageHackNetNodes) {
			ns.run(usrDirectory + "Manager-Hacknet.js", 1);
		}

		if (autoManageServers && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Server.js", ns.getHostname()) && ns.getServerMaxRam("pserv-0") < autoManageServersRam) {
			ns.run(usrDirectory + "Manager-Server.js", 1, autoManageServersRam);
		}

		if (autoManageStock && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Stock.js", ns.getHostname())) {
			ns.run(usrDirectory + "Manager-Stock.js", 1);
		}
		if (autoManageHomeSrv && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "hack.js", ns.getHostname())) {
			ns.run(usrDirectory + "HomeRun.js", 1);
		}
		await ns.asleep((minsToSleep * 60) * 1000);
	}
}