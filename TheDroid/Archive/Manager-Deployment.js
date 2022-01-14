/** @param {NS} ns **/
import {
	userDebug,
	userDirectory,
	lookForHackableTargs,
	usrProbeData00,
	usrProbeData01
} from "/TheDroid/Archive/TheDroid-Core.js";
/** @param {NS} ns **/
export async function main(ns) {
	const useNmap = true;
	// auto find best target and make everyone attack no matter what
	const useFind = false;
	// make only servers not running our scripts attack best_target.txt
	const useAutoHack = true;
	const usrDirectory = userDirectory;
	const args = ns.flags([['help', false]]);
	if (args.help) {
		ns.tprint("This script will ensure all of our daemon processes are started.");
		ns.tprint(`USAGE: run ${ns.getScriptName()}`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()}`);
		return;
	}
	const usrMode = 4;
	while (true) {
		if (useNmap) {
			ns.run(usrDirectory + "nmap.js", 1);
			await ns.sleep(10);
		}
		if (useAutoHack) {
			ns.run(usrDirectory + "nmap.js", 1);
			await ns.sleep(10);
			await lookForHackableTargs(ns, usrDirectory + usrProbeData00);
			await ns.sleep(10);
			await lookForHackableTargs(ns, usrDirectory + usrProbeData01);
		}
		if (useFind) {
			ns.run(usrDirectory + "Find.js", 1);
			await ns.sleep(10);
		}
		switch (usrMode) {
			default:
				ns.run(usrDirectory + "SetupNewTargets.js", 1);
				await ns.sleep(10);
				break;
			case 1:
				//Manager-Grow.js DeployToAll ReserveMemory
				ns.run(usrDirectory + "Manager-Grow.js", 1, false, false);
				await ns.sleep(10);
				break;
			case 2:
				ns.run(usrDirectory + "Manager-Hack.js", 1, false, false);
				await ns.sleep(10);
				break;
			case 3:
				ns.run(usrDirectory + "Manager-Weaken.js", 1, false, false);
				await ns.sleep(10);
				break;
			case 4:
				ns.run(usrDirectory + "SetupNewTargets.js", 1);
				await ns.sleep(10);
				break;
		}
		await ns.asleep(250);
	}
}