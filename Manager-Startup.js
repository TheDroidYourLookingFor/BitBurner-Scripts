/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	var autoCustomStats = false;
	var autoProfitGraph = false;
	var autoSnow = false;
	var autoManageHacking = true;
	var autoManageHackNet = true;
	var autoManageStock = false;
	var autoManageServers = true;
	var autoBootOS = false;

	ns.toast("Droid Scripts Startup beginning");

	if (autoBootOS && ns.getHostname() == "home" && !ns.scriptRunning("/os/main.js", ns.getHostname())) {
		ns.toast("Starting BootOS");
		ns.run("/os/main.js", 1);
	}

	if (autoManageHacking && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Deployment.js", ns.getHostname())) {
		ns.toast("Starting Manager-Deployment for auto hacking.")
		ns.run(usrDirectory + "Manager-Deployment.js", 1);
	}

	if (autoManageServers && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Server.js", ns.getHostname())) {
		ns.toast("Starting Manager-Server for Auto VPS Upgrading");
		ns.run(usrDirectory + "Manager-Server.js", 1);
	}

	if (autoManageHackNet && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Hacknet.js", ns.getHostname())) {
		ns.toast("Starting Manager-Hacknet for Auto Hacknet Upgrading");
		ns.run(usrDirectory + "Manager-Hacknet.js", 1);
	}

	if (autoManageStock && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Stock.js", ns.getHostname())) {
		ns.toast("Starting Manager-Stock for Auto Stock Trading.");
		ns.run(usrDirectory + "Manager-Stock.js", 1);
	}

	if (autoCustomStats && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-CustomStats.js", ns.getHostname())) {
		ns.toast("Starting Manager-CustomStats for additional stats on HUD");
		ns.run(usrDirectory + "Manager-CustomStats.js", 1);
	}

	if (autoProfitGraph && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-ProfitGraph.js", ns.getHostname())) {
		ns.toast("Starting Manager-ProfitGraph for graph on HUD");
		ns.run(usrDirectory + "Manager-ProfitGraph.js", 1);
	}

	if (autoSnow && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Snow.js", ns.getHostname())) {
		ns.toast("Starting Manager-Snow to make it snow.");
		ns.run(usrDirectory + "Manager-Snow.js", 1);
	}
}