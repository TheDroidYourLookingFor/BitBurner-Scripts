/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	while (true) {
		ns.run(usrDirectory + "nmap.js", 1);
		await ns.asleep(50);
		ns.run(usrDirectory + "Find.js", 1);
		await ns.asleep(50);
		ns.run(usrDirectory + "SetupNewTargets.js", 1);
		await ns.asleep((60 * 10) * 1000);
	}
}