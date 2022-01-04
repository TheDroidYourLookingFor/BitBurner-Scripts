/** @param {NS} ns **/
import {
	scriptWHG,
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
	const useAutoHack = true;
	const useAutoFindBest = false;
	const useHomeServer = true;
	const deployMode00 = false;
	const deployMode01 = true;
	ns.tail();
	ns.disableLog('ALL');
	serverList = [];/** @param {NS} ns **/
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
	const useAutoHack = true;
	const useAutoFindBest = true;
	const useHomeServer = true;
	const deployMode00 = false;
	const deployMode01 = true;
	ns.tail();
	ns.disableLog('ALL');
	serverList = [];
	//var svTarget = "the-hub";
	var svTarget = "n00dles";
	var lastTarget = svTarget;
	var lastMode = "weaken";

	const args = ns.flags([['help', false]]);
	if (args.help) {
		ns.tprint("This script will launch our servers into an weaken, grow, and hack cycle.");
		ns.tprint(`USAGE: run ${ns.getScriptName()}`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()}`);
		return;
	}

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
			for (const svHost of serverList) {
				if (svHost.hasAdminRights) {
					attackerList.push(svHost);
					if (svHost.hostname != "home") await ns.scp(scriptAll,"home",svHost.hostname);
					await ns.sleep(1);
					svHostCount++;
				}
			}
			if (ns.scriptRunning(scriptWHG[2], attackerList[svHostCount - 1].hostname)) {
				// outputDeployment(ns, svTarget, curMode, ns.getRunningScript(scriptWHG[2], attackerList[svHostCount - 1].hostname, svCheckArgs).onlineRunningTime);
			} else {
				await batch(ns, batchLoops, svTarget);
			}
		}


		outputDeployment(ns, svTarget, lastMode);
		await ns.asleep(1);
	}
}