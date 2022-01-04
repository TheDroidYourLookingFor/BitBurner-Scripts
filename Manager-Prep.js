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

	while (true) {
		var serverList = probeNetwork(ns);

		var moneyThresh = 0.90;
		if (srvGetSecurityLevel(ns, svTarget) > srvGetMinSecurityLevel(ns, svTarget)) {
			ns.run("/TheDroid/RunOnAll.js", 1, "weaken", svTarget, "40");
			ns.run("/TheDroid/RunOnAll.js", 1, "grow", svTarget, "40");
			while (ns.scriptRunning(scriptAll[0], serverList[2].hostname)) {
				await ns.sleep(0.5 * 60 * 1000);
			}
		} else if (srvGetMoneyAvailable(ns, svTarget) < (srvGetMaxMoney(ns, svTarget) * moneyThresh)) {
			ns.run("/TheDroid/RunOnAll.js", 1, "weaken", svTarget, "40");
			ns.run("/TheDroid/RunOnAll.js", 1, "grow", svTarget, "40");
			while (ns.scriptRunning(scriptAll[0], serverList[2].hostname)) {
				await ns.sleep(0.5 * 60 * 1000);
			}
		} else {
			ns.run("/TheDroid/RunOnAll.js", 1, "kill");
			ns.spawn("/TheDroid/Manager-Deployment.js",1)
		}
		await ns.sleep(250);
	}

}