/** @param {NS} ns **/
import {
	userDebug,
	userDirectory,
	beginNetworkAttack,
	usrProbeData00,
	usrProbeData01,
	usrProbeData02
} from "/TheDroid/TheDroid-Core.js";

/** @param {NS} ns **/
export async function main(ns) {
	const args = ns.flags([['help', false]]);
	if (args.help) {
		ns.tprint("This script will distribute our scripts to any hosts not running them.");
		ns.tprint(`USAGE: run ${ns.getScriptName()}`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()}`);
		return;
	}
	const useDebug = userDebug;
	if (useDebug) ns.tail(ns.getScriptName())
	const usrProbeData = usrProbeData00;
	const usrProbeData2 = usrProbeData01;
	const usrDirectory = userDirectory;
	const bestTarget = await ns.read(usrDirectory + usrProbeData02).split(",");
	const targName = bestTarget[0];

	/** @param {NS} ns **/
	async function processNmap(ns) {
		if (useDebug) ns.tprint("Beginning distribution of scripts to all servers.");
		if (useDebug) ns.tprint("Best Target: " + targName);
		if (useDebug) ns.tprint("Reading " + usrProbeData2);
		await beginNetworkAttack(ns, false, usrProbeData2, targName);
		if (useDebug) ns.tprint("Reading " + usrProbeData);
		await beginNetworkAttack(ns, false, usrProbeData, targName);
		if (useDebug) ns.tprint("Finished distributing scripts to all servers.");
	}

	await processNmap(ns);
}