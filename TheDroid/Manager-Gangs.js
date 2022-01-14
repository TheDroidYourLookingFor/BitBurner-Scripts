/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.disableLog("ALL")
	const curMode = "Combat"
	const memberAscension = 1.50;
	const memberNames = [
		"Battle-Droid-00",
		"Battle-Droid-01",
		"Battle-Droid-02",
		"Battle-Droid-03",
		"Battle-Droid-04",
		"Battle-Droid-05",
		"Battle-Droid-06",
		"Battle-Droid-07",
		"Battle-Droid-08",
		"Battle-Droid-09",
		"Battle-Droid-10",
		"Battle-Droid-11"
	]
	const memberCombatTasks = [
		"Mug People",
		"Train Combat",
		"Vigilante Justice",
		"Territory Warfare",
		"Human Trafficking"
	]
	const memberWeapons = [
		"Baseball Bat",
		"Katana",
		"Glock 18C",
		"P90C",
		"Steyr AUG",
		"AK-47",
		"M15A10 Assault Rifle",
		"AWM Sniper Rifle"
	]
	const memberArmor = [
		"Bulletproof Vest",
		"Full Body Armor",
		"Liquid Body Armor",
		"Graphene Plating Armor"
	]
	const memberVehicles = [
		"Ford Flex V20",
		"ATX1070 Superbike",
		"Mercedes-Benz S9001",
		"White Ferrari"
	]
	const memberCombatAugments = [
		"Bionic Arms",
		"Bionic Legs",
		"Bionic Spine",
		"BrachiBlades",
		"Nanofiber Weave",
		"Synthetic Heart",
		"Synfibril Muscle",
		"Graphene Bone Lacings"
	]

	function memberBuy(equipType, gRoster) {
		//Check for equipment purchases
		for (const equip of equipType) {
			for (const gMember of gRoster) {
				if (gMember.str < 500) continue;
				if (ns.gang.getEquipmentCost(equip) < ns.getServerMoneyAvailable('home')) {
					ns.gang.purchaseEquipment(gMember, equip)
				}
			}
		}
	}

	function memberAscend(gangRoster) {
		//Check for ascensions
		for (const gMember of gangRoster) {
			if (ns.gang.getAscensionResult(gMember) == undefined) continue;
			if (ns.gang.getAscensionResult(gMember).str >= memberAscension) {
				ns.gang.ascendMember(gMember);
			}
		}
	}

	function memberWarfare(myGang) {
		//Territory warfare checks
		let clashChance = [
			ns.gang.getChanceToWinClash("Tetrads"),
			ns.gang.getChanceToWinClash("The Syndicate"),
			ns.gang.getChanceToWinClash("The Dark Army"),
			ns.gang.getChanceToWinClash("Speakers for the Dead"),
			ns.gang.getChanceToWinClash("NiteSec"),
			ns.gang.getChanceToWinClash("The Black Hand")
		]
		if (clashChance.every(e => e > .7) && myGang.territory != 1) {
			ns.gang.setTerritoryWarfare(true)
		}
		if (clashChance.some(s => s < .6 || myGang.territory == 1)) ns.gang.setTerritoryWarfare(false)

		return clashChance;
	}

	function memberTasks(gangRoster, myGang, memberCombatTasks) {
		//Assign tasks
		let clashChance = memberWarfare(myGang);
		for (const gMember of gangRoster) {
			if (gMember.str > 100 && gangRoster.length < 6) {
				ns.gang.setMemberTask(gMember, memberCombatTasks[0]);
				continue;
			}
			if (gMember.str < 500) {
				ns.gang.setMemberTask(gMember, memberCombatTasks[1]);
				continue;
			}
			if (myGang.wantedPenalty < .05) {
				ns.gang.setMemberTask(gMember, memberCombatTasks[2]);
				continue;
			}
			if (clashChance.some(s => s < .8) && myGang.territory != 1 && gangRoster.length == 12) {
				ns.gang.setMemberTask(gMember, memberCombatTasks[3]);
				continue;
			}
			ns.gang.setMemberTask(gMember, memberCombatTasks[4]);
		}
	}

	function recruitNewMembers(memberNames) {
		//Check for recruits
		if (ns.gang.canRecruitMember()) {
			for (const gMember of memberNames) {
				if (gangRoster.indexOf(gMember) === -1) {
					var newName = gMember;
					break;
				}
			}
			ns.gang.recruitMember(newName);
			ns.gang.setMemberTask(newName, "Train Combat")
		}
	}

	while (true) {
		let myGang = ns.gang.getGangInformation();
		let gangRoster = ns.gang.getMemberNames();
		let rosterInfo = [];

		for (const gMember of gangRoster) {
			rosterInfo.push(ns.gang.getMemberInformation(gMember));
		}

		memberAscend(gangRoster);
		recruitNewMembers(memberNames);
		memberBuy(memberWeapons, gangRoster);
		memberBuy(memberArmor, gangRoster);
		memberBuy(memberVehicles, gangRoster);
		memberBuy(memberCombatAugments, gangRoster);
		memberTasks(gangRoster, myGang, memberCombatTasks);

		//Update Log
		let max_length = 19;
		let max_length2 = 10;
		let border_max_length = 53;
		let outputTheDruid = `TheDroid Gang Management`;
		let outputHeaderName = `Name`;
		let outputHeaderTask = `Task`;
		let outputHeaderAscenscion = `Ascension`;
		let outputBlank = "\r\n";

		ns.clearLog()
		ns.print("" +
			outputBlank + '-'.repeat(border_max_length - outputBlank.length) +
			outputBlank + ' '.repeat(13) + outputTheDruid +
			outputBlank + '-'.repeat(border_max_length - outputBlank.length) +
			outputBlank + ' '.repeat(19) + "Current Gang" +
			outputBlank + ' '.repeat(20) + myGang.faction + outputBlank +
			outputBlank + '-'.repeat(border_max_length - outputBlank.length) +
			outputHeaderName + ' '.repeat(max_length - outputHeaderName.length) + outputHeaderTask + ' '.repeat(28 - outputHeaderAscenscion.length) + outputHeaderAscenscion +
			outputBlank + '-'.repeat(border_max_length - outputBlank.length)
		);

		for (const gMember of rosterInfo) {
			let memberName = gMember.name;
			let memberTask = gMember.task;
			let memberCombatAscension = ns.nFormat(0.00, '0,0.00');
			if (ns.gang.getAscensionResult(memberName) != undefined) {
				memberCombatAscension = ns.nFormat(ns.gang.getAscensionResult(memberName).str, '0,0.00');
			}
			ns.print(memberName + ' '.repeat(max_length - memberName.length) + memberTask.padEnd(17) + ' '.repeat(max_length2 - memberCombatAscension.length) + memberCombatAscension + "/" + ns.nFormat(memberAscension, '0,0.00'))
		}
		await ns.sleep(1000)
	}
}