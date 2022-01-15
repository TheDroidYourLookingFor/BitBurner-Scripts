/** @param {import(".").NS } ns */
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	let autoCustomStats = true;
	let autoProfitGraph = true;
	let autoSnow = false;
	let autoManageHacking = true;
	let autoManageBackdoor = true;
	let autoManageHackNet = false;
	let autoManageHashNet = true;
	let autoManageStock = true;
	let autoManageServers = true;
	let autoBootOS = false;
	let autoContracts = true;
	let autoManageFactions = false;
	let autoManageGym = false;
	let autoManageGang = true;
	let autoBuyTorRouter = true;

	ns.toast("Droid Scripts Startup beginning");

	if (autoBuyTorRouter) ns.purchaseTor();

	if (autoBootOS && ns.getHostname() == "home" && !ns.scriptRunning("/os/main.js", ns.getHostname())) {
		ns.toast("Starting BootOS");
		ns.run("/os/main.js", 1);
	}

	if (autoManageHacking && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Deployment.js", ns.getHostname())) {
		ns.toast("Starting Manager-Deployment for auto hacking.")
		ns.run(usrDirectory + "Manager-Deployment.js", 1);
	}

	if (autoManageBackdoor && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Backdoor.js", ns.getHostname())) {
		ns.toast("Starting Manager-Backdoor for auto backdoor.")
		ns.run(usrDirectory + "Manager-Backdoor.js", 1);
	}

	if (autoManageServers && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Server.js", ns.getHostname())) {
		ns.toast("Starting Manager-Server for Auto VPS Upgrading");
		ns.run(usrDirectory + "Manager-Server.js", 1);
	}

	if (autoManageHackNet && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Hacknet.js", ns.getHostname())) {
		ns.toast("Starting Manager-Hacknet for Auto Hacknet Upgrading");
		ns.run(usrDirectory + "Manager-Hacknet.js", 1);
	}

	if (autoManageHashNet && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Hashnet.js", ns.getHostname())) {
		ns.toast("Starting Manager-Hashnet for Auto Hacknet Upgrading");
		ns.run(usrDirectory + "Manager-Hashnet.js", 1);
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

	if (autoContracts && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Contracts.js", ns.getHostname())) {
		ns.toast("Starting Manager-Contracts to complete contracts.");
		ns.run(usrDirectory + "Manager-Contracts.js", 1);
	}
	if (autoManageFactions && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Faction.js", ns.getHostname())) {
		ns.toast("Starting Manager-Faction for auto faction grinding.")
		ns.run(usrDirectory + "Manager-Faction.js", 1);
	}
	if (autoManageGym && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Gym.js", ns.getHostname())) {
		ns.toast("Starting Manager-Gym for auto stat grinding.")
		ns.run(usrDirectory + "Manager-Gym.js", 1);
	}
	if (autoManageGang && ns.getHostname() == "home" && !ns.scriptRunning(usrDirectory + "Manager-Gangs.js", ns.getHostname())) {
		ns.toast("Starting Manager-Gangs for auto Gang management.")
		ns.run(usrDirectory + "Manager-Gangs.js", 1);
	}
}