/** @param {NS} ns **/
export async function main(ns) {
	let svName = ns.args[0];
	var svRAM = ns.getServerMaxRam(svName);
	var svPorts = ns.getServerNumPortsRequired(svName);
	var svReqHack = ns.getServerRequiredHackingLevel(svName);
	var svMinSec = ns.getServerMinSecurityLevel(svName);
	var svGrowth = ns.getServerGrowth(svName);
	var svCurMoney = ns.getServerMoneyAvailable(svName);
	var svMaxMoney = ns.getServerMaxMoney(svName);
	var svExecTime = ns.getHackTime(svName);
	var svScore = nFormatter(((svMaxMoney * 100 / svGrowth) / svExecTime), 4);
	var svScore00 = nFormatter(Math.round((100 - svMinSec) * svMaxMoney * svGrowth / svExecTime), 2);
	var svScore01 = ns.nFormat(((svMaxMoney / svGrowth) / svExecTime), '0.0000');
	let hackThreads = Math.floor((0.50 / ns.hackAnalyze(svName)));
	var max_length = 30;
	var border_max_length = 45;
	var outputBlank = "\r\n";
	var outputScore = "\r\nScore:"
	var outputScore00 = "\r\nScore00:"
	var outputScore01 = "\r\nScore01:"
	var outputHost = "\r\nHost:"
	var outputMaxRam = "\r\nMax Ram:"
	var outputPorts = "\r\nPorts:"
	var outputHackTime = "\r\nHack Time:"
	var outputHackThreads = "\r\nNeeded Hack Threads:"
	var outputReqHacking = "\r\nRequired Hacking:"
	var outputMinSec = "\r\nMin Security:"
	var outputSrvGrowth = "\r\nServer Growth:"
	var outputSrvMoney = "\r\nServer Money:"
	var outputSrvMaxMoney = "\r\nServer Max Money:"
	ns.tprint("Polling server " + svName);
	ns.tprint(""
		+ outputBlank + '-'.repeat(border_max_length - outputBlank.length)
		+ outputScore + ' '.repeat(max_length - outputScore.length) + svScore
		+ outputScore00 + ' '.repeat(max_length - outputScore00.length) + svScore00
		+ outputScore01 + ' '.repeat(max_length - outputScore01.length) + svScore01
		+ outputHost + ' '.repeat(max_length - outputHost.length) + svName
		+ outputMaxRam + ' '.repeat(max_length - outputMaxRam.length) + svRAM + "GB"
		+ outputPorts + ' '.repeat(max_length - outputPorts.length) + svPorts
		+ outputHackTime + ' '.repeat(max_length - outputHackTime.length) + ns.nFormat(svExecTime, '0.00')
		+ outputHackThreads + ' '.repeat(max_length - outputHackThreads.length) + ns.nFormat(hackThreads, '0.00')
		+ outputReqHacking + ' '.repeat(max_length - outputReqHacking.length) + svReqHack
		+ outputMinSec + ' '.repeat(max_length - outputMinSec.length) + svMinSec
		+ outputSrvGrowth + ' '.repeat(max_length - outputSrvGrowth.length) + svGrowth
		+ outputSrvMoney + ' '.repeat(max_length - outputSrvMoney.length) + ns.nFormat(svCurMoney, '$0,0.00')
		+ outputSrvMaxMoney + ' '.repeat(max_length - outputSrvMaxMoney.length) + ns.nFormat(svMaxMoney, '$0,0.00')
		+ outputBlank + '-'.repeat(border_max_length - outputBlank.length));
}

export function nFormatter(num, digits) {
	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "k" },
		{ value: 1e6, symbol: "m" },
		{ value: 1e9, symbol: "b" },
		{ value: 1e12, symbol: "t" },
		{ value: 1e15, symbol: "p" },
		{ value: 1e18, symbol: "e" }
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var item = lookup.slice().reverse().find(function (item) {
		return num >= item.value;
	});
	return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export function autocomplete(data, args) {
	return [...data.servers];
}