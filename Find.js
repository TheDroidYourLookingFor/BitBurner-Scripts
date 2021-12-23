/** @param {NS} ns **/
import {
	userDirectory,
	lookForBestTarget,
	lookForHackableTargs
} from "/TheDroid/TheDroid-Core.js";

/** @param {NS} ns **/
export async function main(ns) {
	let usrDir = userDirectory;
	const usrProbeData2 = usrDir + "networkProbeData.txt";
	const usrProbeData3 = usrDir + "broke_Targets.txt";
	// Do things
	await lookForHackableTargs(ns, usrProbeData2);
	await ns.sleep(50);
	await lookForBestTarget(ns, usrProbeData3);
	await ns.sleep(50);
	await lookForBestTarget(ns, usrProbeData2);
	await ns.sleep(50);
}