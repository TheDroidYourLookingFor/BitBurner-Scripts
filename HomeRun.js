/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	var hackScripts = [usrDirectory + "weaken.js", usrDirectory + "hack.js", usrDirectory + "grow.js", usrDirectory + "aio.js"];
	var localHost = ns.getHostname();
	var bestTarget = ns.read(usrDirectory + "best_target.txt").split(",");
	var tName = bestTarget[0];

	var localMaxRAM = ns.getServerMaxRam(localHost);
	var bufferRAM = 48;
	var weaken_mem = ns.getScriptRam(hackScripts[0], localHost);
	var hack_mem = ns.getScriptRam(hackScripts[1], localHost);
	var grow_mem = ns.getScriptRam(hackScripts[2], localHost);
	var num_threads = localMaxRAM - bufferRAM;

	// Need to evalute these values later.. best guess for now?
	var weakenThreadWeight = 15;
	var hackThreadWeight = 55;
	var growThreadWeight = 30;

	var weaken_threads = ((weakenThreadWeight / 100) * num_threads) / grow_mem;
	var hack_threads = ((hackThreadWeight / 100) * num_threads) / hack_mem;
	var grow_threads = ((growThreadWeight / 100) * num_threads) / weaken_mem;

	ns.scriptKill(hackScripts[0], localHost);
	ns.scriptKill(hackScripts[1], localHost);
	ns.scriptKill(hackScripts[2], localHost);

	ns.exec(hackScripts[0], localHost, weaken_threads, tName);
	ns.exec(hackScripts[1], localHost, hack_threads, tName);
	ns.exec(hackScripts[2], localHost, grow_threads, tName);
}