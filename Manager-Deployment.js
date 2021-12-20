/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		ns.run("nmap.js", 1);
		await ns.asleep(50);
		ns.run("Find.js", 1);
		await ns.asleep(50);
		ns.run("SetupNewTargets.js", 1);
		await ns.asleep((60 * 10) * 1000);
	}
}