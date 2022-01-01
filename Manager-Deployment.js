/** @param {NS} ns **/
import {
	userDirectory,
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
	deploymentCountdown
} from "/TheDroid/TheDroid-Core.js";

var serverList = [];
/** @param {NS} ns **/
export async function main(ns) {
	const useAutoHack = true;
	const useAutoFindBest = true;
	const useHomeServer = true;
	const usrDirectory = userDirectory;
	ns.tail();
	ns.disableLog('ALL');
	serverList = [];
	var svTarget = "joesguns";
	var lastTarget = svTarget;
	const hackScripts = [usrDirectory + "weaken.js", usrDirectory + "hack.js", usrDirectory + "grow.js"];
	const scriptCore = usrDirectory + "TheDroid-Core.js";

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
			if (useHomeServer) prepareHome(ns, hackScripts[0], svTarget, 64, hackScripts[1], hackScripts[2]);
			serverList = probeNetwork(ns);
			try { await prepareTargets(ns, serverList, hackScripts[0], scriptCore, svTarget); } catch { }
		} else if (srvGetMoneyAvailable(ns, svTarget) < moneyThresh) {
			if (useHomeServer) prepareHome(ns, hackScripts[2], svTarget, 64, hackScripts[0], hackScripts[1]);
			serverList = probeNetwork(ns);
			try { await prepareTargets(ns, serverList, hackScripts[2], scriptCore, svTarget); } catch { }
		} else {
			if (useHomeServer) prepareHome(ns, hackScripts[1], svTarget, 64, hackScripts[0], hackScripts[2]);
			serverList = probeNetwork(ns);
			try { await prepareTargets(ns, serverList, hackScripts[1], scriptCore, svTarget); } catch { }
		}

		await ns.asleep(250);
		if (deploymentCountdown > 0) outputDeploymentCountdown(ns, 250, false);
		outputDeployment(ns, svTarget);
	}
}