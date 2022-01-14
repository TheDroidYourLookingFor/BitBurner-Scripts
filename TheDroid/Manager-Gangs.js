/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.disableLog("ALL")
	const memNames = [
		"Wolf",
		"Hawk",
		"Bear",
		"Shark",
		"Lion",
		"Eagle",
		"Dragon",
		"Panther",
		"Orca",
		"Tiger",
		"Python",
		"Leopard"
	]
	const weapons = [
		"Baseball Bat",
		"Katana",
		"Glock 18C",
		"P90C",
		"Steyr AUG",
		"AK-47",
		"M15A10 Assault Rifle",
		"AWM Sniper Rifle"
	]
	const armor = [
		"Bulletproof Vest",
		"Full Body Armor",
		"Liquid Body Armor",
		"Graphene Plating Armor"
	]
	const vehicles = [
		"Ford Flex V20",
		"ATX1070 Superbike",
		"Mercedes-Benz S9001",
		"White Ferrari"
	]
	const augments = [
		"Bionic Arms",
		"Bionic Legs",
		"Bionic Spine",
		"BrachiBlades",
		"Nanofiber Weave",
		"Synthetic Heart",
		"Synfibril Muscle",
		"Graphene Bone Lacings"
	]

	while (true) {
		//Refresh stats
		let myGang = ns.gang.getGangInformation();
		let gangRoster = ns.gang.getMemberNames();
		let rosterInfo = [];
		for (let i = 0; i < gangRoster.length; i++) {
			rosterInfo.push(ns.gang.getMemberInformation(gangRoster[i]));
		}

		//Check for ascensions
		for (let i = 0; i < gangRoster.length; i++) {
			if (ns.gang.getAscensionResult(gangRoster[i]) == undefined) continue;
			if (ns.gang.getAscensionResult(gangRoster[i]).str > 1.5) {
				ns.gang.ascendMember(gangRoster[i]);
			}
		}

		//Check for recruits
		if (ns.gang.canRecruitMember()) {
			for (let i = 0; i < memNames.length; i ++) {
				if (gangRoster.indexOf(memNames[i]) === -1) {
					var newName = memNames[i];
					break;
				}
			}
			ns.gang.recruitMember(newName);
			ns.gang.setMemberTask(newName, "Train Combat")
		}


		//Check for equipment purchases
		for (let i = 0; i < weapons.length; i++) {
			for (let j = 0; j < gangRoster.length; j++) {
				if (rosterInfo[j].str < 500) continue;
				if (ns.gang.getEquipmentCost(weapons[i]) < ns.getServerMoneyAvailable('home')) {
					ns.gang.purchaseEquipment(gangRoster[j], weapons[i])
				}
			}
		}
		for (let i = 0; i < armor.length; i++) {
			for (let j = 0; j < gangRoster.length; j++) {
				if (rosterInfo[j].str < 500) continue;
				if (ns.gang.getEquipmentCost(armor[i]) < ns.getServerMoneyAvailable('home')) {
					ns.gang.purchaseEquipment(gangRoster[j], armor[i])
				}
			}
		}
		for (let i = 0; i < vehicles.length; i++) {
			for (let j = 0; j < gangRoster.length; j++) {
				if (rosterInfo[j].str < 500) continue;
				if (ns.gang.getEquipmentCost(vehicles[i]) < ns.getServerMoneyAvailable('home')) {
					ns.gang.purchaseEquipment(gangRoster[j], vehicles[i])
				}
			}
		}
		for (let i = 0; i < augments.length; i++) {
			for (let j = 0; j < gangRoster.length; j++) {
				if (rosterInfo[j].str < 500) continue;
				if (ns.gang.getEquipmentCost(augments[i]) < ns.getServerMoneyAvailable('home')) {
					ns.gang.purchaseEquipment(gangRoster[j], augments[i])
				}
			}
		}

		//Territory warfare checks
		let clashChance = [
			ns.gang.getChanceToWinClash("Tetrads"), 
			ns.gang.getChanceToWinClash("The Syndicate"), 
			ns.gang.getChanceToWinClash("The Dark Army"), 
			ns.gang.getChanceToWinClash("Speakers for the Dead"),
			ns.gang.getChanceToWinClash("NiteSec"),
			ns.gang.getChanceToWinClash("The Black Hand")
		]
		if (clashChance.every( e => e > .7) && myGang.territory != 1) {
			ns.gang.setTerritoryWarfare(true)
		}
		if (clashChance.some( s => s < .6 || myGang.territory == 1)) ns.gang.setTerritoryWarfare(false)

		//Assign tasks
		for (let i = 0; i < gangRoster.length; i++) {
			if (rosterInfo[i].str > 100 && gangRoster.length < 6) {
				ns.gang.setMemberTask(gangRoster[i], "Mug People");
				continue;
			}
			if (rosterInfo[i].str < 500) {
				ns.gang.setMemberTask(gangRoster[i], "Train Combat");
				continue;
			}
			if (myGang.wantedPenalty < .05) {
				ns.gang.setMemberTask(gangRoster[i], "Vigilante Justice");
				continue;
			}
			if (clashChance.some( s => s < .8) && myGang.territory != 1 && gangRoster.length == 12) {
				ns.gang.setMemberTask(gangRoster[i], "Territory Warfare");
				continue;
			}
			ns.gang.setMemberTask(gangRoster[i], "Human Trafficking");
		}

		//Update Log
		ns.clearLog()
		ns.print("Gang: " + myGang.faction)
		for (let i = 0; i < gangRoster.length; i++) {
			ns.print(rosterInfo[i].name + " - " + rosterInfo[i].task)
		}
		await ns.sleep(1000)
	}
}