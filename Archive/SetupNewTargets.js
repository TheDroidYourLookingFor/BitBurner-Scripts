/** @param {NS} ns **/
import {
	userDebug,
	userDirectory,
	beginNetworkAttack,
	debugMessage,
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
		debugMessage(ns,"Beginning distribution of scripts to all servers.");
		debugMessage(ns,"Best Target: " + targName);
		debugMessage(ns,"Reading " + usrProbeData2);
		await beginNetworkAttack(ns, true, usrProbeData2, targName);
		debugMessage(ns,"Reading " + usrProbeData);
		await beginNetworkAttack(ns, true, usrProbeData, targName);
		debugMessage(ns,"Finished distributing scripts to all servers.");
	}

	await processNmap(ns);
}