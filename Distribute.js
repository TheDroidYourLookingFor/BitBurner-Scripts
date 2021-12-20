/** @param {NS} ns **/
export async function main(ns) {
	/** @param {NS} ns **/
	async function processNmap(ns) {
		ns.tprint("Beginning distribution of scripts to all servers.");
		var hackScripts = ["weaken.js", "hack.js", "grow.js", "aio.js"];
		var hack_mem = ns.getScriptRam("weaken.js", "home");
		var aio_mem = ns.getScriptRam("aio.js", "home");

		var hackThreadWeight = 40;
		var growThreadWeight = 50;
		var weakenThreadWeight = 10;

		var bestTarget = await ns.read("best_target.txt").split(",");
		var tName = bestTarget[0];
		if (!ns.hasRootAccess(bestTarget[0])) {
			ns.tprint("We lack root on the target. Please pick another target.");
			ns.exit();
		}

		var rows = await ns.read("nmap.txt").split("\r\n");
		for (var i = 0; i < rows.length; ++i) {
			var serverData = rows[i].split(',');
			if (serverData.length < 8) break;
			var svName = serverData[0];
			var svRamAvail = ns.getServerMaxRam(svName);
			var num_threads = Math.floor(svRamAvail / hack_mem);

			if (ns.hasRootAccess(svName) && svName != "home") {
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
		ns.tprint("Finished distributing scripts to all servers.");
	}

	await processNmap(ns);
}