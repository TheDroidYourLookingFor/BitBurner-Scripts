/** @param {NS} ns **/
export async function main(ns) {
	var autoManageHacking = true;
	var autoManageHackNet = true;
	var autoManageHackNetNodes = 8;
	var autoManageStock = true;
	var autoManageServers = false;
	var autoManageServersRam = 8;
	var autoManageHomeSrv = true;


	if (autoManageHacking && ns.getHostname() == "home" && !ns.scriptRunning("/TheDroid/Manager-Deployment.js")) {
		ns.run("/TheDroid/Manager-Deployment.js", 1);
	}

	if (autoManageHackNet && ns.getHostname() == "home" && !ns.scriptRunning("/TheDroid/Manager-Hacknet.js") && ns.hacknet.numNodes() < autoManageHackNetNodes) {
		ns.run("/TheDroid/Manager-Hacknet.js", 1);
	}

	if (autoManageServers && ns.getHostname() == "home" && !ns.scriptRunning("/TheDroid/Manager-Server.js") && ns.getServerMaxRam("pserv-0") < autoManageServersRam) {
		ns.run("/TheDroid/Manager-Server.js", 1, autoManageServersRam);
	}

	if (autoManageStock && ns.getHostname() == "home" && !ns.scriptRunning("/TheDroid/Manager-Stock.js")) {
		ns.run("/TheDroid/Manager-Stock.js", 1);
	}
	if (autoManageHomeSrv && ns.getHostname() == "home" && !ns.scriptRunning("/TheDroid/hack.js")) {
		ns.run("/TheDroid/HomeRun.js", 1);
	}
}