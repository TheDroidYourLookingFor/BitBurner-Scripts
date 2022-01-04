/** @param {NS} ns **/
import {
	scriptAll,
	consoleMessage,
	debugMessage,
	srvGetMinSecurityLevel,
	srvGetSecurityLevel,
	srvGetMoneyAvailable,
	srvGetMaxMoney,
	probeNetwork
} from "/TheDroid/TheDroid-Core.js";
/** @param {NS} ns **/
export async function main(ns) {
	var svTarget = ns.args[0];
	consoleMessage(ns, "[PREP]Beginning preparation of target " + svTarget + ".");

	while (true) {
		ns.disableLog("sleep");
		var serverList = probeNetwork(ns);

		var moneyThresh = 0.90;
		if (srvGetSecurityLevel(ns, svTarget) > srvGetMinSecurityLevel(ns, svTarget) || srvGetMoneyAvailable(ns, svTarget) < (srvGetMaxMoney(ns, svTarget) * moneyThresh)) {
			ns.run("/TheDroid/RunOnAll.js", 1, "weaken", svTarget, "45");
			ns.run("/TheDroid/RunOnAll.js", 1, "grow", svTarget, "45");
			while (ns.scriptRunning(scriptAll[0], "home") || ns.scriptRunning(scriptAll[2], "home")) {
				await ns.sleep(250);
			}
		} else {
			consoleMessage(ns, "[PREP]Finishing preparation of target " + svTarget + ".");
			ns.run("/TheDroid/RunOnAll.js", 1, "kill");
			ns.exit();
		}
		await ns.sleep(250);
	}

}