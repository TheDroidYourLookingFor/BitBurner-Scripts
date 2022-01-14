/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
	if (args.help) {
		ns.tprint("This script will automatically buy Hacknet nodes.");
		ns.tprint(`USAGE: run ${ns.getScriptName()}`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()}`);
		return;
	}
    var reserveMoney = 1000000;
    var n = 1;

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
        while (ns.getServerMoneyAvailable("home") >= reserveMoney) {
            for (var i = 0; i < ns.hacknet.numNodes(); i++) {
                while (
                    ns.hacknet.getLevelUpgradeCost(i, n) < Infinity &&
                    ns.hacknet.upgradeLevel(i, n)
                ) {
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
                    ns.print(
                        "Upgraded " +
                        ns.hacknet.getNodeStats(i).name +
                        " core to " +
                        ns.hacknet.getNodeStats(i).cores
                    );
                    await ns.sleep(100);
                }
            }
            if (
                ns.hacknet.getLevelUpgradeCost((ns.hacknet.numNodes() - 1), n) === Infinity &&
                ns.hacknet.getRamUpgradeCost((ns.hacknet.numNodes() - 1), n) === Infinity &&
                ns.hacknet.getCoreUpgradeCost((ns.hacknet.numNodes() - 1), n) === Infinity
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
                ns.hacknet.getCoreUpgradeCost((ns.hacknet.numNodes() - 1), n) > ns.hacknet.getPurchaseNodeCost()
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