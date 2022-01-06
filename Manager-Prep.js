/** @param {NS} ns **/
import {
	scriptAll,
	consoleMessage,
	debugMessage,
	srvGetMinSecurityLevel,
	srvGetSecurityLevel,
	srvGetMoneyAvailable,
	outputDeployment,
	srvGetMaxMoney
} from "/TheDroid/TheDroid-Core.js";
/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("scan");
	ns.disableLog("sleep");
	var svTarget = ns.args[0];
	let useRamPct = 45;
	while (true) {
		var moneyThresh = 0.90;
		if (srvGetSecurityLevel(ns, svTarget) > srvGetMinSecurityLevel(ns, svTarget) || srvGetMoneyAvailable(ns, svTarget) < (srvGetMaxMoney(ns, svTarget) * moneyThresh)) {
			if (!ns.scriptRunning(scriptAll[0], "home")) ns.run("/TheDroid/RunOnAll.js", 1, "weaken", svTarget, useRamPct);
			if (!ns.scriptRunning(scriptAll[2], "home")) ns.run("/TheDroid/RunOnAll.js", 1, "grow", svTarget, useRamPct);
			while (ns.scriptRunning(scriptAll[0], "home") || ns.scriptRunning(scriptAll[2], "home")) {
				outputDeployment(ns, svTarget, "Prepping");
				await ns.sleep(250);
			}
		} else {
			ns.run("/TheDroid/RunOnAll.js", 1, "kill");
			ns.exit();
		}
		await ns.sleep(250);
	}

}