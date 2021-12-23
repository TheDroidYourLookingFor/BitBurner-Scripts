export var userDirectory = new String("/TheDroid/");
export var usrProbeData00 = new String("networkProbeData.txt");
export var usrProbeData01 = new String("broke_Targets.txt");
export var usrProbeData02 = new String("best_target.txt");
export var userDebug = new Boolean(false);

/** @param {NS} ns **/
export function userHackingLevel(ns) {
	return ns.getHackingLevel();
}
/** @param {NS} ns **/
export function srvGetMaxRam(ns, svName) {
	return ns.getServerMaxRam(svName);
}
/** @param {NS} ns **/
export function srvGetNumPortsReq(ns, svName) {
	return ns.getServerNumPortsRequired(svName);
}
/** @param {NS} ns **/
export function srvGetReqHackingLevel(ns, svName) {
	return ns.getServerRequiredHackingLevel(svName);
}
/** @param {NS} ns **/
export function srvGetMinSecurityLevel(ns, svName) {
	return ns.getServerMinSecurityLevel(svName);
}
/** @param {NS} ns **/
export function srvGetGrowth(ns, svName) {
	return ns.getServerGrowth(svName);
}
/** @param {NS} ns **/
export function srvGetMoneyAvailable(ns, svName) {
	return ns.getServerMoneyAvailable(svName);
}
/** @param {NS} ns **/
export function srvGetMaxMoney(ns, svName) {
	return ns.getServerMaxMoney(svName);
}
/** @param {NS} ns **/
export function srvGetHackTime(ns, svName) {
	return ns.getHackTime(svName);
}
/** @param {NS} ns **/
export function srvCheckRootAccess(ns, svName) {
	return ns.hasRootAccess(svName);
}
/** @param {NS} ns **/
export async function srvKillAll(ns, svName) {
	ns.killall(svName);
	await ns.asleep(250);
}
/** @param {NS} ns **/
export async function srvSCPFiles(ns, svName, svScriptName) {
	await ns.scp(svScriptName, "home", svName);
	await ns.asleep(250);
}
/** @param {NS} ns **/
export async function uploadToHost(ns, svHost, hackScripts) {
	const useDebug = userDebug;
	if (useDebug) ns.tprint("Killing all processes on " + svHost);
	await srvKillAll(ns, svHost);
	if (useDebug) ns.tprint("Copying hackscripts to " + svHost);
	await srvSCPFiles(ns, svHost, hackScripts)
}
/** @param {NS} ns **/
export async function bestTarget(ns) {
	const usrDirectory = userDirectory;
	const bestTarget = await ns.read(usrDirectory + usrProbeData02).split(",");
	const targName = bestTarget[0];
	return targName;
}
/** @param {NS} ns **/
export async function outputStats(ns, svName, svBest) {
	var svRAM = srvGetMaxRam(ns, svName);
	var svPorts = srvGetNumPortsReq(ns, svName);
	var svReqHack = srvGetReqHackingLevel(ns, svName);
	var svMinSec = srvGetMinSecurityLevel(ns, svName);
	var svGrowth = srvGetGrowth(ns, svName);
	var svCurMoney = srvGetMoneyAvailable(ns, svName);
	var svMaxMoney = srvGetMaxMoney(ns, svName);
	var svExecTime = srvGetHackTime(ns, svName);
	var svScore = nFormatter(((svMaxMoney * 100 / svGrowth) / svExecTime), 4);
	var svScore00 = nFormatter(Math.round((100 - svMinSec) * svMaxMoney * svGrowth / svExecTime), 2);
	var svScore01 = ns.nFormat(((svMaxMoney / svGrowth) / svExecTime), '0.0000');
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
	var outputReqHacking = "\r\nRequired Hacking:"
	var outputMinSec = "\r\nMin Security:"
	var outputSrvGrowth = "\r\nServer Growth:"
	var outputSrvMoney = "\r\nServer Money:"
	var outputSrvMaxMoney = "\r\nServer Max Money:"
	var outputSrvBest = "\r\nBest Target:"
	ns.tprint(""
		+ outputBlank + '-'.repeat(border_max_length - outputBlank.length)
		+ outputScore + ' '.repeat(max_length - outputScore.length) + svScore
		+ outputScore00 + ' '.repeat(max_length - outputScore00.length) + svScore00
		+ outputScore01 + ' '.repeat(max_length - outputScore01.length) + svScore01
		+ outputHost + ' '.repeat(max_length - outputHost.length) + svName
		+ outputMaxRam + ' '.repeat(max_length - outputMaxRam.length) + svRAM + "GB"
		+ outputPorts + ' '.repeat(max_length - outputPorts.length) + svPorts
		+ outputHackTime + ' '.repeat(max_length - outputHackTime.length) + ns.nFormat(svExecTime, '0.00')
		+ outputReqHacking + ' '.repeat(max_length - outputReqHacking.length) + svReqHack
		+ outputMinSec + ' '.repeat(max_length - outputMinSec.length) + svMinSec
		+ outputSrvGrowth + ' '.repeat(max_length - outputSrvGrowth.length) + svGrowth
		+ outputSrvMoney + ' '.repeat(max_length - outputSrvMoney.length) + ns.nFormat(svCurMoney, '$0,0.00')
		+ outputSrvMaxMoney + ' '.repeat(max_length - outputSrvMaxMoney.length) + ns.nFormat(svMaxMoney, '$0,0.00')
		+ outputSrvBest + ' '.repeat(max_length - outputSrvBest.length) + svBest
		+ outputBlank + '-'.repeat(border_max_length - outputBlank.length));
}

/** @param {NS} ns **/
export async function pollServer(ns, svName) {
	var svRAM = srvGetMaxRam(ns, svName);
	var svPorts = srvGetNumPortsReq(ns, svName);
	var svReqHack = srvGetReqHackingLevel(ns, svName);
	var svMinSec = srvGetMinSecurityLevel(ns, svName);
	var svGrowth = srvGetGrowth(ns, svName);
	var svCurMoney = srvGetMoneyAvailable(ns, svName);
	var svMaxMoney = srvGetMaxMoney(ns, svName);
	var svExecTime = srvGetHackTime(ns, svName);
	var svScore = nFormatter(((svMaxMoney * 100 / svGrowth) / svExecTime), 4);
	var svScore00 = nFormatter(Math.round((100 - svMinSec) * svMaxMoney * svGrowth / svExecTime), 2);
	var svScore01 = ns.nFormat(((svMaxMoney / svGrowth) / svExecTime), '0.0000');
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
		+ outputReqHacking + ' '.repeat(max_length - outputReqHacking.length) + svReqHack
		+ outputMinSec + ' '.repeat(max_length - outputMinSec.length) + svMinSec
		+ outputSrvGrowth + ' '.repeat(max_length - outputSrvGrowth.length) + svGrowth
		+ outputSrvMoney + ' '.repeat(max_length - outputSrvMoney.length) + ns.nFormat(svCurMoney, '$0,0.00')
		+ outputSrvMaxMoney + ' '.repeat(max_length - outputSrvMaxMoney.length) + ns.nFormat(svMaxMoney, '$0,0.00')
		+ outputBlank + '-'.repeat(border_max_length - outputBlank.length));
}

/** @param {NS} ns **/
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

/** @param {NS} ns **/
export function autocomplete(data, args) {
	return [...data.servers];
}

/** @param {NS} ns **/
export async function lookForHackableTargs(ns, fileName) {
	var rows = await ns.read(fileName).split("\r\n");
	for (var i = 0; i < rows.length; ++i) {
		var serverData = rows[i].split(',');
		if (serverData.length < 9) break;
		var svName = serverData[0];
		var svRam = serverData[1];
		var svPortsNeeded = serverData[2];
		var svMinSec = serverData[3];
		var svReqHack = serverData[4];
		var svExecTime = serverData[5];
		var svCurMoney = serverData[6];
		var svMaxMoney = serverData[7];
		var svGrowth = serverData[8];
		var svScore;

		if (!srvCheckRootAccess(ns, svName)) srvFullHack(ns, svName, svPortsNeeded, svReqHack);
	}
}
/** @param {NS} ns **/
export async function lookForBestTarget(ns, fileName) {
	const useDebug = userDebug;
	const usrDirectory = userDirectory;
	let usrProbeData = usrDirectory + "best_target.txt";
	if (useDebug) ns.tprint("Reading: " + fileName);
	var bestTargetIndex = 15;
	var bestTargetScore = 0;

	var rows = await ns.read(fileName).split("\r\n");
	for (var i = 0; i < rows.length; ++i) {
		var serverData = rows[i].split(',');
		if (serverData.length < 9) break;
		var svName = serverData[0];
		var svRam = serverData[1];
		var svPortsNeeded = serverData[2];
		var svMinSec = serverData[3];
		var svReqHack = serverData[4];
		var svExecTime = serverData[5];
		var svCurMoney = serverData[6];
		var svMaxMoney = serverData[7];
		var svGrowth = serverData[8];
		var svScore;

		if (srvCheckRootAccess(ns, svName) && (userHackingLevel(ns) >= svReqHack)) {
			if (svCurMoney < 50000 || svMaxMoney == 0) {
				// They have no money to hack
			} else {
				svScore = ((svMaxMoney * 100 / svGrowth) / svExecTime);
				if (svScore > bestTargetScore) {
					if (useDebug) ns.tprint("New High Score: " + bestTargetScore);
					bestTargetScore = svScore;
					bestTargetIndex = i;
				}
			}
		}
	}
	await ns.write(usrProbeData, rows[bestTargetIndex], "w");
	if (useDebug) await outputStats(ns, svName, rows[bestTargetIndex]);
	await ns.sleep(250);
}

/** @param {NS} ns **/
export async function userConfig(ns) {
	const useDebug = userDebug;
	const usrDirectory = userDirectory;
	if (useDebug) ns.tail(usrDirectory + "Configstuff.js", "home");
	/** @param {NS} ns **/
	async function loadConfig(ns) {
		if (!ns.fileExists(usrDirectory + "userConfig.txt")) {
			await ns.write(usrDirectory + "userConfig.txt",
				+ "," + "Version"
				+ "," + "1.00"
				+ "," + "outputDir"
				+ "," + usrDirectory
				+ "," + "autoManageHacking"
				+ "," + "true"
				+ "," + "autoManageHackNet"
				+ "," + "false"
				+ "," + "autoManageHackNetNodes"
				+ "," + "8"
				+ "," + "autoManageStock"
				+ "," + "true"
				+ "," + "autoManageServers"
				+ "," + "false"
				+ "," + "autoManageServersRam"
				+ "," + "8"
				+ "," + "autoManageHomeSrv"
				+ "," + "true"
				+ "," + "useDebug"
				+ "," + "false"
				+ "\r\n");
		} else {
			var userConfig = await ns.read(usrDirectory + "userConfig.txt").split("\r\n");
			for (var i = 0; i < userConfig.length; ++i) {
				var userData = userConfig[i].split(',');
				if (userData.length < 19) break;
				var curVersion = userData[1];
				var outputDir = userData[3];
				var autoManageHacking = userData[5];
				var autoManageHackNet = userData[7];
				var autoManageHackNetNodes = userData[9];
				var autoManageStock = userData[11];
				var autoManageServers = userData[13];
				var autoManageServersRam = userData[15];
				var autoManageHomeSrv = userData[17];
				var usrUseDebug = userData[19];

				useDebug = usrUseDebug;
				usrDirectory = outputDir;
			}
		}
	}
	loadConfig(ns);
}

/** @param {NS} ns **/
export function srvFullHack(ns, svName, svPortsNeeded, svReqHack) {
	const useDebug = userDebug;
	if (useDebug) ns.tprint("Attempting to hack target: " + svName);
	var numBusters = 0;
	var portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
	for (var i = 0; i < portBusters.length; i++) {
		if (ns.fileExists(portBusters[i], "home")) ++numBusters;
	}

	if (!(srvCheckRootAccess(ns, svName)) && (numBusters >= svPortsNeeded) && (userHackingLevel(ns) >= svReqHack)) {
		if (useDebug) ns.tprint("Attempting to BruteSSH target: " + svName);
		if (numBusters > 0) ns.brutessh(svName);
		if (useDebug) ns.tprint("Attempting to FTPCrack target: " + svName);
		if (numBusters > 1) ns.ftpcrack(svName);
		if (useDebug) ns.tprint("Attempting to RelaySMTP target: " + svName);
		if (numBusters > 2) ns.relaysmtp(svName);
		if (useDebug) ns.tprint("Attempting to HTTPWorm target: " + svName);
		if (numBusters > 3) ns.httpworm(svName);
		if (useDebug) ns.tprint("Attempting to SQLInject target: " + svName);
		if (numBusters > 4) ns.sqlinject(svName);
		ns.nuke(svName);
		//ns.installBackdoor();
		if (useDebug) ns.tprint("Server hacked: " + svName);
	} else {
		if (numBusters < svPortsNeeded && useDebug)
			ns.tprint("We do not have enough port busters."
				+ "\r\nRequired: " + svReqHack
				+ "\r\nCurrent: " + numBusters
			);
	}
}

/** @param {NS} ns **/
export async function beginNetworkAttack(ns, checkRunning, fileName, tName) {
	const useDebug = userDebug;
	const usrDirectory = userDirectory;
	const hackScripts = [usrDirectory + "weaken.js", usrDirectory + "hack.js", usrDirectory + "grow.js", usrDirectory + "aio.js"];
	var hack_mem = ns.getScriptRam(usrDirectory + "weaken.js", "home");
	var aio_mem = ns.getScriptRam(usrDirectory + "aio.js", "home");
	if (useDebug) ns.tprint("Hack Memory: " + hack_mem);
	if (useDebug) ns.tprint("AIO Memory: " + aio_mem);

	var weakenThreadWeight = 15;
	var hackThreadWeight = 55;
	var growThreadWeight = 30;

	var rows = await ns.read(usrDirectory + fileName).split("\r\n");
	for (var i = 0; i < rows.length; ++i) {
		var serverData = rows[i].split(',');
		if (serverData.length < 9) break;
		var svName = serverData[0];
		var svRamAvail = ns.getServerMaxRam(svName);
		var num_threads = Math.floor(svRamAvail / hack_mem);

		if (srvCheckRootAccess(ns, svName) && svName != "home") {
			if (num_threads >= 6) {
				if ((num_threads & 1) != 0) num_threads = num_threads - hack_mem;
				var hack_threads = Math.floor(((hackThreadWeight / 100) * num_threads));
				var grow_threads = Math.floor(((growThreadWeight / 100) * num_threads));
				var weaken_threads = Math.floor(((weakenThreadWeight / 100) * num_threads));

				if (ns.isRunning(hackScripts[1], svName, tName) && checkRunning) {
					if (useDebug) ns.tprint("Hack already running on " + svName);
				} else {
					if (useDebug) ns.tprint("Hack Threads: " + hack_threads
						+ "\r\nGrow Threads: " + grow_threads
						+ "\r\nWeaken Threads: " + weaken_threads
					);
					if (useDebug) ns.tprint("Beginning multithreaded attack on " + tName + " from " + svName + ".");
					await uploadToHost(ns, svName, hackScripts);
					if (useDebug) ns.tprint("Executing " + hackScripts[1] + " with " + hack_threads + " threads on " + tName + " from " + svName);
					ns.exec(hackScripts[1], svName, hack_threads, tName);
					if (useDebug) ns.tprint("Executing " + hackScripts[0] + " with " + weaken_threads + " threads on " + tName + " from " + svName);
					ns.exec(hackScripts[0], svName, weaken_threads, tName);
					if (useDebug) ns.tprint("Executing " + hackScripts[2] + " with " + grow_threads + " threads on " + tName + " from " + svName);
					ns.exec(hackScripts[2], svName, grow_threads, tName);
					await ns.sleep(250);

					svRamAvail = ns.getServerMaxRam(svName);
					var svRamUsed = ns.getServerUsedRam(svName);
					num_threads = (svRamAvail - svRamUsed) / hack_mem;
					if (num_threads > 0) {
						ns.kill(hackScripts[1], svName, tName);
						if (useDebug) ns.tprint("Executing " + hackScripts[1] + " with " + num_threads + " threads on " + tName + " from " + svName);
						ns.exec(hackScripts[1], svName, (hack_threads + num_threads), tName);
					}
				}
			} else {
				if (svRamAvail > aio_mem) {
					num_threads = Math.floor(svRamAvail / aio_mem);
					if (ns.isRunning(hackScripts[3], svName, tName)) {
						if (useDebug) ns.tprint("Hack already running on " + svName);
					} else {
						if (useDebug) ns.tprint("Beginning low memory attack script on " + tName + " from " + svName);
						await uploadToHost(ns, svName, hackScripts);
						if (num_threads > 0) {
							if (useDebug) ns.tprint("Executing " + hackScripts[3] + " with " + num_threads + " threads on " + tName + " from " + svName);
							ns.exec(hackScripts[3], svName, num_threads, tName);
						}
					}
				}
			}

		}
		ns.asleep(25);
	}
}