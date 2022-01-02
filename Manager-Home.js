/** @param {NS} ns **/
import {
	scriptAll,
	consoleMessage,
	debugMessage,
	probeNetwork,
	lookForBestTarget
} from "/TheDroid/TheDroid-Core.js";
/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	var hackScripts = scriptAll;
	var localHost = ns.getHostname();
	var weaken_mem = ns.getScriptRam(hackScripts[0], localHost);
	var hack_mem = ns.getScriptRam(hackScripts[1], localHost);
	var grow_mem = ns.getScriptRam(hackScripts[2], localHost);
	// Need to evalute these values later.. best guess for now?
	var weakenThreadWeight = 60;
	var hackThreadWeight = 20;
	var growThreadWeight = 20;
	var bufferRAM = 64;
	var tName = "n00dles";

	while (true) {
		var localMaxRAM = ns.getServerMaxRam(localHost);
		var num_threads = localMaxRAM - bufferRAM;
		var weaken_threads = Math.floor(((weakenThreadWeight / 100) * num_threads) / grow_mem);
		var hack_threads = Math.floor(((hackThreadWeight / 100) * num_threads) / hack_mem);
		var grow_threads = Math.floor(((growThreadWeight / 100) * num_threads) / weaken_mem);
		var serverList = probeNetwork(ns);
		let lfbTarg = await lookForBestTarget(ns, serverList);
		if (lfbTarg != tName) tName = lfbTarg;

		if (!ns.isRunning(hackScripts[0], localHost, tName)) {
			ns.scriptKill(hackScripts[0], localHost);
			ns.scriptKill(hackScripts[1], localHost);
			ns.scriptKill(hackScripts[2], localHost);
			ns.exec(hackScripts[0], localHost, weaken_threads, tName);
			ns.exec(hackScripts[1], localHost, hack_threads, tName);
			ns.exec(hackScripts[2], localHost, grow_threads, tName);
		}
		await ns.asleep(50);
	}
}