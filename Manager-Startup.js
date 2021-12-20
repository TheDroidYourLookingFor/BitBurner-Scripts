/** @param {NS} ns **/
export async function main(ns) {
	var autoManageHacking = true;
	var autoManageHackNet = true;
	var autoManageHackNetNodes = 8;
	var autoManageStock = true;
	var autoManageServers = false;
	var autoManageServersRam = 8;
	var autoManageHomeSrv = true;


	if (autoManageHacking && ns.getHostname() == "home" && !ns.scriptRunning("Manager-Deployment.js")) {
		ns.run("Manager-Deployment.js", 1);
	}

	if (autoManageHackNet && ns.getHostname() == "home" && !ns.scriptRunning("Manager-Hacknet.js") && ns.hacknet.numNodes() < autoManageHackNetNodes) {
		ns.run("Manager-Hacknet.js", 1);
	}

	if (autoManageServers && ns.getHostname() == "home" && !ns.scriptRunning("Manager-Server.js") && ns.getServerMaxRam("pserv-0") < autoManageServersRam) {
		ns.run("Manager-Server.js", 1, autoManageServersRam);
	}

	if (autoManageStock && ns.getHostname() == "home" && !ns.scriptRunning("Manager-Stock.js")) {
		ns.run("Manager-Stock.js", 1);
	}
	if (autoManageHomeSrv && ns.getHostname() == "home" && !ns.scriptRunning("hack.js")) {
		ns.run("HomeRun.js", 1);
	}
}