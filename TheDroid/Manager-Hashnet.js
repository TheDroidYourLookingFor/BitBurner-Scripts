/** @param {import(".").NS } ns */
export async function main(ns) {
    const args = ns.flags([
        ['help', false]
    ]);
    if (args.help) {
        ns.tprint("This script will automatically buy Hacknet nodes.");
        ns.tprint(`USAGE: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }
    var reserveMoney = 1000000;
    var reserveHashes = ns.hacknet.hashCapacity() / 3;
    let cacheCap = 5;
    let sellType = "money";
    var n = 1;
    ns.tail();

    ns.disableLog("disableLog");
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");

    if (
        ns.hacknet.numNodes() === 0 &&
        ns.getServerMoneyAvailable("home") >= reserveMoney
    ) {
        ns.hacknet.purchaseNode();
        ns.print(
            "Purchased " +
            ns.hacknet.getNodeStats((ns.hacknet.numNodes() - 1)).name +
            " because there was none."
        );
    }

    while (ns.hacknet.numNodes() > 0) {
        while (ns.hacknet.numHashes() >= reserveHashes) {
            switch (sellType) {
                case "money":
                    ns.hacknet.spendHashes("Sell for Money");
                    break;
                case "corp_funds":
                    ns.hacknet.spendHashes("Sell for Corporation Funds");
                    break;
                case "corp_research":
                    ns.hacknet.spendHashes("Exchange for Corporation Research");
                    break;
                case "gym":
                    ns.hacknet.spendHashes("Improve Gym Training");
                    break;
                case "contract":
                    ns.hacknet.spendHashes("Generate Coding Contract");
                    break;
                case "bladeburner_sp":
                    ns.hacknet.spendHashes("Exchnage for Bladeburner SP");
                    break;
                case "bladeburner_rank":
                    ns.hacknet.spendHashes("Exchnage for Bladeburner Rank");
                    break;
                case "college":
                    ns.hacknet.spendHashes("Improve Studying");
                    break;
                default:
                    ns.hacknet.spendHashes("Sell for Money");
            }
            await ns.sleep(100);
        }
        while (ns.getServerMoneyAvailable("home") >= reserveMoney) {
            for (var i = 0; i < ns.hacknet.numNodes(); i++) {
                while (
                    ns.hacknet.getLevelUpgradeCost(i, n) < Infinity &&
                    ns.hacknet.upgradeLevel(i, n)
                ) {
                    printHashLog(ns, ns.hacknet.getNodeStats(i).name, "level", ns.hacknet.getNodeStats(i).level);
                    ns.print(
                        "Upgraded " +
                        ns.hacknet.getNodeStats(i).name +
                        " to level " +
                        ns.hacknet.getNodeStats(i).level
                    );
                    await ns.sleep(100);
                }
                while (
                    ns.hacknet.getRamUpgradeCost(i, n) < Infinity &&
                    ns.hacknet.upgradeRam(i, n)
                ) {
                    printHashLog(ns, ns.hacknet.getNodeStats(i).name, "RAM", ns.hacknet.getNodeStats(i).ram);
                    ns.print(
                        "Upgraded " +
                        ns.hacknet.getNodeStats(i).name +
                        " RAM to " +
                        ns.hacknet.getNodeStats(i).ram
                    );
                    await ns.sleep(100);
                }
                while (
                    ns.hacknet.getCoreUpgradeCost(i, n) < Infinity &&
                    ns.hacknet.upgradeCore(i, n)
                ) {
                    printHashLog(ns, ns.hacknet.getNodeStats(i).name, "core", ns.hacknet.getNodeStats(i).cores);
                    ns.print(
                        "Upgraded " +
                        ns.hacknet.getNodeStats(i).name +
                        " core to " +
                        ns.hacknet.getNodeStats(i).cores
                    );
                    await ns.sleep(100);
                }
                while (ns.hacknet.getNodeStats(i).cache < cacheCap) {
                    if (
                        ns.hacknet.getCacheUpgradeCost(i, n) < Infinity &&
                        ns.hacknet.upgradeCache(i, n)
                    ) {
                        printHashLog(ns, ns.hacknet.getNodeStats(i).name, "cache", ns.hacknet.getNodeStats(i).cache);
                        ns.print(
                            "Upgraded " +
                            ns.hacknet.getNodeStats(i).name +
                            " cache to " +
                            ns.hacknet.getNodeStats(i).cache
                        );
                        reserveHashes = ns.hacknet.hashCapacity() / 3;
                        await ns.sleep(100);
                    }
                }
            }
            if (
                ns.hacknet.getLevelUpgradeCost((ns.hacknet.numNodes() - 1), n) === Infinity &&
                ns.hacknet.getRamUpgradeCost((ns.hacknet.numNodes() - 1), n) === Infinity &&
                ns.hacknet.getCoreUpgradeCost((ns.hacknet.numNodes() - 1), n) === Infinity &&
                ns.hacknet.getCacheUpgradeCost((ns.hacknet.numNodes() - 1), n) === Infinity
            ) {
                if (ns.hacknet.numNodes() < 23) {
                    ns.hacknet.purchaseNode();
                    ns.print(
                        "Purchased " +
                        ns.hacknet.getNodeStats((ns.hacknet.numNodes() - 1)).name +
                        " because the last one couldn't be upgraded further."
                    );
                } else {
                    ns.exit();
                }
            } else if (
                ns.hacknet.getLevelUpgradeCost((ns.hacknet.numNodes() - 1), n) > ns.hacknet.getPurchaseNodeCost() &&
                ns.hacknet.getRamUpgradeCost((ns.hacknet.numNodes() - 1), n) > ns.hacknet.getPurchaseNodeCost() &&
                ns.hacknet.getCoreUpgradeCost((ns.hacknet.numNodes() - 1), n) > ns.hacknet.getPurchaseNodeCost() &&
                ns.hacknet.getCacheUpgradeCost((ns.hacknet.numNodes() - 1), n) > ns.hacknet.getPurchaseNodeCost()
            ) {
                ns.hacknet.purchaseNode();
                ns.print(
                    "Purchased " +
                    ns.hacknet.getNodeStats((ns.hacknet.numNodes() - 1)).name +
                    " because it was cheaper than next upgrade for the last one."
                );
            }
            await ns.sleep(100);
        }
        await ns.sleep(100);
    }
};

let hashMessageArray = [];
/** @param {import(".").NS } ns */
export function printHashLog(ns, upgradeName, UpgradeType, UpgradeLevel) {
    //Update Log
    let max_length = 20;
    let max_length2 = 27;
    let border_max_length = 53;
    let outputTheDruid = `TheDroid Hash Management`;
    let outputHeaderName = `Name`;
    let outputHeaderTask = `Type`;
    let outputHeaderLevel = `Level`;
    let outputBlank = "\r\n";

    let upgradeMessage = upgradeName + ' '.repeat(max_length - upgradeName.length) + UpgradeType + ' '.repeat(max_length2 - UpgradeLevel.length) + UpgradeLevel;

    if (hashMessageArray.length > 0) {
        if (hashMessageArray.length > 5) {
            hashMessageArray.shift();
            if (hashMessageArray.indexOf(upgradeMessage) == -1) {
                hashMessageArray.push(upgradeMessage);
            }
        } else {
            if (hashMessageArray.indexOf(upgradeMessage) == -1) {
                hashMessageArray.push(upgradeMessage);
            }
        }
    } else {
        hashMessageArray.push(upgradeMessage);
    }

    ns.clearLog()
    ns.print("" +
        outputBlank + '-'.repeat(border_max_length - outputBlank.length) +
        outputBlank + ' '.repeat(13) + outputTheDruid +
        outputBlank + '-'.repeat(border_max_length - outputBlank.length) +
        outputHeaderName + ' '.repeat(max_length - outputHeaderName.length) + outputHeaderTask + ' '.repeat(max_length2 - outputHeaderLevel.length) + outputHeaderLevel +
        outputBlank + '-'.repeat(border_max_length - outputBlank.length)
    );
    for (const hMessage of hashMessageArray) {
        ns.print(hMessage);
    }
}