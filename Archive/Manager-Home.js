/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	var hackScripts = [usrDirectory + "weaken.js", usrDirectory + "hack.js", usrDirectory + "grow.js", usrDirectory + "aio.js"];
	var localHost = ns.getHostname();
	var weaken_mem = ns.getScriptRam(hackScripts[0], localHost);
	var hack_mem = ns.getScriptRam(hackScripts[1], localHost);
	var grow_mem = ns.getScriptRam(hackScripts[2], localHost);
	// Need to evalute these values later.. best guess for now?
	var weakenThreadWeight = 40;
	var hackThreadWeight = 20;
	var growThreadWeight = 40;
	var bufferRAM = 8;

	while (true) {
		var localMaxRAM = ns.getServerMaxRam(localHost);
		var num_threads = localMaxRAM - bufferRAM;
		var weaken_threads = Math.floor(((weakenThreadWeight / 100) * num_threads) / grow_mem);
		var hack_threads = Math.floor(((hackThreadWeight / 100) * num_threads) / hack_mem);
		var grow_threads = Math.floor(((growThreadWeight / 100) * num_threads) / weaken_mem);

		if (!ns.isRunning(hackScripts[0], localHost, tName)) {
			var bestTarget = ns.read(usrDirectory + "best_target.txt").split(",");
			var tName = bestTarget[0];
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