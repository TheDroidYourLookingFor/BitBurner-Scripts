/** @param {NS} ns **/
import {
	scriptCore,
	scriptWHG,
	deployTarget,
	consoleMessage,
	debugMessage,
	lookForHackableTargs,
	lookForBestTarget,
	outputDeployment,
	networkAttack,
	srvGetMaxMoney,
	srvGetMinSecurityLevel,
	srvGetSecurityLevel,
	srvGetMoneyAvailable,
	probeNetwork,
	outputDeploymentCountdown,
	countTotalScriptThreads,
	displayTotalThreads
} from "/TheDroid/TheDroid-Core.js";

var serverList = [];
var attackList = ["foodnstuff", "joesguns", "sigma-cosmetics", "hong-fang-tea", "harakiri-sushi", "iron-gym"];
/** @param {NS} ns **/
export async function main(ns) {
	const useAutoHack = true;
	const useAutoFindBest = true;
	const useHomeServer = true;
	const deployMode00 = true;
	const deployMode01 = false;
	ns.tail();
	ns.disableLog('ALL');
	serverList = [];
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

	outputDeployment(ns, svTarget, lastMode);
	// outputDeploymentCountdown(ns, 0, true);
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
		
		outputDeployment(ns, svTarget, lastMode);

		if (deployMode00) {
			lastMode = "WHG"
			serverList = probeNetwork(ns);
			debugMessage(ns, "Beginning distribution of scripts to all servers.");
			debugMessage(ns, "Best Target: " + svTarget);
			await networkAttack(ns, true, svTarget);
			debugMessage(ns, "Finished distributing scripts to all servers.");
		}

		if (deployMode01) {
			serverList = probeNetwork(ns);
			for (const svTarg of attackList) {
				for (const svHost of serverList) {
					var neededWeakenThreads;
					var neededHackThreads;
					var neededGrowThreads;
					var wMem = ns.getScriptRam(scriptWHG[0]);
					var hMem = ns.getScriptRam(scriptWHG[1]);
					var gMem = ns.getScriptRam(scriptWHG[2]);
					try { neededWeakenThreads = Math.ceil((srvGetSecurityLevel(ns, svTarg) - srvGetMinSecurityLevel(ns, svTarg)) * 20); } catch (e) { }
					try { neededHackThreads = Math.ceil(ns.hackAnalyzeThreads(svTarg, srvGetMoneyAvailable(ns, svTarg))); } catch (e) { }
					try { neededGrowThreads = Math.ceil(ns.growthAnalyze(svTarg, srvGetMaxMoney(ns, svTarg) / srvGetMoneyAvailable(ns, svTarg))); } catch (e) { }
					var usedWeakenThreads = await countTotalScriptThreads(ns, svTarg, scriptWHG[0]);
					var usedHackThreads = await countTotalScriptThreads(ns, svTarg, scriptWHG[1]);
					var usedGrowThreads = await countTotalScriptThreads(ns, svTarg, scriptWHG[2]);

					let availableThreads = (svHost.maxRam - svHost.ramUsed) / wMem;
					if ((neededWeakenThreads - usedWeakenThreads) > usedWeakenThreads && availableThreads > 0) {
						if (lastMode != "weaken") {
							lastMode = "weaken";
						}
						await deployTarget(ns, svHost, scriptWHG[0], scriptCore, svTarg, neededWeakenThreads - usedWeakenThreads);
					}

					availableThreads = (svHost.maxRam - svHost.ramUsed) / hMem;
					if ((neededHackThreads - usedHackThreads) > usedHackThreads && availableThreads > 0) {
						if (lastMode != "hack") {
							lastMode = "hack";
						}
						await deployTarget(ns, svHost, scriptWHG[1], scriptCore, svTarg, neededHackThreads - usedHackThreads);
					}

					availableThreads = (svHost.maxRam - svHost.ramUsed) / gMem;
					if ((neededGrowThreads - usedGrowThreads) > usedGrowThreads && availableThreads > 0) {
						if (lastMode != "grow") {
							lastMode = "grow";
						}
						await deployTarget(ns, svHost, scriptWHG[2], scriptCore, svTarg, neededGrowThreads - usedGrowThreads);
					}
				};
			}
		}

		outputDeployment(ns, svTarget, lastMode);
		await ns.asleep(250);
	}
}