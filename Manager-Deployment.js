/** @param {NS} ns **/
import {
	scriptCore,
	scriptWHG,
	consoleMessage,
	lookForHackableTargs,
	lookForBestTarget,
	outputDeployment,
	prepareHome,
	srvGetMaxMoney,
	srvGetMinSecurityLevel,
	srvGetSecurityLevel,
	srvGetMoneyAvailable,
	prepareTargets,
	probeNetwork,
	outputDeploymentCountdown,
	deploymentCountdown,
	setTotalThreads,
	setTotalServers,
	countTotalThreads
} from "/TheDroid/TheDroid-Core.js";

var serverList = [];
/** @param {NS} ns **/
export async function main(ns) {
	const useAutoHack = true;
	const useAutoFindBest = true;
	const useHomeServer = true;
	ns.tail();
	ns.disableLog('ALL');
	serverList = [];
	var svTarget = "joesguns";
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
	
	outputDeploymentCountdown(ns, 0, true);
	while (true) {
		if (useAutoHack) {
			serverList = probeNetwork(ns);
			lookForHackableTargs(ns, serverList);
			await ns.asleep(5);
		}
		if (useAutoFindBest) {
			serverList = probeNetwork(ns);
			let lfbTarg = await lookForBestTarget(ns, serverList)
			if (lfbTarg != null) {
				svTarget = lfbTarg;
			}
			await ns.asleep(5);
			if (svTarget != lastTarget) {
				lastTarget = svTarget;
				consoleMessage(ns, "New Target: " + lastTarget);
			}
		}

		var moneyThresh = srvGetMaxMoney(ns, svTarget) * 0.75;
		var securityThresh = srvGetMinSecurityLevel(ns, svTarget) + 5;

		if (srvGetSecurityLevel(ns, svTarget) > securityThresh) {
			if (lastMode != "weaken") {
				lastMode = "weaken";
				setTotalServers(0);
				setTotalThreads(0);
			}
			if (useHomeServer) prepareHome(ns, scriptWHG[0], svTarget, 64, scriptWHG[1], scriptWHG[2]);
			serverList = probeNetwork(ns);
			try { await prepareTargets(ns, serverList, scriptWHG[0], scriptCore, svTarget); } catch(e) { }
		} else if (srvGetMoneyAvailable(ns, svTarget) < moneyThresh) {
			if (lastMode != "grow") {
				lastMode = "grow";
				setTotalServers(0);
				setTotalThreads(0);
			}
			if (useHomeServer) prepareHome(ns, scriptWHG[2], svTarget, 64, scriptWHG[0], scriptWHG[1]);
			serverList = probeNetwork(ns);
			try { await prepareTargets(ns, serverList, scriptWHG[2], scriptCore, svTarget); } catch(e) { }
		} else {
			if (lastMode != "attack") {
				lastMode = "attack";
				setTotalServers(0);
				setTotalThreads(0);
			}
			if (useHomeServer) prepareHome(ns, scriptWHG[1], svTarget, 64, scriptWHG[0], scriptWHG[2]);
			serverList = probeNetwork(ns);
			try { await prepareTargets(ns, serverList, scriptWHG[1], scriptCore, svTarget); } catch(e) { }
		}

		await ns.asleep(250);
		outputDeployment(ns, svTarget, lastMode);
	}
}