export var userDirectory = new String("/TheDroid/");
export var userDebug = false;

export const scriptCore = [
	userDirectory + "TheDroid-Core.js"
];
export const scriptWHG = [
	userDirectory + "Target-Weaken.js",
	userDirectory + "Target-Hack.js",
	userDirectory + "Target-Grow.js"
];
export const scriptAll = scriptWHG.concat(scriptCore);

/** @param {import(".").NS } ns */
export function debugMessage(ns, message) {
	const usrDebug = false;
	if (usrDebug) consoleMessage(ns, `[DEBUG] ` + message)
}
/** @param {import(".").NS } ns */
export function consoleMessage(ns, message) {
	ns.tprintf(`[${localeHHMMSS()}]` + message)
}
/** @param {import(".").NS } ns */
export function logMessage(ns, message) {
	ns.print(`[${localeHHMMSS()}]` + message)
}
/** @param {import(".").NS } ns */
export function localeHHMMSS(ms = 0) {
	if (!ms) {
		ms = new Date().getTime(ms = 0)
	}
	return new Date(ms).toLocaleTimeString()
}
export function currentHHMMSS(ms) {
	const addMs = new Date();
	addMs.setMilliseconds(ms);
	return new Date(addMs).toLocaleTimeString()
}
/** @param {import(".").NS } ns */
export function userHackingLevel(ns) {
	return ns.getHackingLevel();
}
/** @param {import(".").NS } ns */
export function srvGetMaxRam(ns, svName) {
	return ns.getServerMaxRam(svName);
}
/** @param {import(".").NS } ns */
export function srvGetNumPortsReq(ns, svName) {
	return ns.getServerNumPortsRequired(svName);
}
/** @param {import(".").NS } ns */
export function srvGetReqHackingLevel(ns, svName) {
	return ns.getServerRequiredHackingLevel(svName);
}
/** @param {import(".").NS } ns */
export function srvGetMinSecurityLevel(ns, svName) {
	return ns.getServerMinSecurityLevel(svName);
}
export function srvGetSecurityLevel(ns, svName) {
	return ns.getServerSecurityLevel(svName);
}
/** @param {import(".").NS } ns */
export function srvGetGrowth(ns, svName) {
	return ns.getServerGrowth(svName);
}
/** @param {import(".").NS } ns */
export function srvGetMoneyAvailable(ns, svName) {
	return ns.getServerMoneyAvailable(svName);
}
/** @param {import(".").NS } ns */
export function srvGetMaxMoney(ns, svName) {
	return ns.getServerMaxMoney(svName);
}
/** @param {import(".").NS } ns */
export function srvGetHackTime(ns, svName) {
	return ns.getHackTime(svName);
}
/** @param {import(".").NS } ns */
export function srvCheckRootAccess(ns, svName) {
	return ns.hasRootAccess(svName);
}
/** @param {import(".").NS } ns */
export function srvCheckBackdoor(ns, svName) {
	return ns.getServer(svName).backdoorInstalled;
}
/** @param {import(".").NS } ns */
export async function attackSrvHack(ns, svName) {
	debugMessage(ns, "Hacking " + svName + " from " + ns.getHostname());
	await ns.hack(svName);
}
/** @param {import(".").NS } ns */
export async function attackSrvGrow(ns, svName) {
	debugMessage(ns, "Growing " + svName + " from " + ns.getHostname());
	await ns.grow(svName);
}
/** @param {import(".").NS } ns */
export async function attackSrvWeaken(ns, svName) {
	debugMessage(ns, "Weakening " + svName + " from " + ns.getHostname());
	await ns.weaken(svName);
}
/** @param {import(".").NS } ns */
export async function srvKillAll(ns, svName) {
	ns.killall(svName);
	await ns.asleep(1);
}
/** @param {import(".").NS } ns */
export async function srvSCPFiles(ns, svName, svScriptName) {
	await ns.scp(svScriptName, "home", svName);
	await ns.asleep(1);
}
/** @param {import(".").NS } ns */
export async function uploadToHost(ns, svHost, hackScripts) {
	debugMessage(ns, "Killing all processes on " + svHost);
	await srvKillAll(ns, svHost);
	debugMessage(ns, "Copying hackscripts to " + svHost);
	await srvSCPFiles(ns, svHost, hackScripts)
}
/** @param {import(".").NS } ns */
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
	ns.tprint("" +
		outputBlank + '-'.repeat(border_max_length - outputBlank.length) +
		outputScore + ' '.repeat(max_length - outputScore.length) + svScore +
		outputScore00 + ' '.repeat(max_length - outputScore00.length) + svScore00 +
		outputScore01 + ' '.repeat(max_length - outputScore01.length) + svScore01 +
		outputHost + ' '.repeat(max_length - outputHost.length) + svName +
		outputMaxRam + ' '.repeat(max_length - outputMaxRam.length) + svRAM + "GB" +
		outputPorts + ' '.repeat(max_length - outputPorts.length) + svPorts +
		outputHackTime + ' '.repeat(max_length - outputHackTime.length) + ns.nFormat(svExecTime, '0.00') +
		outputReqHacking + ' '.repeat(max_length - outputReqHacking.length) + svReqHack +
		outputMinSec + ' '.repeat(max_length - outputMinSec.length) + svMinSec +
		outputSrvGrowth + ' '.repeat(max_length - outputSrvGrowth.length) + svGrowth +
		outputSrvMoney + ' '.repeat(max_length - outputSrvMoney.length) + ns.nFormat(svCurMoney, '$0,0.00') +
		outputSrvMaxMoney + ' '.repeat(max_length - outputSrvMaxMoney.length) + ns.nFormat(svMaxMoney, '$0,0.00') +
		outputBlank + '-'.repeat(border_max_length - outputBlank.length));
}
/** @param {import(".").NS } ns */
export function nFormatter(num, digits) {
	const lookup = [{
			value: 1,
			symbol: ""
		},
		{
			value: 1e3,
			symbol: "k"
		},
		{
			value: 1e6,
			symbol: "m"
		},
		{
			value: 1e9,
			symbol: "b"
		},
		{
			value: 1e12,
			symbol: "t"
		},
		{
			value: 1e15,
			symbol: "p"
		},
		{
			value: 1e18,
			symbol: "e"
		}
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var item = lookup.slice().reverse().find(function (item) {
		return num >= item.value;
	});
	return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}
/** @param {import(".").NS } ns */
export async function lookForHackableTargs(ns, serverList) {
	for (const server of serverList) {
		if (!srvCheckRootAccess(ns, server.hostname)) srvFullHack(ns, server.hostname, server.numOpenPortsRequired, server.requiredHackingSkill);
	}
}
/** @param {import(".").NS } ns */
export async function lookForBackdoorTargs(ns, serverList) {
	for (const server of serverList) {
		if (!srvCheckBackdoor(ns, server.hostname) && srvCheckRootAccess(ns, server.hostname) && !server.hostname.includes("hacknet")) await srvBackdoor(ns, server.hostname);
	}
}
/** @param {import(".").NS } ns */
export async function lookForBestTarget(ns, serverList) {
	var bestTarget;
	var bestTargetScore = 0;

	serverList.forEach(function (server) {
		if (srvCheckRootAccess(ns, server.hostname) && (userHackingLevel(ns) >= server.requiredHackingSkill)) {
			if (server.moneyMax == 0) {
				// They have no money to hack
			} else {
				var svExecTime = srvGetHackTime(ns, server.hostname);
				// let svScore = Math.round((100 - server.minDifficulty) * server.moneyMax * server.serverGrowth / svExecTime);
				let svScore = Math.round((server.moneyMax / server.minDifficulty) * server.serverGrowth / svExecTime);
				//let svScore = Math.round(((server.moneyMax * 100 / server.serverGrowth) / svExecTime));
				//let svScore = Math.round((server.moneyMax / server.minDifficulty) / svExecTime);
				if (svScore > bestTargetScore) {
					if (server.hostname != "n00dles") {
						debugMessage(ns, "New High Score: " + bestTargetScore);
						bestTargetScore = svScore;
						bestTarget = server.hostname;
					} else if (server.hostname == "n00dles" && userHackingLevel(ns) <= 250) {
						debugMessage(ns, "New High Score: " + bestTargetScore);
						bestTargetScore = svScore;
						bestTarget = server.hostname;
					}
				}
			}
		}
	});
	return bestTarget;
}
/** @param {import(".").NS } ns */
export async function srvConnect(ns, svHost) {
	let paths = {
		"home": ""
	};
	let queue = Object.keys(paths);
	let name;
	let output;
	let pathToTarget = [];
	while ((name = queue.shift())) {
		let path = paths[name];
		let scanRes = ns.scan(name);
		for (let newSv of scanRes) {
			if (paths[newSv] === undefined) {
				queue.push(newSv);
				paths[newSv] = `${path},${newSv}`;
				if (newSv == svHost)
					pathToTarget = paths[newSv].substr(1).split(",");

			}
		}
	}
	output = "home; ";

	pathToTarget.forEach(server => output += " connect " + server + ";");

	const terminalInput = globalThis['document'].getElementById("terminal-input");
	terminalInput.value = output;
	const handler = Object.keys(terminalInput)[1];
	terminalInput[handler].onChange({
		target: terminalInput
	});
	terminalInput[handler].onKeyDown({
		keyCode: 13,
		preventDefault: () => null
	});
}
/** @param {import(".").NS } ns */
export async function srvBackdoor(ns, svName) {
	let paths = {
		"home": ""
	};
	let queue = Object.keys(paths);
	let name;
	let pathToTarget = [];
	while ((name = queue.shift())) {
		let path = paths[name];
		let scanRes = ns.scan(name);
		for (let newSv of scanRes) {
			if (paths[newSv] === undefined) {
				queue.push(newSv);
				paths[newSv] = `${path},${newSv}`;
				if (newSv == svName)
					pathToTarget = paths[newSv].substr(1).split(",");

			}
		}
	}
	for (const server of pathToTarget) {
		ns.connect(server);
	}
	consoleMessage(ns, `Backdoor installation started on ${svName}`)
	await ns.installBackdoor();

	// const terminalInput = globalThis['document'].getElementById("terminal-input");
	// terminalInput.value="backdoor";
	// const handler = Object.keys(terminalInput)[1];
	// terminalInput[handler].onChange({target:terminalInput});
	// terminalInput[handler].onKeyDown({keyCode:13,preventDefault:()=>null});

	consoleMessage(ns, `Backdoor installation finished on ${svName}`)
	logMessage(ns, `Backdoor installation finished on ${svName}`)
	await ns.sleep(1);
	ns.connect("home");
}
/** @param {import(".").NS } ns */
export function srvFullHack(ns, svName, svPortsNeeded, svReqHack) {
	debugMessage(ns, "Attempting to hack target: " + svName);
	var numBusters = 0;
	var portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
	for (var i = 0; i < portBusters.length; i++) {
		if (ns.fileExists(portBusters[i], "home")) ++numBusters;
	}

	if (!(srvCheckRootAccess(ns, svName)) && (numBusters >= svPortsNeeded) && (userHackingLevel(ns) >= svReqHack)) {
		debugMessage(ns, "Attempting to BruteSSH target: " + svName);
		if (numBusters > 0) ns.brutessh(svName);
		debugMessage(ns, "Attempting to FTPCrack target: " + svName);
		if (numBusters > 1) ns.ftpcrack(svName);
		debugMessage(ns, "Attempting to RelaySMTP target: " + svName);
		if (numBusters > 2) ns.relaysmtp(svName);
		debugMessage(ns, "Attempting to HTTPWorm target: " + svName);
		if (numBusters > 3) ns.httpworm(svName);
		debugMessage(ns, "Attempting to SQLInject target: " + svName);
		if (numBusters > 4) ns.sqlinject(svName);
		ns.nuke(svName);
		consoleMessage(ns, "Server hacked: " + svName);
	} else {
		if (numBusters < svPortsNeeded)
			debugMessage(ns, "We do not have enough port busters." +
				"\r\nRequired: " + svReqHack +
				"\r\nCurrent: " + numBusters
			);
	}
}
/** @param {import(".").NS } ns */
export async function beginNetworkAttack(ns, checkRunning, fileName, tName) {
	const usrDirectory = userDirectory;
	const hackScripts = [usrDirectory + "weaken.js", usrDirectory + "hack.js", usrDirectory + "grow.js", usrDirectory + "aio.js", usrDirectory + "TheDroid-Core.js"];
	var hack_mem = ns.getScriptRam(usrDirectory + "weaken.js", "home");
	var aio_mem = ns.getScriptRam(usrDirectory + "aio.js", "home");
	debugMessage(ns, "Hack Memory: " + hack_mem);
	debugMessage(ns, "AIO Memory: " + aio_mem);

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
					debugMessage(ns, "Hack already running on " + svName);
				} else {
					debugMessage(ns, "Hack Threads: " + hack_threads +
						"\r\nGrow Threads: " + grow_threads +
						"\r\nWeaken Threads: " + weaken_threads
					);
					debugMessage(ns, "Beginning multithreaded attack on " + tName + " from " + svName + ".");
					await uploadToHost(ns, svName, hackScripts);
					debugMessage(ns, "Executing " + hackScripts[1] + " with " + hack_threads + " threads on " + tName + " from " + svName);
					ns.exec(hackScripts[1], svName, hack_threads, tName, 0);
					debugMessage(ns, "Executing " + hackScripts[0] + " with " + weaken_threads + " threads on " + tName + " from " + svName);
					ns.exec(hackScripts[0], svName, weaken_threads, tName, 0);
					debugMessage(ns, "Executing " + hackScripts[2] + " with " + grow_threads + " threads on " + tName + " from " + svName);
					ns.exec(hackScripts[2], svName, grow_threads, tName, 0);
					await ns.sleep(250);
				}
			} else {
				if (svRamAvail > aio_mem) {
					num_threads = Math.floor(svRamAvail / aio_mem);
					if (ns.isRunning(hackScripts[3], svName, tName)) {
						debugMessage(ns, "Hack already running on " + svName);
					} else {
						debugMessage(ns, "Beginning low memory attack script on " + tName + " from " + svName);
						await uploadToHost(ns, svName, hackScripts);
						if (num_threads > 0) {
							debugMessage(ns, "Executing " + hackScripts[3] + " with " + num_threads + " threads on " + tName + " from " + svName);
							ns.exec(hackScripts[3], svName, num_threads, tName);
						}
					}
				}
			}

		}
		ns.asleep(25);
	}
}
/** @param {import(".").NS } ns */
export function getItem(key) {
	let item = localStorage.getItem(key)

	return item ? JSON.parse(item) : undefined
}
/** @param {import(".").NS } ns */
export function convert2DArrayToString(arr) {
	var components = []
	arr.forEach(function (e) {
		var s = e.toString()
		s = ['[', s, ']'].join('')
		components.push(s)
	})
	return components.join(',').replace(/\s/g, '')
}
/** @param {import(".").NS } ns */
export const codingContractTypesMetadata = [{
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
/** @param {import(".").NS } ns */
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
/** @param {import(".").NS } ns */
export async function findContracts(ns, contractsDb) {
	let serverList = probeNetwork(ns);
	debugMessage(ns, `Finding contracts`)
	for (const svServ of serverList) {
		var svName = svServ.hostname;
		if (svName == "home" | svName.includes("pServ")) continue;

		const files = ns.ls(svName)
		if (files && files.length) {
			const contracts = files.filter((file) => file.includes('.cct'))
			if (contracts.length) {
				debugMessage(ns, `Server name: ` + svName)
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
/** @param {import(".").NS } ns */
export async function deployTarget(ns, svHost, svScript, svScriptCore, tName, maxThreads) {
	var script_mem = ns.getScriptRam(svScript, "home");
	if (svHost.hasAdminRights && svHost.maxRam > script_mem && !ns.isRunning(svScript, svHost.hostname, tName)) {
		let num_threads = Math.floor(svHost.maxRam / script_mem);
		if (num_threads > 0) {
			if (num_threads > maxThreads) num_threads = maxThreads;
			await ns.scp(svScript, "home", svHost.hostname);
			await ns.scp(svScriptCore, "home", svHost.hostname);
			debugMessage(ns, "Executing " + svScript + " with " + num_threads + " threads on " + tName + " from " + svHost.hostname);
			ns.exec(svScript, svHost.hostname, num_threads, tName);
			if (svScript.includes("weaken")) {
				debugMessage(ns, "[WEAKEN]" + svHost.hostname + " began weakening " + tName + " with " + num_threads + " threads.");
			}
			if (svScript.includes("grow")) {
				debugMessage(ns, "[GROW]" + svHost.hostname + " began growing " + tName + " with " + num_threads + " threads.");
			}
			if (svScript.includes("hack")) {
				debugMessage(ns, "[HACK]" + svHost.hostname + " began hacking " + tName + " with " + num_threads + " threads.");
			}
			return num_threads;
		}
	}
	return 0;
}
/** @param {import(".").NS } ns */
export async function networkAttack(ns, checkRunning, tName) {
	let serverList = probeNetwork(ns);
	var hack_mem = ns.getScriptRam(scriptWHG[0]);
	var aio_mem = ns.getScriptRam(scriptAll[3]);
	debugMessage(ns, "Hack Memory: " + hack_mem);
	debugMessage(ns, "AIO Memory: " + aio_mem);

	var weakenThreadWeight = 60;
	var hackThreadWeight = 20;
	var growThreadWeight = 20;

	for (const svHost of serverList) {
		var svName = svHost.hostname;
		var svRamAvail = ns.getServerMaxRam(svName);
		var num_threads = Math.floor(svRamAvail / hack_mem);

		if (srvCheckRootAccess(ns, svName) && svName != "home") {
			if (num_threads >= 10) {
				if ((num_threads & 1) != 0) num_threads = num_threads - hack_mem;
				var hack_threads = Math.floor(((hackThreadWeight / 100) * num_threads));
				var grow_threads = Math.floor(((growThreadWeight / 100) * num_threads));
				var weaken_threads = Math.floor(((weakenThreadWeight / 100) * num_threads) / 2);

				// Cyn's HWGW Delays
				// hackDelay = times.weaken - times.hack - timeDelay*3
				// weak1Delay = 0
				// growDelay = times.weaken - times.grow - timeDelay
				// weak2Delay = timeDelay*2
				// const endTime = performance.now() + (times.weaken - times.hack) - timeB * 4

				if (ns.isRunning(scriptWHG[1], svName, tName) && checkRunning) {
					debugMessage(ns, "Hack already running on " + svName);
				} else {
					debugMessage(ns, "Hack Threads: " + hack_threads +
						"\r\nGrow Threads: " + grow_threads +
						"\r\nWeaken Threads: " + weaken_threads
					);
					debugMessage(ns, "Starting multithreaded attack on " + tName + " from " + svName + ".");
					await uploadToHost(ns, svName, scriptAll);
					debugMessage(ns, "Executing " + scriptAll[1] + " with " + hack_threads + " threads on " + tName + " from " + svName);
					ns.exec(scriptWHG[1], svName, hack_threads, tName, 0);
					debugMessage(ns, "Executing " + scriptWHG[0] + " with " + weaken_threads + " threads on " + tName + " from " + svName);
					ns.exec(scriptWHG[0], svName, weaken_threads, tName, 0);
					debugMessage(ns, "Executing " + scriptWHG[2] + " with " + grow_threads + " threads on " + tName + " from " + svName);
					ns.exec(scriptWHG[2], svName, grow_threads, tName, 0);
					await ns.sleep(250);

					num_threads = Math.floor((ns.getServerMaxRam(svName) - ns.getServerUsedRam(svName)) / ns.getScriptRam(scriptWHG[0]));
					debugMessage(ns, "Executing " + scriptWHG[0] + " with " + weaken_threads + " threads on " + tName + " from " + svName);
					ns.exec(scriptWHG[0], svName, num_threads, tName, 1);
				}
			} else {
				if (svRamAvail > aio_mem) {
					num_threads = Math.floor(svRamAvail / aio_mem);
					if (ns.isRunning(scriptAll[3], svName, tName)) {
						debugMessage(ns, "Hack already running on " + svName);
					} else {
						debugMessage(ns, "Starting low memory attack script on " + tName + " from " + svName);
						await uploadToHost(ns, svName, scriptAll);
						if (num_threads > 0) {
							debugMessage(ns, "Executing " + scriptAll[3] + " with " + num_threads + " threads on " + tName + " from " + svName);
							ns.exec(scriptAll[3], svName, num_threads, tName);
						}
					}
				}
			}

		}
		await ns.asleep(1);
	}
}
/** @param {import(".").NS } ns */
export async function batch(ns, batchSize, svTarget, useHacknetNodes) {
	let curMode = "HWGW";
	let waitTime = 0;
	var svScripts = scriptAll;
	var serverList = probeNetwork(ns);
	serverList.push(ns.getServer("home"));

	consoleMessage(ns, `[INFO]Starting ${curMode} deployment against ${svTarget}.`);
	for (let i = 0; i < batchSize; i++) {
		debugMessage(ns, `[INFO]Started Batch ID: ${i}`);
		var minSecLvl = ns.getServerMinSecurityLevel(svTarget);
		var maxMoney = ns.getServerMaxMoney(svTarget);
		var targetMoneyPercentage = 0.75;
		var securityThresh = minSecLvl;
		var hackValue;
		var hackThreads;

		while (ns.getServerMoneyAvailable(svTarget) < (maxMoney * targetMoneyPercentage) || srvGetSecurityLevel(ns, svTarget) > securityThresh) {
			consoleMessage(ns, `[INFO]Starting ${curMode} preparation on ${svTarget}.`);
			if (ns.getServerMoneyAvailable(svTarget) < (maxMoney * targetMoneyPercentage)) consoleMessage(ns, `[WARN]${svTarget} doesn't have enough money to begin.`);
			if (srvGetSecurityLevel(ns, svTarget) > securityThresh) consoleMessage(ns, `[WARN]${svTarget}'s security is too high to begin.`);
			await ns.sleep(1);
			ns.run("/TheDroid/Manager-Prep.js", 1, svTarget);
			await ns.sleep(1);
			while (ns.scriptRunning("/TheDroid/Manager-Prep.js", "home")) {
				outputDeployment(ns, svTarget, "Prepping");
				await ns.sleep(250);
			}
			await ns.sleep(1);
			consoleMessage(ns, `[INFO]Completed ${curMode} preparation on ${svTarget}.`);
		}

		hackValue = maxMoney * targetMoneyPercentage
		hackThreads = ns.hackAnalyzeThreads(svTarget, Math.floor(hackValue));
		var weakThreads = Math.ceil((minSecLvl + 15 - securityThresh) / 0.05);
		var growRatio = 1 / (1 - targetMoneyPercentage);
		var growThreads = Math.ceil(ns.growthAnalyze(svTarget, growRatio) * 1.5);

		var weakTime = ns.getWeakenTime(svTarget);
		var hackTime = weakTime * 0.25;
		var growTime = weakTime * 0.8;
		var timeDelay = 100;
		var hackDelay = weakTime - hackTime - timeDelay * 3;
		var weak1Delay = 0;
		var growDelay = weakTime - growTime - timeDelay;
		var weak2Delay = timeDelay * 2;
		var randomArg = Math.random();
		var delay = i * (4 * serverList.length * timeDelay);
		debugMessage(ns, "weak1Delay: " + weak1Delay + " weak2Delay: " + weak2Delay + " hackDelay: " + hackDelay + " growDelay: " + growDelay + " delay:" + delay)

		serverList = probeNetwork(ns);
		serverList.push(ns.getServer("home"));
		for (let server of serverList) {
			if (server.hostname.includes("hacknet-node") && !useHacknetNodes) {} else {
				debugMessage(ns, "Server: " + server.hostname + " Weak: " + weakThreads + " Hack: " + hackThreads + " Grow: " + growThreads)
				let wMem = ns.getScriptRam(svScripts[0]);
				let availableThreads = Math.floor(server.maxRam / wMem) / 4;
				if (server.hostname == "home") availableThreads = Math.floor((server.maxRam - server.ramUsed) / wMem) / 4;
				if (availableThreads > 0) {
					debugMessage(ns, `[INFO]${server.hostname} has started HWGW cycle on ${svTarget}.`);
					await ns.scp(svScripts, "home", server.hostname);
					await ns.sleep(1);
					ns.exec(svScripts[1], server.hostname, availableThreads, svTarget, hackDelay + delay, randomArg);
					ns.exec(svScripts[0], server.hostname, availableThreads, svTarget, weak1Delay + delay, randomArg);
					ns.exec(svScripts[2], server.hostname, availableThreads, svTarget, growDelay + delay, randomArg);
					ns.exec(svScripts[0], server.hostname, availableThreads, svTarget, weak2Delay + delay, randomArg);
					delay += timeDelay * 4
				}
			}
		}
		waitTime = weak1Delay + delay;
		await ns.sleep(1);
	}
	consoleMessage(ns, `[INFO]Completed ${curMode} deployment against ${svTarget}.`);
	consoleMessage(ns, `[INFO]${curMode} completes against ${svTarget} at ${currentHHMMSS(waitTime)}.`);
}
/** @param {import(".").NS } ns */
export async function prepareTarget(ns, svHost, svScript, svScriptCore, tName) {
	var script_mem = ns.getScriptRam(svScript, "home");
	if (svHost.hasAdminRights && svHost.maxRam > script_mem && !ns.isRunning(svScript, svHost.hostname, tName)) {
		let num_threads = Math.floor(svHost.maxRam / script_mem);
		if (num_threads > 0) {
			await ns.scp(svScript, "home", svHost.hostname);
			await ns.scp(svScriptCore, "home", svHost.hostname);
			//ns.killall(svHost.hostname);
			debugMessage(ns, "Executing " + svScript + " with " + num_threads + " threads on " + tName + " from " + svHost.hostname);
			ns.exec(svScript, svHost.hostname, num_threads, tName);
			if (svScript.includes("weaken")) {
				var weakTime = msToTime(ns.getWeakenTime(tName));
				debugMessage(ns, "[WEAKEN]" + svHost.hostname + " began weakening " + tName + " with " + num_threads + " threads.");
			}
			if (svScript.includes("grow")) {
				var growTime = msToTime(ns.getGrowTime(tName));
				debugMessage(ns, "[GROW]" + svHost.hostname + " began growing " + tName + " with " + num_threads + " threads.");
			}
			if (svScript.includes("hack")) {
				var hackTime = msToTime(ns.getHackTime(tName));
				debugMessage(ns, "[HACK]" + svHost.hostname + " began hacking " + tName + " with " + num_threads + " threads.");
			}
			return num_threads;
		}
	}
	return 0;
}
/** @param {import(".").NS } ns */
export async function prepareTargets(ns, svList, svScript, svScriptCore, tName) {
	var script_mem = ns.getScriptRam(svScript, "home");
	for (const svHost of svList) {
		if (svHost.hasAdminRights && svHost.maxRam > script_mem && !ns.isRunning(svScript, svHost.hostname, tName)) {
			let num_threads = Math.floor(svHost.maxRam / script_mem);
			if (num_threads > 0) {
				await ns.scp(svScript, "home", svHost.hostname);
				await ns.scp(svScriptCore, "home", svHost.hostname);
				ns.killall(svHost.hostname);
				debugMessage(ns, "Executing " + svScript + " with " + num_threads + " threads on " + tName + " from " + svHost.hostname);
				ns.exec(svScript, svHost.hostname, num_threads, tName);
				if (svScript.includes("weaken")) {
					var weakTime = msToTime(ns.getWeakenTime(tName));
					debugMessage(ns, "[WEAKEN]" + svHost.hostname + " execution time " + weakTime + " with " + num_threads + " threads.");
				}
				if (svScript.includes("grow")) {
					var growTime = msToTime(ns.getGrowTime(tName));
					debugMessage(ns, "[GROW]" + svHost.hostname + " execution time " + growTime + " with " + num_threads + " threads.");
				}
				if (svScript.includes("hack")) {
					var hackTime = msToTime(ns.getHackTime(tName));
					debugMessage(ns, "[HACK]" + svHost.hostname + " execution time " + hackTime + " with " + num_threads + " threads.");
				}
			}
		}
	}
}
/** @param {import(".").NS } ns */
export function msToTime(duration) {
	var milliseconds = Math.floor((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
/** @param {import(".").NS } ns */
export function probeNetwork(ns) {
	var serverList = [];
	var servers = ["home"];
	var networkScan;
	var hostname;
	debugMessage(ns, "Beginning network probe.");
	for (var i = 0; i < servers.length; ++i) {
		hostname = servers[i];
		networkScan = ns.scan(hostname);
		for (var j = 0; j < networkScan.length; j++) {
			if (servers.indexOf(networkScan[j]) == -1) {
				servers.push(networkScan[j]);
				debugMessage(ns, "Found host: " + networkScan[j]);
				serverList.push(ns.getServer(networkScan[j]))
			}
		}
	}
	debugMessage(ns, "Network mapped.");
	return serverList;
}
export function outputDeploymentCountdown(ns, curValue, setValue) {
	if (setValue) {
		deploymentCountdown = curValue;
	} else {
		deploymentCountdown -= curValue;
	}
}
export var deploymentCountdown;
/** @param {import(".").NS } ns */
export function countTotalServers(ns) {
	let serverList = probeNetwork(ns);
	serverList.push(ns.getServer("home"));
	let totalServers = 0;
	serverList.forEach(function (server) {
		if (ns.ps(server.hostname).filter(p => p.filename === scriptWHG[0]).length > 0) {
			++totalServers;
		}
	})
	return totalServers;
}
/** @param {import(".").NS } ns */
export function countTotalNetworkScripts(ns) {
	let serverList = probeNetwork(ns);
	serverList.push(ns.getServer("home"));
	let totalScripts = 0;
	serverList.forEach(function (server) {
		scriptWHG.forEach(function (svScript) {
			totalScripts += ns.ps(server.hostname).filter(p => p.filename === svScript).length;
		})
	})
	return totalScripts;
}
/** @param {import(".").NS } ns */
export function countNetworkThreads(serverList, script_mem) {
	var networkThreads = 0;
	serverList.forEach(function (server) {
		if (server.root && server.maxram > 0) {
			let num_threads = Math.floor(server.maxram / script_mem);
			if (num_threads > 0) {
				networkThreads += num_threads;
			}
		}
	})
	return networkThreads;
}
/** @param {import(".").NS } ns */
export async function countTotalScriptThreads(ns, svTarget, svScript) {
	let serverList = probeNetwork(ns);
	let totalThreads = 0;
	serverList.forEach(function (server) {
		try {
			if (ns.getRunningScript(svScript, server.hostname, svTarget).threads > 0) {
				totalThreads += ns.getRunningScript(svScript, server.hostname, svTarget).threads;
			}
		} catch (e) {}
	})
	return totalThreads;
}
/** @param {import(".").NS } ns */
export function countTotalThreads(ns) {
	let serverList = probeNetwork(ns);
	serverList.push(ns.getServer("home"));
	let totalThreads = 0;
	serverList.forEach(function (server) {
		scriptWHG.forEach(function (svScript) {
			let hostScripts = ns.ps(server.hostname).filter(p => p.filename === svScript);
			for (var i = 0; i < hostScripts.length; i++) {
				totalThreads += hostScripts[i].threads;
			}
		})
	})
	return totalThreads;
}

var lastTotalThreadsWeaken = 0;
var lastTotalThreadsGrow = 0;
var lastTotalThreadsHack = 0;
/** @param {import(".").NS } ns */
export function displayTotalThreads(ns) {
	var serverList = probeNetwork(ns);
	var totalThreadsWeaken = 0;
	var totalThreadsGrow = 0;
	var totalThreadsHack = 0;
	var totalServersWeaken = 0;
	var totalServersGrow = 0;
	var totalServersHack = 0;

	serverList.forEach(function (server) {
		scriptWHG.forEach(function (svScript) {
			try {
				if (ns.scriptRunning(svScript, server.hostname)) {
					if (svScript.includes("weaken")) {
						totalThreadsWeaken += ns.scriptRunning(svScript, server.hostname).threads;
						++totalServersWeaken;
					}
					if (svScript.includes("grow")) {
						totalThreadsGrow += ns.scriptRunning(svScript, server.hostname).threads;
						++totalServersGrow;
					}
					if (svScript.includes("hack")) {
						totalThreadsHack += ns.scriptRunning(svScript, server.hostname).threads;
						++totalServersHack;
					}
				}
			} catch (e) {}
		})
	})
	if (totalThreadsWeaken > 0 && totalThreadsWeaken != lastTotalThreadsWeaken) {
		lastTotalThreadsWeaken = totalThreadsWeaken;
		consoleMessage(ns, "[WEAKEN]" + "Weakening with " + totalThreadsWeaken + " total threads from " + totalServersWeaken + " servers.");
	}
	if (totalThreadsGrow > 0 && totalThreadsGrow != lastTotalThreadsGrow) {
		lastTotalThreadsGrow = totalThreadsGrow;
		consoleMessage(ns, "[GROW]" + "Growing with " + totalThreadsGrow + " total threads from " + totalServersGrow + " servers.");
	}
	if (totalThreadsHack > 0 && totalThreadsHack != lastTotalThreadsHack) {
		lastTotalThreadsHack = totalThreadsHack;
		consoleMessage(ns, "[HACK]" + "Attacking with " + totalThreadsHack + " total threads from " + totalServersHack + " servers.");
	}
}
/** @param {import(".").NS } ns */
export function checkRunningTime(ns, svTarget, curMode) {
	let rTime = 0;
	try {
		// if (curMode == "HWGW") return ns.getRunningScript("/TheDroid/Manager-Deployment.js", "home").onlineRunningTime;
		
		let hostScripts = ns.ps("home").filter(p => p.filename === scriptWHG[0]);
		if (curMode == "HWGW") return ns.getRunningScript(scriptWHG[0], "home", hostScripts[0].args[0], hostScripts[0].args[1], hostScripts[0].args[2]).onlineRunningTime;
		if (curMode == "Prepping") return ns.getRunningScript("/TheDroid/Manager-Prep.js", "home", svTarget).onlineRunningTime;
		scriptWHG.forEach(function (svScript) {
			try {
				if (ns.getRunningScript(svScript, "home")) {
					rTime = ns.getRunningScript(svScript, "home", svTarget).onlineRunningTime;
					if (svScript.includes("Weaken")) deploymentCountdown = ns.getWeakenTime(svTarget);
					if (svScript.includes("Grow")) deploymentCountdown = ns.getGrowTime(svTarget);
					if (svScript.includes("Hack")) deploymentCountdown = ns.getHackTime(svTarget);
					return rTime;
				}
			} catch (e) {}
		})
	} catch (e) {}
	return rTime;
}
/** @param {import(".").NS } ns */
export function outputDeployment(ns, svTarget, lastMode) {
	let money = srvGetMoneyAvailable(ns, svTarget);
	if (money === 0) money = 1;
	const maxMoney = srvGetMaxMoney(ns, svTarget);
	const minSec = srvGetMinSecurityLevel(ns, svTarget);
	const sec = ns.getServerSecurityLevel(svTarget);
	ns.clearLog(svTarget);
	var svReqHack = ns.getServerRequiredHackingLevel(svTarget);
	var svSec = ns.getServerSecurityLevel(svTarget);
	var svMinSec = ns.getServerMinSecurityLevel(svTarget);
	var svGrowth = ns.getServerGrowth(svTarget);
	var svCurMoney = ns.getServerMoneyAvailable(svTarget);
	var svMaxMoney = ns.getServerMaxMoney(svTarget);
	var max_length = 19;
	var border_max_length = 53;
	var outputTheDruid = `TheDroid Deployment`;
	var outputCountdown = "\r\nRun Time:"
	var outputTotalThreads = "\r\nTotal Threads:"
	var outputTotalNetworkScripts = "\r\nRunning Scripts:"
	var outputTotalServers = "\r\nTotal Servers:"
	var outputBlank = "\r\n";
	var outputHost = "\r\nHost:"
	var outputMode = "\r\nMode:"
	var outputReqHacking = "\r\nReq Hacking:"
	var outputSec = "\r\nSecurity:"
	var outputSecurity = "\r\nSecurity Var:"
	var outputMinSec = "\r\nSecurity Min:"
	var outputSrvGrowth = "\r\nGrowth:"
	var outputSrvMoney = "\r\nMoney:"
	var outputSrvMaxMoney = "\r\nMax Money:"
	var outputHack = "\r\nHack:"
	var outputGrow = "\r\nGrow:"
	var outputWeaken = "\r\nWeaken:"
	var outputRunning;
	if (lastMode == "WHG" | lastMode == "HWGW") {
		outputRunning = msToTime(checkRunningTime(ns, "home", "HWGW") * 1000);
	} else if (lastMode == "Prepping") {
		outputRunning = msToTime(checkRunningTime(ns, svTarget, "Prepping") * 1000);
	} else {
		outputRunning = msToTime(checkRunningTime(ns, svTarget) * 1000) + " / " + msToTime(ns.getWeakenTime(svTarget));
	}
	ns.print("" +
		outputBlank + '-'.repeat(border_max_length - outputBlank.length) +
		outputBlank +
		' '.repeat(15) + outputTheDruid +
		outputBlank + '-'.repeat(border_max_length - outputBlank.length) +
		outputMode + ' '.repeat(max_length - outputMode.length) + lastMode +
		outputCountdown + ' '.repeat(max_length - outputCountdown.length) + outputRunning +
		outputTotalServers + ' '.repeat(max_length - outputTotalServers.length) + countTotalServers(ns) +
		outputTotalNetworkScripts + ' '.repeat(max_length - outputTotalNetworkScripts.length) + countTotalNetworkScripts(ns) +
		outputTotalThreads + ' '.repeat(max_length - outputTotalThreads.length) + countTotalThreads(ns) +
		outputHack + ' '.repeat(max_length - outputHack.length) + `${ns.tFormat(ns.getHackTime(svTarget))} (t=${Math.ceil(ns.hackAnalyzeThreads(svTarget, money))})` +
		outputGrow + ' '.repeat(max_length - outputGrow.length) + `${ns.tFormat(ns.getGrowTime(svTarget))} (t=${Math.ceil(ns.growthAnalyze(svTarget, maxMoney / money))})` +
		outputWeaken + ' '.repeat(max_length - outputWeaken.length) + `${ns.tFormat(ns.getWeakenTime(svTarget))} (t=${Math.ceil((sec - minSec) * 20)})` +
		outputBlank + '-'.repeat(border_max_length - outputBlank.length) +
		outputHost + ' '.repeat(max_length - outputHost.length) + svTarget +
		outputReqHacking + ' '.repeat(max_length - outputReqHacking.length) + svReqHack +
		outputSec + ' '.repeat(max_length - outputSec.length) + svSec +
		outputSecurity + ' '.repeat(max_length - outputSecurity.length) + `+${(sec - minSec).toFixed(2)}` +
		outputMinSec + ' '.repeat(max_length - outputMinSec.length) + svMinSec +
		outputSrvGrowth + ' '.repeat(max_length - outputSrvGrowth.length) + svGrowth +
		outputSrvMoney + ' '.repeat(max_length - outputSrvMoney.length) + ns.nFormat(svCurMoney, '$0,0.00') +
		outputSrvMaxMoney + ' '.repeat(max_length - outputSrvMaxMoney.length) + ns.nFormat(svMaxMoney, '$0,0.00') +
		outputBlank + '-'.repeat(border_max_length - outputBlank.length));
}