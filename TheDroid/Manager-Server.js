/** @param {import(".").NS } ns */
/** @param {import(".").NS } ns */
//  
//  I didn't write this script. Someone was kind enough
//   to share it with me on Discord. I have modified it to
//   my needs. Official Discord is the bee knees.
//

const useDebug = false;
if (useDebug) ns.tail(ns.getScriptName())
const usrDirectory = "/TheDroid/";

const argsSchema = [
    ['useMoneyPercentage', 100], // ( --useMoney n ) how much n% money from players will be used to upgrade/buy a new server.
    ['vpsMaxAmount', 25], // ( --maxAmount n ) buy up to n Servers
    ['vpsPrefix', 'pServ'], // ( --vpsPrefix *any* ) prefix of the servers name
    ['vpsInitialRam', 32], // ( --startAt n ) starting with n GB RAM of purchasing servers
    ['vpsMaxRam', 1048576] // ( -- maxToRam n ) will buy to n GB of ram (i advice about 32TB, because 25 Servers with 4096GB sure cost alot 😂)
]

export function autocomplete(data, args) {
    data.flags(argsSchema);
    return [];
}

const byteFormat = ["GB", "TiB", "PiB"]

function logBaseValue(base, value) {
    return Math.floor(Math.log(value) / Math.log(base))
}

function formatNumber(base, value) {
    return value / Math.pow(base, logBaseValue(base, value))
}

function isZero(index) {
    if (index == 0) {
        return 1
    } else {
        return index
    }
}

function allAtMaxRam(servers, maxRam, ns) {
    let trutharray = []
    if (servers.length == 0) {
        trutharray.push(false)
    }
    for (var srvr of servers) {
        let truth = false
        try {
            truth = (ns.getServerMaxRam(srvr) >= maxRam)
        } catch {
            truth = false
        }
        trutharray.push(truth)
    }
    return trutharray.some(a => a == false)
}

function infDivideByValue(num, value) {
    let numc = JSON.parse(JSON.stringify(num))
    while (numc >= 1) {
        numc /= value
    }
    return numc
}
/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog("ALL")
    ns.enableLog("purchaseServer")
    ns.enableLog("deleteServer")
    let pservers, player, currentRam;
    let option = ns.flags(argsSchema);
    if (infDivideByValue(option.vpsInitialRam, 2) != 0.5) {
        let cache = 0
        for (var i = 1; cache <= option.vpsInitialRam; i++) {
            cache = Math.pow(2, i)
        }
        ns.tprint(option.vpsInitialRam + " is not a power of 2 or at least 2GB. Starting at the next greater value: " + cache + "GB")
        option.vpsInitialRam = cache
    }
    if (infDivideByValue(option.vpsMaxRam, 2) != 0.5) {
        let cache = 0
        for (var i = 1; cache <= option.vpsMaxRam; i++) {
            cache = Math.pow(2, i)
        }
        if (cache > 1048576) {
            cache = 1048576
        }
        ns.tprint(option.vpsMaxRam + " is not a valid value or higher than 2^20. Buying servers until: " + cache + "GB")
        option.vpsMaxRam = cache
    }
    let buyPerc = option.useMoneyPercentage / 100
    let doItTwice = 0
    do {
        for (var i = 0; i < option.vpsMaxAmount; i++) {
            pservers = ns.getPurchasedServers();
            let server = pservers[i]
            player = ns.getPlayer()
            if (server != undefined) {
                currentRam = JSON.parse(JSON.stringify(ns.getServerMaxRam(server)))
            }
            if (server == undefined && (pservers[isZero(i) - 1] != undefined || i == 0)) {
                let cost = ns.getPurchasedServerCost(option.vpsInitialRam)
                if (player.money * buyPerc > cost) {
                    var t = ns.purchaseServer(option.vpsPrefix + "-" + option.vpsInitialRam + "GB", option.vpsInitialRam) // example of a "new" bought : pserv-0-32GB
                    ns.exec(usrDirectory + "nmap.js", "home", 1)
                    await ns.sleep(50)
                    if (t == "") {
                        ns.print("WARNING: Failed to buy a new Server, you may not have enough money")
                    }
                }
            } else {
                if (server == undefined) {} else {
                    let nextRam = currentRam * 2
                    let ramSuffix = byteFormat[0]
                    if (nextRam >= 1024) {
                        ramSuffix = byteFormat[logBaseValue(1024, nextRam)]
                        nextRam = formatNumber(1024, nextRam)
                    }
                    if (currentRam != Math.pow(2, 20)) {
                        let cost = ns.getPurchasedServerCost(currentRam * 2)
                        if (player.money * buyPerc > cost) {
                            ns.killall(server)
                            var t = ns.deleteServer(server)
                            if (t == false) {
                                ns.print("WARNING: Not able to delete Server " + server + "\n There may be still running scripts")
                                ns.killall(server)
                                ns.exec(usrDirectory + "nmap.js", "home", 1)
                                await ns.sleep(50)
                            }
                            if (t == true) {
                                var u = ns.purchaseServer(option.vpsPrefix + "-" + nextRam + ramSuffix, currentRam * 2)
                                ns.exec(usrDirectory + "nmap.js", "home", 1)
                                if (u == "") {
                                    ns.print("WARNING: Failed to buy an upgrade for Server" + server + ", you may not had enough money" +
                                        "\nIt will get rebought at 32GB and upgraded again")
                                }
                            }
                        }
                    }
                }
            }
        }
        await ns.sleep(100)
    } while (allAtMaxRam(pservers, option.vpsMaxRam, ns) || doItTwice++ == 0);
}