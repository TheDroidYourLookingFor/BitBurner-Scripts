/** @param {NS} ns **/
export async function main(ns) {
	ns.tprint(ns.getPurchasedServerMaxRam());
	const usrDirectory = "/TheDroid/";
	const useDebug = false;
	if (useDebug) ns.tail(ns.getScriptName());
	var deployRam = ns.args[0];
	var autoRam = ns.args[1];
	var usrMaxMoney;
	const initialServerCost = (220000 * 25);
	const srvMaxRam = 1048576;

	/** @param {NS} ns **/
	function usrCurrentMoney(ns){
		return ns.getServerMoneyAvailable("home");
	}
	/** @param {NS} ns **/
	function targCurrentRam(ns, svTarg){
		return ns.getServerMaxRam(svTarg);
	}
	/** @param {NS} ns **/
	function usrCurrentServers(ns){
		return ns.getPurchasedServers();
	}

	/** @param {NS} ns **/
	async function manageServers(ns, srvAmt) {
		if (useDebug) ns.tprint("Starting server upgrade process.")
		var ram = srvAmt;
		var pServAlias = "pServ-"

		if (useDebug) ns.tprint("Evaluating servers for deletion.");
		var delSrvs = usrCurrentServers(ns);
		delSrvs.forEach(function (delTarg) {
			if (targCurrentRam(ns, delTarg) < ram) {
				ns.killall(delTarg);
				ns.deleteServer(delTarg);
				if (useDebug) ns.tprint("Deleted " + delTarg);
			}
		})

		if (useDebug) ns.tprint("Starting server purchase process.");
		var i = 0;
		while (i < 25) {
			let usrMoney = usrCurrentMoney(ns);
			if (usrMoney > ns.getPurchasedServerCost(ram)) {
				if (useDebug) ns.tprint("Purchasing server: " + (pServAlias + i));
				ns.purchaseServer(pServAlias + i, ram);
				++i;
			}
			if (usrMaxMoney < usrMoney) usrMaxMoney = usrMoney;
			await ns.asleep(500);
		}
		if (useDebug) ns.tprint("Calling SetupNewTargets.js");
		ns.exec(usrDirectory + "SetupNewTargets.js", "home", 1);
	}

	while (true) {
		if (autoRam) {
			if (targCurrentRam(ns, "pServ-0") >= 8192) ns.exit();
			if (usrMaxMoney < usrCurrentMoney(ns)) usrMaxMoney = usrCurrentMoney(ns);
			if (usrCurrentServers(ns) == null || targCurrentRam(ns, "pServ-0") < 8) {
				if (usrMaxMoney() >= initialServerCost) {
					//5,500,000
					await manageServers(ns, 4);
					deployRam = 8;
				} else if (usrMaxMoney() >= (initialServerCost * 2)) {
					//11,000,000
					await manageServers(ns, 8);
					deployRam = 16;
				} else if (usrMaxMoney() >= (initialServerCost * 4)) {
					//22,000,000
					await manageServers(ns, 16);
					deployRam = 32;
				} else if (usrMaxMoney() >= (initialServerCost * 8)) {
					//44,000000
					await manageServers(ns, 32);
					deployRam = 64;
				} else if (usrMaxMoney() >= (initialServerCost * 16)) {
					//88,000,000
					await manageServers(ns, 64);
					deployRam = 128;
				} else if (usrMaxMoney() >= (initialServerCost * 32)) {
					//176,000,000
					await manageServers(ns, 128);
					deployRam = 256;
				} else if (usrMaxMoney() >= (initialServerCost * 64)) {
					//352,000,000
					await manageServers(ns, 256);
					deployRam = 512;
				} else if (usrMaxMoney() >= (initialServerCost * 128)) {
					//704,000,000
					await manageServers(ns, 512);
					deployRam = 1024;
				} else if (usrMaxMoney() >= (initialServerCost * 256)) {
					//1,408,000,000
					await manageServers(ns, 1024);
					deployRam = 2048;
				} else if (usrMaxMoney() >= (initialServerCost * 512)) {
					//2,816,000,000
					await manageServers(ns, 2048);
					deployRam = 4096;
				} else if (usrMaxMoney() >= (initialServerCost * 1024)) {
					//5,632,000,000
					await manageServers(ns, 4096);
					deployRam = 8192;
				} else if (usrMaxMoney() >= (initialServerCost * 2048)) {
					//11,264,000,000
					await manageServers(ns, 8192);
					ns.exit();
				}
			}
		} else {
			if (ns.args[0] == null) {
				ns.tprint("You didn't specific the amount of RAM for the server. Ex: run Manager-Server.js 8");
				//ns.tprint("You can also run it in automatic mode. Ex: run Manager-Server.js 0 true");
				ns.exit();
			} else {
				if (useDebug) ns.tprint("Manual upgrade to " + deployRam + "Gb ram started.");
				await manageServers(ns, deployRam);
				ns.exit();
			}
		}
		await ns.asleep(50);
	}
}