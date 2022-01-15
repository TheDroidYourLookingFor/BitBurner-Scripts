/** @param {import(".").NS } ns */
import {
	consoleMessage,
	debugMessage,
	scriptAll,
	msToTime,
	probeNetwork,
	outputDeployment
} from "/TheDroid/TheDroid-Core.js";
/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.disableLog("ALL");
	var serverList = probeNetwork(ns);
	serverList.push(ns.getServer("home"));

	var svType = ns.args[0];
	var tName = ns.args[1];
	var hostPct = (ns.args[2] / 100);
	var svScript;
	var svScriptMem;
	var curMode;

	switch (svType) {
		case "grow":
			debugMessage(ns, "Running grow Scripts on all servers against " + tName + " for " + msToTime(growTime) + ".");
			svScriptMem = ns.getScriptRam(scriptAll[2]);
			svScript = scriptAll[2];
			break;
		case "hack":
			debugMessage(ns, "Running hack Scripts on all servers against " + tName + " for " + msToTime(hackTime) + ".");
			svScriptMem = ns.getScriptRam(scriptAll[1]);
			svScript = scriptAll[1];
			break;
		case "weaken":
			debugMessage(ns, "Running weaken Scripts on all servers against " + tName + " for " + msToTime(weakTime) + ".");
			svScriptMem = ns.getScriptRam(scriptAll[0]);
			svScript = scriptAll[0];
			break;
		case "kill":
			debugMessage(ns, "Killing all Scripts on all servers.");
			for (const svHost of serverList) {
				if (svHost.hostname != "home") ns.killall(svHost.hostname);
			}
			ns.exit();
			break;
		default:
			consoleMessage(ns, "Options are: grow, hack, weaken, or kill")
	}

	//if (svType != "kill") ns.tail();
	var weakTime = ns.getWeakenTime(tName);
	var hackTime = weakTime * 0.25;
	var growTime = weakTime * 0.8;
	var waitTime;
	var addWaitTime = 250;
	outputDeployment(ns, tName, "none");

	var totalThreads = 0;
	var totalServers = 0;
	for (const svHost of serverList) {
		let availableThreads = (svHost.maxRam * hostPct) / svScriptMem;
		if (availableThreads > 0) {
			//ns.killall(svHost.hostname);
			await ns.sleep(1);
			if (svHost.hostname != "home") try {
				await ns.scp(scriptAll, "home", svHost.hostname);
			} catch (e) {}
			await ns.sleep(1);
			debugMessage(ns, "Executing " + svScript + " with " + availableThreads + " threads on " + tName + " from " + svHost.hostname);
			try {
				ns.exec(svScript, svHost.hostname, availableThreads, tName, 0);
				totalThreads += availableThreads;
				totalServers++;
			} catch (e) {}
			await ns.sleep(1);
		}
	}
	if (svType == "grow") {
		debugMessage(ns, "Executing grow with " + totalThreads + " total threads on " + tName + " from " + totalServers + " total servers for " + msToTime(growTime) + ".");
		waitTime = growTime + addWaitTime;
		curMode = "grow"
	}
	if (svType == "hack") {
		debugMessage(ns, "Executing hack with " + totalThreads + " total threads on " + tName + " from " + totalServers + " total servers for " + msToTime(hackTime) + ".");
		waitTime = hackTime + addWaitTime;
		curMode = "hack"
	}
	if (svType == "weaken") {
		debugMessage(ns, "Executing weaken with " + totalThreads + " total threads on " + tName + " from " + totalServers + " total servers for " + msToTime(weakTime) + ".");
		waitTime = weakTime + addWaitTime;
		curMode = "weaken"
	}

	await ns.sleep(1);

	try {
		while (ns.getRunningScript(svScript, "home", tName).onlineRunningTime > 0) {
			outputDeployment(ns, tName, curMode, ns.getRunningScript(svScript, "home", tName).onlineRunningTime);
			await ns.sleep(250);
		}
	} catch (e) {}
	await ns.sleep(250);
	consoleMessage(ns, "Finished execution with " + totalThreads + " total threads on " + tName + " from " + totalServers + " total servers.");
}