/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	const useDebug = false;
	if (useDebug) ns.tail(ns.getScriptName());

	const usrProbeData = usrDirectory + "best_target.txt";
	const usrProbeData2 = usrDirectory + "networkProbeData.txt";
	const usrProbeData3 = usrDirectory + "broke_Targets.txt";

	var myHackLevel = ns.getHackingLevel();
	var numBusters = 0;
	var portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
	for (var i = 0; i < portBusters.length; i++) {
		if (ns.fileExists(portBusters[i], "home")) ++numBusters;
	}

	/** @param {NS} ns **/
	function hackTarg(ns, svName, svPortsNeeded, svReqHack) {
		if (useDebug) ns.tprint("Attempting to hack target: " + svName);
		if (!(ns.hasRootAccess(svName)) && (numBusters >= svPortsNeeded) && (myHackLevel >= svReqHack)) {
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
		}
	}
	async function lookForHackableTargs(ns, fileName) {
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

			if (!ns.hasRootAccess(svName)) hackTarg(ns, svName, svPortsNeeded, svReqHack);
		}
	}
	/** @param {NS} ns **/
	async function lookForBestTarget(ns, fileName) {
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

			if (ns.hasRootAccess(svName) && (myHackLevel >= svReqHack)) {
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

	async function outputStats(ns, svrName, svrBest) {
		var svName = svrName;
		var svRAM = ns.getServerMaxRam(svName);
		var svPorts = ns.getServerNumPortsRequired(svName);
		var svReqHack = ns.getServerRequiredHackingLevel(svName);
		var svMinSec = ns.getServerMinSecurityLevel(svName);
		var svGrowth = ns.getServerGrowth(svName);
		var svCurMoney = ns.getServerMoneyAvailable(svName);
		var svMaxMoney = ns.getServerMaxMoney(svName);
		var svExecTime = ns.getHackTime(svName);
		var svScore = (100 - svMinSec) * (svMaxMoney - svCurMoney) * svGrowth / svExecTime;
		var svScore00 = ((100 - svMinSec) * svMaxMoney * svGrowth) / svExecTime;
		var svScore01 = ((svMaxMoney - svCurMoney) / svGrowth) / svExecTime;
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
			+ "\r\n" + svrBest
			+ "\r\n-------------------------------------");
	}

	// Do things
	await lookForHackableTargs(ns, usrProbeData2);
	await ns.sleep(50);
	await lookForBestTarget(ns, usrProbeData3);
	await ns.sleep(50);
	await lookForBestTarget(ns, usrProbeData2);
	await ns.sleep(50);
}