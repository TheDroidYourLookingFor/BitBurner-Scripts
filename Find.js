/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	const useDebug = false;

	if (useDebug) ns.tail(usrDirectory + "Find.js", "home");

	/** @param {NS} ns **/
	async function lookForTargets(ns) {
		var myHackLevel = ns.getHackingLevel();
		var bestTargetIndex = 15;
		var bestTargetScore = 0;

		var numBusters = 0;
		var portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
		for (var i = 0; i < portBusters.length; i++) {
			if (ns.fileExists(portBusters[i], "home")) ++numBusters;
		}

		ns.clear(usrDirectory + "broke_Targets.txt");
		var rows = await ns.read(usrDirectory + "networkProbeData.txt").split("\r\n");
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

			if (!(ns.hasRootAccess(svName)) && (numBusters >= svPortsNeeded) && (myHackLevel >= svReqHack)) {
				if (numBusters > 0) ns.brutessh(svName);
				if (numBusters > 1) ns.ftpcrack(svName);
				if (numBusters > 2) ns.relaysmtp(svName);
				if (numBusters > 3) ns.httpworm(svName);
				if (numBusters > 4) ns.sqlinject(svName);
				ns.nuke(svName);
				ns.tprint("Server hacked: " + svName);
			}

			if (ns.hasRootAccess(svName)) {
				if (svCurMoney < 50000) {
					// await ns.write(usrDirectory + "broke_Targets.txt", svName
					// 	+ "," + ns.getServerMaxRam(svName)
					// 	+ "," + ns.getServerNumPortsRequired(svName)
					// 	+ "," + ns.getServerMinSecurityLevel(svName)
					// 	+ "," + ns.getServerRequiredHackingLevel(svName)
					// 	+ "," + ns.getHackTime(svName)
					// 	+ "," + ns.getServerMoneyAvailable(svName)
					// 	+ "," + ns.getServerMaxMoney(svName)
					// 	+ "," + ns.getServerGrowth(svName)
					// 	+ "\r\n");
				} else {
					svScore = ((svMaxMoney * 100 / svGrowth) / svExecTime);
					if (svScore > bestTargetScore) {
						ns.print("New High Score: " + bestTargetScore);
						bestTargetScore = svScore;
						bestTargetIndex = i;
					}
				}
			}
			ns.print(i);
		}
		await ns.write(usrDirectory + "best_target.txt", rows[bestTargetIndex], "w");
		outputStats(ns, svName);
	}

	async function outputStats(ns, svrName) {
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
		ns.print(""
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
			+ "\r\n" + rows[bestTargetIndex]
			+ "\r\n-------------------------------------");
	}

	// Do things
	lookForTargets(ns);
}