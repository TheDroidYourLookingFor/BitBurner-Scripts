/** @param {import(".").NS } ns */
import {
	scriptWHG,
	scriptAll,
	consoleMessage,
	debugMessage,
	userHackingLevel,
	srvCheckRootAccess,
	lookForHackableTargs,
	lookForBestTarget,
	outputDeployment,
	networkAttack,
	probeNetwork,
	batch
} from "/TheDroid/TheDroid-Core.js";

let serverList = [];
let attackerList = [];
let svTarget;
let lastTarget;
/** @param {import(".").NS } ns */
export async function main(ns) {
	const batchLoops = 10;
	// Disable the welcome settings message
	const disableWelcomeMessage = false;
	// Let the system automatically  hack new servers
	const useAutoHack = true;
	// Let the system automatically find the best target
	const useAutoFindBest = true;
	// Old method of scheduling
	const deployMode00 = false;
	// Newer method of scheduling
	const deployMode01 = true;

	// Set your static target here if not using useAutoFindBest
	const useUserTarget = false;
	if (useUserTarget) svTarget = "the-hub";

	lastTarget = svTarget;

	ns.tail();
	ns.disableLog('ALL');
	serverList = [];
	var lastMode = "HWGW";

	const args = ns.flags([
		['help', false]
	]);
	if (args.help) {
		consoleMessage(ns, "This script will launch our servers into an weaken, grow, and hack cycle.");
		consoleMessage(ns, `USAGE: run ${ns.getScriptName()}`);
		consoleMessage(ns, "Example:");
		consoleMessage(ns, `> run ${ns.getScriptName()}`);
		return;
	}
	if (!disableWelcomeMessage) consoleMessage(ns,
		`[INFO]For additional settings please nano ${ns.getScriptName()}.` +
		`\r\n` + `	You can disable this message in the settings at the top` +
		`\r\n` + `	via disableWelcomeMessage = true;` +
		`\r\n` + `	You can enable automatically finding the best start` +
		`\r\n` + `	via useAutoFindBest = true;` +
		`\r\n` + `	You can enable automatically gaining root access on new servers` +
		`\r\n` + `	via useAutoHack = true;`
	);

	consoleMessage(ns, `[INFO]${ns.getScriptName()} starting up in ${lastMode} mode.`);
	consoleMessage(ns, `[INFO]AutoFindBest: ${useAutoHack} | AutoHack: ${useAutoHack}`);

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
				consoleMessage(ns, `[INFO]New Target: ${lastTarget}`);
			}
		} else {
			if (!useUserTarget) {
				if (userHackingLevel(ns) <= 9) {
					svTarget = "n00dles";
				} else if (userHackingLevel(ns) >= 10 && userHackingLevel(ns) < 30 && srvCheckRootAccess(ns, "joesguns")) {
					svTarget = "joesguns";
				} else if (userHackingLevel(ns) >= 30 && userHackingLevel(ns) < 40 && srvCheckRootAccess(ns, "hong-fang-tea")) {
					svTarget = "hong-fang-tea";
				} else if (userHackingLevel(ns) >= 40 && userHackingLevel(ns) < 100 && srvCheckRootAccess(ns, "harakiri-sushi")) {
					svTarget = "harakiri-sushi";
				} else if (userHackingLevel(ns) >= 100 && srvCheckRootAccess(ns, "iron-gym")) {
					svTarget = "iron-gym";
				}
				if (svTarget != lastTarget) {
					lastTarget = svTarget;
					consoleMessage(ns, `[INFO]New Target: ${svTarget}`);
				}
			}
		}
		outputDeployment(ns, svTarget, lastMode);

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

			if (ns.scriptRunning(scriptWHG[1], "home")) {
				//outputDeployment(ns, svTarget, curMode, ns.getRunningScript(scriptWHG[1], "home", svTarget).onlineRunningTime);
			} else {
				try {
					await batch(ns, batchLoops, svTarget);
				} catch (e) {}
			}
		}

		outputDeployment(ns, svTarget, lastMode);
		await ns.asleep(1);
	}
}