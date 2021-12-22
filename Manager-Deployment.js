/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	const usrMode = 4;
	while (true) {
		ns.run(usrDirectory + "nmap.js", 1);
		await ns.asleep(50);
		ns.run(usrDirectory + "Find.js", 1);
		await ns.asleep(50);
		switch (usrMode) {
			default:
				ns.run(usrDirectory + "SetupNewTargets.js", 1);
				await ns.asleep(50);
			case 1:
				//Manager-Grow.js DeployToAll ReserveMemory
				ns.run(usrDirectory + "Manager-Grow.js", 1, false, false);
				await ns.asleep(50);
				break;
			case 2:
				ns.run(usrDirectory + "Manager-Hack.js", 1, false, false);
				await ns.asleep(50);
				break;
			case 3:
				ns.run(usrDirectory + "Manager-Weaken.js", 1, false, false);
				await ns.asleep(50);
				break;
			case 4:
				ns.run(usrDirectory + "SetupNewTargets.js", 1);
				await ns.asleep(50);
				break;
		}
		await ns.asleep(60 * 1000);
	}
}