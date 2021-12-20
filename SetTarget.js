/** @param {NS} ns **/
export async function main(ns) {
	var svName = ns.args[0];
	await ns.write("/TheDroid/best_target.txt", svName
		+ "," + ns.getServerMaxRam(svName)
		+ "," + ns.getServerNumPortsRequired(svName)
		+ "," + ns.getServerMinSecurityLevel(svName)
		+ "," + ns.getServerRequiredHackingLevel(svName)
		+ "," + ns.getHackTime(svName)
		+ "," + ns.getServerMoneyAvailable(svName)
		+ "," + ns.getServerMaxMoney(svName)
		+ "," + ns.getServerGrowth(svName)
		+ "\r\n", "w");
	ns.tprint("\r\n" + "/TheDroid/best_target.txt", svName
		+ "," + ns.getServerMaxRam(svName)
		+ "," + ns.getServerNumPortsRequired(svName)
		+ "," + ns.getServerMinSecurityLevel(svName)
		+ "," + ns.getServerRequiredHackingLevel(svName)
		+ "," + ns.getHackTime(svName)
		+ "," + ns.getServerMoneyAvailable(svName)
		+ "," + ns.getServerMaxMoney(svName)
		+ "," + ns.getServerGrowth(svName)
		+ "\r\n");
}

export function autocomplete(data, args) {
	return [...data.servers];
}