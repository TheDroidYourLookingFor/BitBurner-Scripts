export var userDirectory = new String("/TheDroid/");
export var usrProbeData00 = new String("networkProbeData.txt");
export var usrProbeData01 = new String("broke_Targets.txt");
export var usrProbeData02 = new String("best_target.txt");
export var userDebug = false;

export function debugMessage(ns, message){
	if (userDebug) ns.tprint(`[${localeHHMMSS()}] ` + message)
}
/** @param {NS} ns **/
export function userHackingLevel(ns) {
	return ns.getHackingLevel();
}
/** @param {NS} ns **/
export function srvGetMaxRam(ns, svName) {
	return ns.getServerMaxRam(svName);
}
/** @param {NS} ns **/
export function srvGetNumPortsReq(ns, svName) {
	return ns.getServerNumPortsRequired(svName);
}
/** @param {NS} ns **/
export function srvGetReqHackingLevel(ns, svName) {
	return ns.getServerRequiredHackingLevel(svName);
}
/** @param {NS} ns **/
export function srvGetMinSecurityLevel(ns, svName) {
	return ns.getServerMinSecurityLevel(svName);
}
/** @param {NS} ns **/
export function srvGetGrowth(ns, svName) {
	return ns.getServerGrowth(svName);
}
/** @param {NS} ns **/
export function srvGetMoneyAvailable(ns, svName) {
	return ns.getServerMoneyAvailable(svName);
}
/** @param {NS} ns **/
export function srvGetMaxMoney(ns, svName) {
	return ns.getServerMaxMoney(svName);
}
/** @param {NS} ns **/
export function srvGetHackTime(ns, svName) {
	return ns.getHackTime(svName);
}
/** @param {NS} ns **/
export function srvCheckRootAccess(ns, svName) {
	return ns.hasRootAccess(svName);
}
/** @param {NS} ns **/
export async function attackSrvHack(ns, svName) {
	debugMessage(ns,"Hacking " + svName + " from " + ns.getHostname());
	await ns.hack(svName);
	await ns.sleep(250);
}
/** @param {NS} ns **/
export async function attackSrvGrow(ns, svName) {
	debugMessage(ns,"Growing " + svName + " from " + ns.getHostname());
	await ns.grow(svName);
	await ns.sleep(250);
}
/** @param {NS} ns **/
export async function attackSrvWeaken(ns, svName) {
	debugMessage(ns,"Weakening " + svName + " from " + ns.getHostname());
	await ns.weaken(svName);
	await ns.sleep(250);
}
/** @param {NS} ns **/
export async function srvKillAll(ns, svName) {
	ns.killall(svName);
	await ns.asleep(250);
}
/** @param {NS} ns **/
export async function srvSCPFiles(ns, svName, svScriptName) {
	await ns.scp(svScriptName, "home", svName);
	await ns.asleep(250);
}
/** @param {NS} ns **/
export async function uploadToHost(ns, svHost, hackScripts) {
	debugMessage(ns,"Killing all processes on " + svHost);
	await srvKillAll(ns, svHost);
	debugMessage(ns,"Copying hackscripts to " + svHost);
	await srvSCPFiles(ns, svHost, hackScripts)
}
/** @param {NS} ns **/
export async function bestTarget(ns) {
	const usrDirectory = userDirectory;
	const bestTarget = await ns.read(usrDirectory + usrProbeData02).split(",");
	const targName = bestTarget[0];
	return targName;
}
/** @param {NS} ns **/
export async function outputStats(ns, svName, svBest) {
	var svRAM = srvGetMaxRam(ns, svName);
	var svPorts = srvGetNumPortsReq(ns, svName);
	var svReqHack = srvGetReqHackingLevel(ns, svName);
	var svMinSec = srvGetMinSecurityLevel(ns, svName);
	var svGrowth = srvGetGrowth(ns, svName);
	var svCurMoney = srvGetMoneyAvailable(ns, svName);
	var svMaxMoney = srvGetMaxMoney(ns, svName);
	var svExecTime = srvGetHackTime(ns, svName);
	var svScore = nFormatter(((svMaxMoney * 100 / svGrowth) / svExecTime), 4);
	var svScore00 = nFormatter(Math.round((100 - svMinSec) * svMaxMoney * svGrowth / svExecTime), 2);
	var svScore01 = ns.nFormat(((svMaxMoney / svGrowth) / svExecTime), '0.0000');
	var max_length = 30;
	var border_max_length = 45;
	var outputBlank = "\r\n";
	var outputScore = "\r\nScore:"
	var outputScore00 = "\r\nScore00:"
	var outputScore01 = "\r\nScore01:"
	var outputHost = "\r\nHost:"
	var outputMaxRam = "\r\nMax Ram:"
	var outputPorts = "\r\nPorts:"
	var outputHackTime = "\r\nHack Time:"
	var outputReqHacking = "\r\nRequired Hacking:"
	var outputMinSec = "\r\nMin Security:"
	var outputSrvGrowth = "\r\nServer Growth:"
	var outputSrvMoney = "\r\nServer Money:"
	var outputSrvMaxMoney = "\r\nServer Max Money:"
	var outputSrvBest = "\r\nBest Target:"
	ns.tprint(""
		+ outputBlank + '-'.repeat(border_max_length - outputBlank.length)
		+ outputScore + ' '.repeat(max_length - outputScore.length) + svScore
		+ outputScore00 + ' '.repeat(max_length - outputScore00.length) + svScore00
		+ outputScore01 + ' '.repeat(max_length - outputScore01.length) + svScore01
		+ outputHost + ' '.repeat(max_length - outputHost.length) + svName
		+ outputMaxRam + ' '.repeat(max_length - outputMaxRam.length) + svRAM + "GB"
		+ outputPorts + ' '.repeat(max_length - outputPorts.length) + svPorts
		+ outputHackTime + ' '.repeat(max_length - outputHackTime.length) + ns.nFormat(svExecTime, '0.00')
		+ outputReqHacking + ' '.repeat(max_length - outputReqHacking.length) + svReqHack
		+ outputMinSec + ' '.repeat(max_length - outputMinSec.length) + svMinSec
		+ outputSrvGrowth + ' '.repeat(max_length - outputSrvGrowth.length) + svGrowth
		+ outputSrvMoney + ' '.repeat(max_length - outputSrvMoney.length) + ns.nFormat(svCurMoney, '$0,0.00')
		+ outputSrvMaxMoney + ' '.repeat(max_length - outputSrvMaxMoney.length) + ns.nFormat(svMaxMoney, '$0,0.00')
		+ outputSrvBest + ' '.repeat(max_length - outputSrvBest.length) + svBest
		+ outputBlank + '-'.repeat(border_max_length - outputBlank.length));
}

/** @param {NS} ns **/
export async function pollServer(ns, svName) {
	var svRAM = srvGetMaxRam(ns, svName);
	var svPorts = srvGetNumPortsReq(ns, svName);
	var svReqHack = srvGetReqHackingLevel(ns, svName);
	var svMinSec = srvGetMinSecurityLevel(ns, svName);
	var svGrowth = srvGetGrowth(ns, svName);
	var svCurMoney = srvGetMoneyAvailable(ns, svName);
	var svMaxMoney = srvGetMaxMoney(ns, svName);
	var svExecTime = srvGetHackTime(ns, svName);
	var svScore = nFormatter(((svMaxMoney * 100 / svGrowth) / svExecTime), 4);
	var svScore00 = nFormatter(Math.round((100 - svMinSec) * svMaxMoney * svGrowth / svExecTime), 2);
	var svScore01 = ns.nFormat(((svMaxMoney / svGrowth) / svExecTime), '0.0000');
	var max_length = 30;
	var border_max_length = 45;
	var outputBlank = "\r\n";
	var outputScore = "\r\nScore:"
	var outputScore00 = "\r\nScore00:"
	var outputScore01 = "\r\nScore01:"
	var outputHost = "\r\nHost:"
	var outputMaxRam = "\r\nMax Ram:"
	var outputPorts = "\r\nPorts:"
	var outputHackTime = "\r\nHack Time:"
	var outputReqHacking = "\r\nRequired Hacking:"
	var outputMinSec = "\r\nMin Security:"
	var outputSrvGrowth = "\r\nServer Growth:"
	var outputSrvMoney = "\r\nServer Money:"
	var outputSrvMaxMoney = "\r\nServer Max Money:"
	ns.tprint("Polling server " + svName);
	ns.tprint(""
		+ outputBlank + '-'.repeat(border_max_length - outputBlank.length)
		+ outputScore + ' '.repeat(max_length - outputScore.length) + svScore
		+ outputScore00 + ' '.repeat(max_length - outputScore00.length) + svScore00
		+ outputScore01 + ' '.repeat(max_length - outputScore01.length) + svScore01
		+ outputHost + ' '.repeat(max_length - outputHost.length) + svName
		+ outputMaxRam + ' '.repeat(max_length - outputMaxRam.length) + svRAM + "GB"
		+ outputPorts + ' '.repeat(max_length - outputPorts.length) + svPorts
		+ outputHackTime + ' '.repeat(max_length - outputHackTime.length) + ns.nFormat(svExecTime, '0.00')
		+ outputReqHacking + ' '.repeat(max_length - outputReqHacking.length) + svReqHack
		+ outputMinSec + ' '.repeat(max_length - outputMinSec.length) + svMinSec
		+ outputSrvGrowth + ' '.repeat(max_length - outputSrvGrowth.length) + svGrowth
		+ outputSrvMoney + ' '.repeat(max_length - outputSrvMoney.length) + ns.nFormat(svCurMoney, '$0,0.00')
		+ outputSrvMaxMoney + ' '.repeat(max_length - outputSrvMaxMoney.length) + ns.nFormat(svMaxMoney, '$0,0.00')
		+ outputBlank + '-'.repeat(border_max_length - outputBlank.length));
}

/** @param {NS} ns **/
export function nFormatter(num, digits) {
	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "k" },
		{ value: 1e6, symbol: "m" },
		{ value: 1e9, symbol: "b" },
		{ value: 1e12, symbol: "t" },
		{ value: 1e15, symbol: "p" },
		{ value: 1e18, symbol: "e" }
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var item = lookup.slice().reverse().find(function (item) {
		return num >= item.value;
	});
	return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

/** @param {NS} ns **/
export function autocomplete(data, args) {
	return [...data.servers];
}

/** @param {NS} ns **/
export async function lookForHackableTargs(ns, fileName) {
	var rows = await ns.read(fileName).split("\r\n");
	for (var i = 0; i < rows.length; ++i) {
		var serverData = rows[i].split(',');
		if (serverData.length < 9) break;
		var svName = serverData[0];
		var svRam = serverData[1];
		var svPortsNeeded = serverData[2];
		var svMinSec = serverData[3];
		var svReqHack = serverData[4];
		var svExecTime = serverData[5];
		var svCurMoney = serverData[6];
		var svMaxMoney = serverData[7];
		var svGrowth = serverData[8];
		var svScore;

		if (!srvCheckRootAccess(ns, svName)) srvFullHack(ns, svName, svPortsNeeded, svReqHack);
	}
}
/** @param {NS} ns **/
export async function lookForBestTarget(ns, fileName) {
	const usrDirectory = userDirectory;
	let usrProbeData = usrDirectory + "best_target.txt";
	debugMessage(ns,"Reading: " + fileName);
	var bestTargetIndex = 15;
	var bestTargetScore = 0;

	var rows = await ns.read(fileName).split("\r\n");
	for (var i = 0; i < rows.length; ++i) {
		var serverData = rows[i].split(',');
		if (serverData.length < 9) break;
		var svName = serverData[0];
		var svRam = serverData[1];
		var svPortsNeeded = serverData[2];
		var svMinSec = serverData[3];
		var svReqHack = serverData[4];
		var svExecTime = serverData[5];
		var svCurMoney = serverData[6];
		var svMaxMoney = serverData[7];
		var svGrowth = serverData[8];
		var svScore;

		if (srvCheckRootAccess(ns, svName) && (userHackingLevel(ns) >= svReqHack)) {
			if (svCurMoney < 50000 || svMaxMoney == 0) {
				// They have no money to hack
			} else {
				svScore = Math.round((100 - svMinSec) * svMaxMoney * svGrowth / svExecTime);
				//svScore = ((svMaxMoney * 100 / svGrowth) / svExecTime);
				if (svScore > bestTargetScore) {
					debugMessage(ns,"New High Score: " + bestTargetScore);
					bestTargetScore = svScore;
					bestTargetIndex = i;
				}
			}
		}
	}
	await ns.write(usrProbeData, rows[bestTargetIndex], "w");
	if (userDebug) await outputStats(ns, svName, rows[bestTargetIndex]);
	await ns.sleep(250);
}

/** @param {NS} ns **/
export async function userConfig(ns) {
	const usrDirectory = userDirectory;
	if (userDebug) ns.tail(usrDirectory + "Configstuff.js", "home");
	/** @param {NS} ns **/
	async function loadConfig(ns) {
		if (!ns.fileExists(usrDirectory + "userConfig.txt")) {
			await ns.write(usrDirectory + "userConfig.txt",
				+ "," + "Version"
				+ "," + "1.00"
				+ "," + "outputDir"
				+ "," + usrDirectory
				+ "," + "autoManageHacking"
				+ "," + "true"
				+ "," + "autoManageHackNet"
				+ "," + "false"
				+ "," + "autoManageHackNetNodes"
				+ "," + "8"
				+ "," + "autoManageStock"
				+ "," + "true"
				+ "," + "autoManageServers"
				+ "," + "false"
				+ "," + "autoManageServersRam"
				+ "," + "8"
				+ "," + "autoManageHomeSrv"
				+ "," + "true"
				+ "," + "useDebug"
				+ "," + "false"
				+ "\r\n");
		} else {
			var userConfig = await ns.read(usrDirectory + "userConfig.txt").split("\r\n");
			for (var i = 0; i < userConfig.length; ++i) {
				var userData = userConfig[i].split(',');
				if (userData.length < 19) break;
				var curVersion = userData[1];
				var outputDir = userData[3];
				var autoManageHacking = userData[5];
				var autoManageHackNet = userData[7];
				var autoManageHackNetNodes = userData[9];
				var autoManageStock = userData[11];
				var autoManageServers = userData[13];
				var autoManageServersRam = userData[15];
				var autoManageHomeSrv = userData[17];
				var usrUseDebug = userData[19];

				usrDirectory = outputDir;
			}
		}
	}
	loadConfig(ns);
}

/** @param {NS} ns **/
export function srvFullHack(ns, svName, svPortsNeeded, svReqHack) {
	debugMessage(ns,"Attempting to hack target: " + svName);
	var numBusters = 0;
	var portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
	for (var i = 0; i < portBusters.length; i++) {
		if (ns.fileExists(portBusters[i], "home")) ++numBusters;
	}

	if (!(srvCheckRootAccess(ns, svName)) && (numBusters >= svPortsNeeded) && (userHackingLevel(ns) >= svReqHack)) {
		debugMessage(ns,"Attempting to BruteSSH target: " + svName);
		if (numBusters > 0) ns.brutessh(svName);
		debugMessage(ns,"Attempting to FTPCrack target: " + svName);
		if (numBusters > 1) ns.ftpcrack(svName);
		debugMessage(ns,"Attempting to RelaySMTP target: " + svName);
		if (numBusters > 2) ns.relaysmtp(svName);
		debugMessage(ns,"Attempting to HTTPWorm target: " + svName);
		if (numBusters > 3) ns.httpworm(svName);
		debugMessage(ns,"Attempting to SQLInject target: " + svName);
		if (numBusters > 4) ns.sqlinject(svName);
		ns.nuke(svName);
		//ns.installBackdoor();
		debugMessage(ns,"Server hacked: " + svName);
	} else {
		if (numBusters < svPortsNeeded && userDebug)
			ns.tprint("We do not have enough port busters."
				+ "\r\nRequired: " + svReqHack
				+ "\r\nCurrent: " + numBusters
			);
	}
}

/** @param {NS} ns **/
export async function beginNetworkAttack(ns, checkRunning, fileName, tName) {
	const usrDirectory = userDirectory;
	const hackScripts = [usrDirectory + "weaken.js", usrDirectory + "hack.js", usrDirectory + "grow.js", usrDirectory + "aio.js", usrDirectory + "TheDroid-Core.js"];
	var hack_mem = ns.getScriptRam(usrDirectory + "weaken.js", "home");
	var aio_mem = ns.getScriptRam(usrDirectory + "aio.js", "home");
	debugMessage(ns,"Hack Memory: " + hack_mem);
	debugMessage(ns,"AIO Memory: " + aio_mem);

	var weakenThreadWeight = 40;
	var hackThreadWeight = 20;
	var growThreadWeight = 40;

	var rows = await ns.read(usrDirectory + fileName).split("\r\n");
	for (var i = 0; i < rows.length; ++i) {
		var serverData = rows[i].split(',');
		if (serverData.length < 9) break;
		var svName = serverData[0];
		var svRamAvail = ns.getServerMaxRam(svName);
		var num_threads = Math.floor(svRamAvail / hack_mem);

		if (srvCheckRootAccess(ns, svName) && svName != "home") {
			if (num_threads >= 6) {
				if ((num_threads & 1) != 0) num_threads = num_threads - hack_mem;
				var hack_threads = Math.floor(((hackThreadWeight / 100) * num_threads));
				var grow_threads = Math.floor(((growThreadWeight / 100) * num_threads));
				var weaken_threads = Math.floor(((weakenThreadWeight / 100) * num_threads));

				if (ns.isRunning(hackScripts[1], svName, tName) && checkRunning) {
					debugMessage(ns,"Hack already running on " + svName);
				} else {
					debugMessage(ns,"Hack Threads: " + hack_threads
						+ "\r\nGrow Threads: " + grow_threads
						+ "\r\nWeaken Threads: " + weaken_threads
					);
					debugMessage(ns,"Beginning multithreaded attack on " + tName + " from " + svName + ".");
					await uploadToHost(ns, svName, hackScripts);
					debugMessage(ns,"Executing " + hackScripts[1] + " with " + hack_threads + " threads on " + tName + " from " + svName);
					ns.exec(hackScripts[1], svName, hack_threads, tName);
					debugMessage(ns,"Executing " + hackScripts[0] + " with " + weaken_threads + " threads on " + tName + " from " + svName);
					ns.exec(hackScripts[0], svName, weaken_threads, tName);
					debugMessage(ns,"Executing " + hackScripts[2] + " with " + grow_threads + " threads on " + tName + " from " + svName);
					ns.exec(hackScripts[2], svName, grow_threads, tName);
					await ns.sleep(250);
				}
			} else {
				if (svRamAvail > aio_mem) {
					num_threads = Math.floor(svRamAvail / aio_mem);
					if (ns.isRunning(hackScripts[3], svName, tName)) {
						debugMessage(ns,"Hack already running on " + svName);
					} else {
						debugMessage(ns,"Beginning low memory attack script on " + tName + " from " + svName);
						await uploadToHost(ns, svName, hackScripts);
						if (num_threads > 0) {
							debugMessage(ns,"Executing " + hackScripts[3] + " with " + num_threads + " threads on " + tName + " from " + svName);
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
export function getItem(key) {
	let item = localStorage.getItem(key)

	return item ? JSON.parse(item) : undefined
}
/** @param {NS} ns **/
export function localeHHMMSS(ms = 0) {
	if (!ms) {
		ms = new Date().getTime()
	}

	return new Date(ms).toLocaleTimeString()
}
/** @param {NS} ns **/
export function convert2DArrayToString(arr) {
	var components = []
	arr.forEach(function (e) {
		var s = e.toString()
		s = ['[', s, ']'].join('')
		components.push(s)
	})
	return components.join(',').replace(/\s/g, '')
}
/** @param {NS} ns **/
export const codingContractTypesMetadata = [
	{
		name: 'Find Largest Prime Factor',
		solver: function (data) {
			var fac = 2
			var n = data
			while (n > (fac - 1) * (fac - 1)) {
				while (n % fac === 0) {
					n = Math.round(n / fac)
				}
				++fac
			}
			return n === 1 ? fac - 1 : n
		},
	},
	{
		name: 'Subarray with Maximum Sum',
		solver: function (data) {
			var nums = data.slice()
			for (var i = 1; i < nums.length; i++) {
				nums[i] = Math.max(nums[i], nums[i] + nums[i - 1])
			}
			return Math.max.apply(Math, nums)
		},
	},
	{
		name: 'Total Ways to Sum',
		solver: function (data) {
			var ways = [1]
			ways.length = data + 1
			ways.fill(0, 1)
			for (var i = 1; i < data; ++i) {
				for (var j = i; j <= data; ++j) {
					ways[j] += ways[j - i]
				}
			}
			return ways[data]
		},
	},
	{
		name: 'Spiralize Matrix',
		solver: function (data, ans) {
			var spiral = []
			var m = data.length
			var n = data[0].length
			var u = 0
			var d = m - 1
			var l = 0
			var r = n - 1
			var k = 0
			while (true) {
				// Up
				for (var col = l; col <= r; col++) {
					spiral[k] = data[u][col]
					++k
				}
				if (++u > d) {
					break
				}
				// Right
				for (var row = u; row <= d; row++) {
					spiral[k] = data[row][r]
					++k
				}
				if (--r < l) {
					break
				}
				// Down
				for (var col = r; col >= l; col--) {
					spiral[k] = data[d][col]
					++k
				}
				if (--d < u) {
					break
				}
				// Left
				for (var row = d; row >= u; row--) {
					spiral[k] = data[row][l]
					++k
				}
				if (++l > r) {
					break
				}
			}

			return spiral
		},
	},
	{
		name: 'Array Jumping Game',
		solver: function (data) {
			var n = data.length
			var i = 0
			for (var reach = 0; i < n && i <= reach; ++i) {
				reach = Math.max(i + data[i], reach)
			}
			var solution = i === n
			return solution ? 1 : 0
		},
	},
	{
		name: 'Merge Overlapping Intervals',
		solver: function (data) {
			var intervals = data.slice()
			intervals.sort(function (a, b) {
				return a[0] - b[0]
			})
			var result = []
			var start = intervals[0][0]
			var end = intervals[0][1]
			for (var _i = 0, intervals_1 = intervals; _i < intervals_1.length; _i++) {
				var interval = intervals_1[_i]
				if (interval[0] <= end) {
					end = Math.max(end, interval[1])
				} else {
					result.push([start, end])
					start = interval[0]
					end = interval[1]
				}
			}
			result.push([start, end])
			var sanitizedResult = convert2DArrayToString(result)
			return sanitizedResult
		},
	},
	{
		name: 'Generate IP Addresses',
		solver: function (data, ans) {
			var ret = []
			for (var a = 1; a <= 3; ++a) {
				for (var b = 1; b <= 3; ++b) {
					for (var c = 1; c <= 3; ++c) {
						for (var d = 1; d <= 3; ++d) {
							if (a + b + c + d === data.length) {
								var A = parseInt(data.substring(0, a), 10)
								var B = parseInt(data.substring(a, a + b), 10)
								var C = parseInt(data.substring(a + b, a + b + c), 10)
								var D = parseInt(data.substring(a + b + c, a + b + c + d), 10)
								if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
									var ip = [A.toString(), '.', B.toString(), '.', C.toString(), '.', D.toString()].join('')
									if (ip.length === data.length + 3) {
										ret.push(ip)
									}
								}
							}
						}
					}
				}
			}
			return ret
		},
	},
	{
		name: 'Algorithmic Stock Trader I',
		solver: function (data) {
			var maxCur = 0
			var maxSoFar = 0
			for (var i = 1; i < data.length; ++i) {
				maxCur = Math.max(0, (maxCur += data[i] - data[i - 1]))
				maxSoFar = Math.max(maxCur, maxSoFar)
			}
			return maxSoFar.toString()
		},
	},
	{
		name: 'Algorithmic Stock Trader II',
		solver: function (data) {
			var profit = 0
			for (var p = 1; p < data.length; ++p) {
				profit += Math.max(data[p] - data[p - 1], 0)
			}
			return profit.toString()
		},
	},
	{
		name: 'Algorithmic Stock Trader III',
		solver: function (data) {
			var hold1 = Number.MIN_SAFE_INTEGER
			var hold2 = Number.MIN_SAFE_INTEGER
			var release1 = 0
			var release2 = 0
			for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
				var price = data_1[_i]
				release2 = Math.max(release2, hold2 + price)
				hold2 = Math.max(hold2, release1 - price)
				release1 = Math.max(release1, hold1 + price)
				hold1 = Math.max(hold1, price * -1)
			}
			return release2.toString()
		},
	},
	{
		name: 'Algorithmic Stock Trader IV',
		solver: function (data) {
			var k = data[0]
			var prices = data[1]
			var len = prices.length
			if (len < 2) {
				return 0
			}
			if (k > len / 2) {
				var res = 0
				for (var i = 1; i < len; ++i) {
					res += Math.max(prices[i] - prices[i - 1], 0)
				}
				return res
			}
			var hold = []
			var rele = []
			hold.length = k + 1
			rele.length = k + 1
			for (var i = 0; i <= k; ++i) {
				hold[i] = Number.MIN_SAFE_INTEGER
				rele[i] = 0
			}
			var cur
			for (var i = 0; i < len; ++i) {
				cur = prices[i]
				for (var j = k; j > 0; --j) {
					rele[j] = Math.max(rele[j], hold[j] + cur)
					hold[j] = Math.max(hold[j], rele[j - 1] - cur)
				}
			}
			return rele[k]
		},
	},
	{
		name: 'Minimum Path Sum in a Triangle',
		solver: function (data) {
			var n = data.length
			var dp = data[n - 1].slice()
			for (var i = n - 2; i > -1; --i) {
				for (var j = 0; j < data[i].length; ++j) {
					dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j]
				}
			}
			return dp[0]
		},
	},
	{
		name: 'Unique Paths in a Grid I',
		solver: function (data) {
			var n = data[0] // Number of rows
			var m = data[1] // Number of columns
			var currentRow = []
			currentRow.length = n
			for (var i = 0; i < n; i++) {
				currentRow[i] = 1
			}
			for (var row = 1; row < m; row++) {
				for (var i = 1; i < n; i++) {
					currentRow[i] += currentRow[i - 1]
				}
			}
			return currentRow[n - 1]
		},
	},
	{
		name: 'Unique Paths in a Grid II',
		solver: function (data) {
			var obstacleGrid = []
			obstacleGrid.length = data.length
			for (var i = 0; i < obstacleGrid.length; ++i) {
				obstacleGrid[i] = data[i].slice()
			}
			for (var i = 0; i < obstacleGrid.length; i++) {
				for (var j = 0; j < obstacleGrid[0].length; j++) {
					if (obstacleGrid[i][j] == 1) {
						obstacleGrid[i][j] = 0
					} else if (i == 0 && j == 0) {
						obstacleGrid[0][0] = 1
					} else {
						obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i - 1][j] : 0) + (j > 0 ? obstacleGrid[i][j - 1] : 0)
					}
				}
			}
			return obstacleGrid[obstacleGrid.length - 1][obstacleGrid[0].length - 1]
		},
	},
	{
		name: 'Sanitize Parentheses in Expression',
		solver: function (data) {
			var left = 0
			var right = 0
			var res = []
			for (var i = 0; i < data.length; ++i) {
				if (data[i] === '(') {
					++left
				} else if (data[i] === ')') {
					left > 0 ? --left : ++right
				}
			}
			function dfs(pair, index, left, right, s, solution, res) {
				if (s.length === index) {
					if (left === 0 && right === 0 && pair === 0) {
						for (var i = 0; i < res.length; i++) {
							if (res[i] === solution) {
								return
							}
						}
						res.push(solution)
					}
					return
				}
				if (s[index] === '(') {
					if (left > 0) {
						dfs(pair, index + 1, left - 1, right, s, solution, res)
					}
					dfs(pair + 1, index + 1, left, right, s, solution + s[index], res)
				} else if (s[index] === ')') {
					if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res)
					if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res)
				} else {
					dfs(pair, index + 1, left, right, s, solution + s[index], res)
				}
			}
			dfs(0, 0, left, right, data, '', res)

			return res
		},
	},
	{
		name: 'Find All Valid Math Expressions',
		solver: function (data) {
			var num = data[0]
			var target = data[1]
			function helper(res, path, num, target, pos, evaluated, multed) {
				if (pos === num.length) {
					if (target === evaluated) {
						res.push(path)
					}
					return
				}
				for (var i = pos; i < num.length; ++i) {
					if (i != pos && num[pos] == '0') {
						break
					}
					var cur = parseInt(num.substring(pos, i + 1))
					if (pos === 0) {
						helper(res, path + cur, num, target, i + 1, cur, cur)
					} else {
						helper(res, path + '+' + cur, num, target, i + 1, evaluated + cur, cur)
						helper(res, path + '-' + cur, num, target, i + 1, evaluated - cur, -cur)
						helper(res, path + '*' + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur)
					}
				}
			}

			if (num == null || num.length === 0) {
				return []
			}
			var result = []
			helper(result, '', num, target, 0, 0, 0)
			return result
		},
	},
]
/** @param {NS} ns **/
export function findAnswer(contract) {
	let answer

	const codingContractSolution = codingContractTypesMetadata.find((codingContractTypeMetadata) => codingContractTypeMetadata.name === contract.type)

	if (codingContractSolution) {
		answer = codingContractSolution.solver(contract.data)
	} else {
		console.error('Unable to find answer for', contract)
	}

	return answer
}
/** @param {NS} ns **/
export async function findContracts(ns, fileName, contractsDb) {
	debugMessage(ns,`Finding contracts`)
	var rows = await ns.read(fileName).split("\r\n");
	for (var i = 0; i < rows.length; ++i) {
		var serverData = rows[i].split(',');
		if (serverData.length < 9) break;
		var svName = serverData[0];
		if (svName == "home" | svName.includes("pServ")) continue;

		const files = ns.ls(svName)
		if (files && files.length) {
			const contracts = files.filter((file) => file.includes('.cct'))
			if (contracts.length) {
				debugMessage(ns,`Server name: ` + svName)
				contracts.forEach((contract) => {
					const contractData = {
						contract,
						svName,
						type: ns.codingcontract.getContractType(contract, svName),
						data: ns.codingcontract.getData(contract, svName),
					}
					contractsDb.push(contractData)
				})
			}
		}
	}
}