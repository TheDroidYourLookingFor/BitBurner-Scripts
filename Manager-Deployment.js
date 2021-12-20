/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		ns.run("/TheDroid/nmap.js", 1);
		await ns.asleep(50);
		ns.run("/TheDroid/Find.js", 1);
		await ns.asleep(50);
		ns.run("/TheDroid/SetupNewTargets.js", 1);
		await ns.asleep((60 * 10) * 1000);
	}
}