/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	var autoManageHacking = true;
	var autoManageHackNet = true;
	var autoManageStock = false;
	var autoManageServers = false;
	var autoManageServersRam = 8;
	var autoManageHomeSrv = true;

	ns.toast("Droid Scripts Startup beginning");

	if (autoManageHacking && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Deployment.js", ns.getHostname())) {
		ns.toast("Starting Manager-Deployment for auto hacking.")
		ns.run(usrDirectory + "Manager-Deployment.js", 1);
	}

	if (autoManageHackNet && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Hacknet.js", ns.getHostname())) {
		ns.toast("Starting Manager-Hacknet for Auto Hacknet Upgrading");
		ns.run(usrDirectory + "Manager-Hacknet.js", 1);
	}

	if (autoManageServers && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Server.js", ns.getHostname()) && ns.getServerMaxRam("pserv-0") < autoManageServersRam) {
		ns.toast("Starting Manager-Server for Auto VPS Upgrading");
		ns.run(usrDirectory + "Manager-Server.js", 1, autoManageServersRam);
	}

	if (autoManageStock && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Stock.js", ns.getHostname())) {
		ns.toast("Starting Manager-Stock for Auto Stock Trading.");
		ns.run(usrDirectory + "Manager-Stock.js", 1);
	}
	if (autoManageHomeSrv && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "hack.js", ns.getHostname())) {
		ns.toast("Starting Manager-Home to Auto Manage the Home Server.");
		ns.run(usrDirectory + "Manager-Home.js", 1);
	}
}