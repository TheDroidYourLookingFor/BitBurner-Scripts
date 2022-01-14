/** @param {NS} ns **/
import {
	userDirectory,
	usrProbeData00,
	lookForBestTarget,
	lookForHackableTargs
} from "/TheDroid/Archive/TheDroid-Core.js";

/** @param {NS} ns **/
export async function main(ns) {
	let usrDir = userDirectory;
	const usrProbeData = usrDir + usrProbeData00;
	await lookForHackableTargs(ns, usrProbeData);
	await ns.sleep(50);
	await lookForBestTarget(ns, usrProbeData);
	await ns.sleep(50);
}