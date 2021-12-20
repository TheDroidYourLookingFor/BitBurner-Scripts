/** @param {NS} ns **/
export async function main(ns) {
	var svName = ns.args[0];
	var svRAM = ns.getServerMaxRam(svName);
	var svPorts = ns.getServerNumPortsRequired(svName);
	var svReqHack = ns.getServerRequiredHackingLevel(svName);
	var svMinSec = ns.getServerMinSecurityLevel(svName);
	var svGrowth = ns.getServerGrowth(svName);
	var svCurMoney = ns.getServerMoneyAvailable(svName);
	var svMaxMoney = ns.getServerMaxMoney(svName);
	var svExecTime = ns.getHackTime(svName);
	var svScore = ((svMaxMoney - svCurMoney) / svGrowth) / svExecTime;
	var svScore00 = Math.round((100 - svMinSec) * svMaxMoney * svGrowth / svExecTime);
	var svScore01 = (svMaxMoney / svGrowth) / svExecTime;
	ns.tprint("Polling server " + svName);
	ns.tprint(""
		+ "\r\n-------------------------------------"
		+ "\r\nScore: " + svScore
		+ "\r\nScore00: " + svScore00
		+ "\r\nScore01: " + svScore01
		+ "\r\nHost: " + svName
		+ "\r\nMax Ram: " + svRAM + "GB"
		+ "\r\nPorts: " + svPorts
		+ "\r\nHack Time: " + svExecTime
		+ "\r\nRequired Hacking: " + svReqHack
		+ "\r\nMin Security: " + svMinSec
		+ "\r\nServer Growth: " + svGrowth
		+ "\r\nServer Money: " + ns.nFormat(svCurMoney, '$0,0.00')
		+ "\r\nServer Max Money: " + ns.nFormat(svMaxMoney, '$0,0.00')
		+ "\r\n-------------------------------------");
}

export function autocomplete(data, args) {
	return [...data.servers];
}