/** @param {NS} ns **/
export async function main(ns) {
	// Early Game
	var targetServerAmount_eg = 6;
	var levelMax_eg = 75;
	var ramMax_eg = 16;
	var coreMax_eg = 4;
	// Mid Game
	var targetServerAmount_mg = 12;
	var levelMax_mg = 125;
	var ramMax_mg = 32;
	var coreMax_mg = 8;
	// Late Game
	var targetServerAmount_lg = 18;
	var levelMax_lg = 200;
	var ramMax_lg = 64;
	var coreMax_lg = 16;

	async function myMoney(ns) {
		return ns.getServerMoneyAvailable("home");
	}

	/** @param {NS} ns **/
	async function purchaseHNServer(ns, nodeamount) {
		// Buy missing nodes
		while (ns.hacknet.numNodes() < nodeamount) {
			var cost = ns.hacknet.getPurchaseNodeCost();
			while (myMoney(ns) < cost) {
				ns.print("Need $" + cost + " . Have $" + myMoney(ns));
				ns.sleep(3000);
			}
			ns.hacknet.purchaseNode();
			ns.print("Purchased hacknet Node.");
		};
	}

	/** @param {NS} ns **/
	async function upgradeHNLvL(ns, levelTarget, currentSrvs) {
		for (var i = 0; i < currentSrvs; i++) {
			while (ns.hacknet.getNodeStats(i).level < levelTarget) {
				var cost = ns.hacknet.getLevelUpgradeCost(i, 10);
				while (myMoney(ns) < cost) {
					ns.print("Need $" + cost + " . Have $" + myMoney(ns));
					ns.sleep(3000);
				}
				ns.hacknet.upgradeLevel(i, 10);
			};
		};

		ns.toast("All nodes upgraded to level " + levelTarget);
	}

	/** @param {NS} ns **/
	async function upgradeHNRAM(ns, ramTarget, currentSrvs) {
		for (var i = 0; i < currentSrvs; i++) {
			while (ns.hacknet.getNodeStats(i).ram < ramTarget) {
				var cost = ns.hacknet.getRamUpgradeCost(i, 2);
				while (myMoney(ns) < cost) {
					ns.print("Need $" + cost + " . Have $" + myMoney(ns));
					ns.sleep(3000);
				}
				ns.hacknet.upgradeRam(i, 2);
			};
		};
		ns.toast("All nodes upgraded to " + ramTarget + "GB RAM");
	}

	/** @param {NS} ns **/
	async function upgradeHNCores(ns, coreTarget, currentSrvs) {
		for (var i = 0; i < currentSrvs; i++) {
			while (ns.hacknet.getNodeStats(i).cores < coreTarget) {
				var cost = ns.hacknet.getCoreUpgradeCost(i, 1);
				while (myMoney(ns) < cost) {
					ns.print("Need $" + cost + " . Have $" + myMoney(ns));
					ns.sleep(3000);
				}
				ns.hacknet.upgradeCore(i, 1);
			};
		};

		ns.toast("All nodes upgraded to " + coreTarget + " cores");
	}

	// Startup
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");
	ns.toast("Upgrading Hacknet early game");
	purchaseHNServer(ns,targetServerAmount_eg);
	upgradeHNLvL(ns,levelMax_eg, targetServerAmount_eg);
	upgradeHNRAM(ns,ramMax_eg, targetServerAmount_eg);
	upgradeHNCores(ns,coreMax_eg, targetServerAmount_eg);
	ns.toast("Upgrading Hacknet mid game");
	purchaseHNServer(ns,targetServerAmount_mg);
	upgradeHNLvL(ns,levelMax_mg, targetServerAmount_mg);
	upgradeHNRAM(ns,ramMax_mg, targetServerAmount_mg);
	upgradeHNCores(ns,coreMax_mg, targetServerAmount_mg);
	ns.toast("Upgrading Hacknet late game");
	purchaseHNServer(ns,targetServerAmount_lg);
	upgradeHNLvL(ns,levelMax_lg, targetServerAmount_lg);
	upgradeHNRAM(ns,ramMax_lg, targetServerAmount_lg);
	upgradeHNCores(ns,coreMax_lg, targetServerAmount_lg);
}