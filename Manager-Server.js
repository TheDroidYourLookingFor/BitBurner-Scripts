/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	const useDebug = false;
	if (useDebug) ns.tail(usrDirectory + "Manager-Server.js", "home");
	var deployRam = ns.args[0];

	/** @param {NS} ns **/
	async function manageServers(ns, srvAmt) {
		var ram = srvAmt;
		var pServAlias = "pServ-"

		var delSrvs = ns.getPurchasedServers();
		delSrvs.forEach(function (delTarg) {
			ns.killall(delTarg);
			ns.deleteServer(delTarg);
		})

		var i = 0;
		while (i < 25) {
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
				ns.purchaseServer(pServAlias + i, ram);
				++i;
			}
			await ns.asleep(500);
		}
		ns.exec(usrDirectory + "SetupNewTargets.js", "home", 1);
	}

	if (ns.args[0] == null) {
		ns.tprint("You didn't specific the amount of RAM for the server. Ex: run Manager-Server.js 8")
	} else {
		await manageServers(ns, deployRam);
	}
}