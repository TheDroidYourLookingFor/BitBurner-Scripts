/** @param {NS} ns **/
import {
	scriptWHG,
	scriptAll,
	consoleMessage,
	debugMessage,
	lookForHackableTargs,
	lookForBestTarget,
	outputDeployment,
	networkAttack,
	probeNetwork,
	batch
} from "/TheDroid/TheDroid-Core.js";

var serverList = [];
var attackerList = [];
/** @param {NS} ns **/
export async function main(ns) {
	const batchLoops = 10;
	// Let the system automatically  hack new servers
	const useAutoHack = true;
	// Let the system automatically find the best target
	const useAutoFindBest = false;
	// Old method of scheduling
	const deployMode00 = false;
	// Newer method of scheduling
	const deployMode01 = true;

	// Set your static target here if not using useAutoFindBest
	//var svTarget = "n00dles";
	//var svTarget = "joesguns";
	var svTarget = "the-hub";
	var lastTarget = svTarget;

	ns.tail();
	ns.disableLog('ALL');
	serverList = [];
	var lastMode = "HWGW";

	const args = ns.flags([['help', false]]);
	if (args.help) {
		consoleMessage(ns, "This script will launch our servers into an weaken, grow, and hack cycle.");
		consoleMessage(ns, `USAGE: run ${ns.getScriptName()}`);
		consoleMessage(ns, "Example:");
		consoleMessage(ns, `> run ${ns.getScriptName()}`);
		return;
	}
	
	outputDeployment(ns, svTarget, lastMode);

	while (true) {
		if (useAutoHack) {
			serverList = probeNetwork(ns);
			lookForHackableTargs(ns, serverList);
			await ns.asleep(1);
		}
		if (useAutoFindBest) {
			serverList = probeNetwork(ns);
			let lfbTarg = await lookForBestTarget(ns, serverList)
			if (lfbTarg != null) {
				svTarget = lfbTarg;
			}
			await ns.asleep(1);
			if (svTarget != lastTarget) {
				lastTarget = svTarget;
				consoleMessage(ns, "New Target: " + lastTarget);
			}
		}

		if (deployMode00) {
			lastMode = "HWGW"
			serverList = probeNetwork(ns);
			debugMessage(ns, "Beginning distribution of scripts to all servers.");
			debugMessage(ns, "Best Target: " + svTarget);
			await networkAttack(ns, false, svTarget);
			debugMessage(ns, "Finished distributing scripts to all servers.");
		}

		if (deployMode01) {
			lastMode = "HWGW"
			let svHostCount = 0;
			attackerList = [];
			serverList = probeNetwork(ns);
			serverList.push(ns.getServer("home"));
			try {
				for (const svHost of serverList) {
					if (svHost.hasAdminRights) {
						attackerList.push(svHost);
						if (svHost.hostname != "home") await ns.scp(scriptAll, "home", svHost.hostname);
						await ns.sleep(1);
						svHostCount++;
					}
				}
			} catch (e) {}

			if (ns.scriptRunning(scriptWHG[2], attackerList[svHostCount - 1].hostname)) {
				// outputDeployment(ns, svTarget, curMode, ns.getRunningScript(scriptWHG[2], attackerList[svHostCount - 1].hostname, svCheckArgs).onlineRunningTime);
			} else {
				try { await batch(ns, batchLoops, svTarget); } catch (e) { }
			}
		}

		outputDeployment(ns, svTarget, lastMode);
		await ns.asleep(1);
	}
}