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
		ns.clear(usrDirectory + "networkProbeData.txt");
		for (var i = 0; i < servers.length; ++i) {
			hostname = servers[i];
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
			probeNetwork(ns);
		}
	}
	// write some launch commands
	ns.tprint("Beginning network probe.");
	await outputProbeToFile(ns);
	ns.tprint("Network mapped.");
}