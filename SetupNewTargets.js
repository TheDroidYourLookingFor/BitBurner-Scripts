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
	const useDebug = false;
	if (useDebug) ns.tail(ns.getScriptName())
	const usrDirectory = "/TheDroid/";
	const usrProbeData = new String("networkProbeData.txt");
	const usrProbeData2 = new String("broke_Targets.txt");
	var hackScripts = [usrDirectory + "weaken.js", usrDirectory + "hack.js", usrDirectory + "grow.js", usrDirectory + "aio.js"];
	var hack_mem = ns.getScriptRam(usrDirectory + "weaken.js", "home");
	var aio_mem = ns.getScriptRam(usrDirectory + "aio.js", "home");

	/** @param {NS} ns **/
	async function uploadToHost(svHost) {
		if (useDebug) ns.tprint("Killing all processes on " + svHost);
		ns.killall(svHost);
		await ns.asleep(25);
		if (useDebug) ns.tprint("Copying hackscripts to " + svHost);
		await ns.scp(hackScripts, "home", svHost);
		await ns.asleep(25);
	}
	/** @param {NS} ns **/
	async function beginNetworkAttack(ns, fileName) {
		if (useDebug) ns.tprint("Hack Memory: " + hack_mem);
		if (useDebug) ns.tprint("AIO Memory: " + aio_mem);

		var weakenThreadWeight = 15;
		var hackThreadWeight = 55;
		var growThreadWeight = 30;

		var bestTarget = await ns.read(usrDirectory + "best_target.txt").split(",");
		var tName = bestTarget[0];
		if (useDebug) ns.tprint("Best Target: " + tName);

		var rows = await ns.read(usrDirectory + fileName).split("\r\n");
		for (var i = 0; i < rows.length; ++i) {
			var serverData = rows[i].split(',');
			if (serverData.length < 9) break;
			var svName = serverData[0];
			var svRamAvail = ns.getServerMaxRam(svName);
			var num_threads = Math.floor(svRamAvail / hack_mem);

			if (ns.hasRootAccess(svName) && svName != "home") {
				if (num_threads >= 6) {
					if (useDebug) ns.tprint("Beginning multithreaded attack on" + tName + " from " + svName);
					if ((num_threads & 1) != 0) num_threads = num_threads - hack_mem;
					var hack_threads = Math.round(((hackThreadWeight / 100) * num_threads));
					var grow_threads = Math.floor(((growThreadWeight / 100) * num_threads));
					var weaken_threads = Math.floor(((weakenThreadWeight / 100) * num_threads));

					if (ns.isRunning(hackScripts[1], svName, tName)) {
						if (useDebug) ns.tprint("Hack already running on " + svName);
					} else {
						await uploadToHost(svName);
						if (useDebug) ns.tprint("Executing " + hackScripts[1] + " with " + hack_threads + " threads on " + tName + " from " + svName);
						ns.exec(hackScripts[1], svName, hack_threads, tName);
						if (useDebug) ns.tprint("Executing " + hackScripts[0] + " with " + weaken_threads + " threads on " + tName + " from " + svName);
						ns.exec(hackScripts[0], svName, weaken_threads, tName);
						if (useDebug) ns.tprint("Executing " + hackScripts[2] + " with " + grow_threads + " threads on " + tName + " from " + svName);
						ns.exec(hackScripts[2], svName, grow_threads, tName);
						await ns.asleep(100);

						svRamAvail = ns.getServerMaxRam(svName);
						var svRamUsed = ns.getServerUsedRam(svName);
						var num_threads = (svRamAvail - svRamUsed) / hack_mem;
						if (num_threads > 0) {
							ns.kill(hackScripts[1], svName, tName);
							if (useDebug) ns.tprint("Executing " + hackScripts[1] + " with " + num_threads + " threads on " + tName + " from " + svName);
							ns.exec(hackScripts[1], svName, (hack_threads + num_threads), tName);
						}
					}
				} else {
					if (svRamAvail > aio_mem) {
						num_threads = Math.floor(svRamAvail / aio_mem);
						if (ns.isRunning(hackScripts[3], svName, tName)) {
							if (useDebug) ns.tprint("Hack already running on " + svName);
						} else {
							if (useDebug) ns.tprint("Beginning low memory attack script on " + tName + " from " + svName);
							await uploadToHost(svName);
							if (num_threads > 0) {
								if (useDebug) ns.tprint("Executing " + hackScripts[3] + " with " + num_threads + " threads on " + tName + " from " + svName);
								ns.exec(hackScripts[3], svName, num_threads, tName);
							}
						}
					}
				}

			}
			ns.asleep(25);
		}
	}
	/** @param {NS} ns **/
	async function processNmap(ns) {

		if (useDebug) ns.tprint("Beginning distribution of scripts to all servers.");
		if (useDebug) ns.tprint("Reading " + usrProbeData2);
		await beginNetworkAttack(ns, usrProbeData2);
		if (useDebug) ns.tprint("Reading " + usrProbeData);
		await beginNetworkAttack(ns, usrProbeData);
		if (useDebug) ns.tprint("Finished distributing scripts to all servers.");
	}

	await processNmap(ns);
}