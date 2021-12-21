/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	const useDebug = false;
	if (useDebug) ns.tail(usrDirectory + "nmap.js", "home");
	var servers = ["home"];
	var newScan;
	var hostname;

	/** @param {NS} ns **/
	async function probeNetwork(ns) {
		newScan = ns.scan(hostname);
		for (var j = 0; j < newScan.length; j++) {
			if (servers.indexOf(newScan[j]) == -1) {
				servers.push(newScan[j]);
			}
		}
	}
	/** @param {NS} ns **/
	async function outputProbeToFile(ns) {
		if (useDebug) ns.tprint("Beginning network probe.");
		ns.clear(usrDirectory + "networkProbeData.txt");
		ns.clear(usrDirectory + "broke_Targets.txt");
		for (var i = 0; i < servers.length; ++i) {
			hostname = servers[i];
			if (!ns.getServerMaxMoney(hostname) == 0) {
				await ns.write(usrDirectory + "networkProbeData.txt", hostname
					+ "," + ns.getServerMaxRam(hostname)
					+ "," + ns.getServerNumPortsRequired(hostname)
					+ "," + ns.getServerMinSecurityLevel(hostname)
					+ "," + ns.getServerRequiredHackingLevel(hostname)
					+ "," + ns.getHackTime(hostname)
					+ "," + ns.getServerMoneyAvailable(hostname)
					+ "," + ns.getServerMaxMoney(hostname)
					+ "," + ns.getServerGrowth(hostname)
					+ "\r\n");
			} else {
				await ns.write(usrDirectory + "broke_Targets.txt", hostname
					+ "," + ns.getServerMaxRam(hostname)
					+ "," + ns.getServerNumPortsRequired(hostname)
					+ "," + ns.getServerMinSecurityLevel(hostname)
					+ "," + ns.getServerRequiredHackingLevel(hostname)
					+ "," + ns.getHackTime(hostname)
					+ "," + ns.getServerMoneyAvailable(hostname)
					+ "," + ns.getServerMaxMoney(hostname)
					+ "," + ns.getServerGrowth(hostname)
					+ "\r\n");
			}
			probeNetwork(ns);
		}
		if (useDebug) ns.tprint("Network mapped.");
	}
	// write some launch commands
	await outputProbeToFile(ns);
	
}