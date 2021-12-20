/** @param {NS} ns **/
export async function main(ns) {
	const usrDirectory = "/TheDroid/";
	/** @param {NS} ns **/
	async function processNmap(ns) {
		ns.tprint("Beginning distribution of scripts to all servers.");
		var hackScripts = [usrDirectory + "weaken.js", usrDirectory + "hack.js", usrDirectory + "grow.js", usrDirectory + "aio.js"];
		var hack_mem = ns.getScriptRam(usrDirectory + "weaken.js", "home");
		var aio_mem = ns.getScriptRam(usrDirectory + "aio.js", "home");

		var weakenThreadWeight = 15;
		var hackThreadWeight = 55;
		var growThreadWeight = 30;

		var bestTarget = await ns.read(usrDirectory + "best_target.txt").split(",");
		var tName = bestTarget[0];

		var rows = await ns.read(usrDirectory + "networkProbeData.txt").split("\r\n");
		for (var i = 0; i < rows.length; ++i) {
			var serverData = rows[i].split(',');
			if (serverData.length < 9) break;
			var svName = serverData[0];
			var svRamAvail = ns.getServerMaxRam(svName);
			var num_threads = Math.floor(svRamAvail / hack_mem);

			if (ns.hasRootAccess(svName) && svName != "home") {
				if (ns.isRunning(usrDirectory + "hack.js", svName, tName) || ns.isRunning(usrDirectory + "aio.js", svName, tName)) {
					// skip host for now
				} else {
					await ns.scp(hackScripts, "home", svName);
					ns.killall(svName);
					if (num_threads >= 6) {
						if ((num_threads & 1) != 0) num_threads = num_threads - hack_mem;
						var hack_threads = ((hackThreadWeight / 100) * num_threads);
						var grow_threads = ((growThreadWeight / 100) * num_threads);
						var weaken_threads = ((weakenThreadWeight / 100) * num_threads);

						ns.exec(hackScripts[1], svName, hack_threads, tName);
						ns.exec(hackScripts[0], svName, weaken_threads, tName);
						ns.exec(hackScripts[2], svName, grow_threads, tName);
					} else {
						num_threads = Math.floor(svRamAvail / aio_mem);
						if (num_threads > 0) {
							ns.exec(hackScripts[3], svName, num_threads, tName);
						} else {
							ns.exec(hackScripts[3], svName, 1, tName);
						}
					}
				}
			}
		}
		ns.tprint("Finished distributing scripts to all servers.");
	}

	await processNmap(ns);
}