/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.disableLog("ALL");
	ns.tail();
	const buyHackingStuff = false;
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
	];

	const memberWeapons = [
		"Baseball Bat",
		"Katana",
		"Glock 18C",
		"P90C",
		"Steyr AUG",
		"AK-47",
		"M15A10 Assault Rifle",
		"AWM Sniper Rifle"
	];

	const memberArmor = [
		"Bulletproof Vest",
		"Full Body Armor",
		"Liquid Body Armor",
		"Graphene Plating Armor"
	];

	const memberVehicles = [
		"Ford Flex V20",
		"ATX1070 Superbike",
		"Mercedes-Benz S9001",
		"White Ferrari"
	];

	const memberRootkits = [
		"NUKE Rootkit",
		"Soulstealer Rootkit",
		"Demon Rootkit",
		"Hmap Node",
		"Jack the Ripper"
	];

	const memberHackingAugments = [
		"BitWire",
		"Neuralstimulator",
		"DataJack"
	];

	const memberCombatAugments = [
		"Bionic Arms",
		"Bionic Legs",
		"Bionic Spine",
		"BrachiBlades",
		"Nanofiber Weave",
		"Synthetic Heart",
		"Synfibril Muscle",
		"Graphene Bone Lacings"
	];

	function memberBuy(equipType) {
		//Check for equipment purchases
		let gangRoster = ns.gang.getMemberNames();
		for (const equip of equipType) {
			for (const gMember of gangRoster) {
				if (ns.gang.getMemberInformation(gMember).str < 500) continue;
				if (ns.gang.getEquipmentCost(equip) < ns.getServerMoneyAvailable('home')) {
					ns.gang.purchaseEquipment(ns.gang.getMemberInformation(gMember).name, equip);
				}
			}
		}
	}

	function memberAscend() {
		//Check for ascensions
		let gangRoster = ns.gang.getMemberNames();
		for (const gMember of gangRoster) {
			if (ns.gang.getAscensionResult(ns.gang.getMemberInformation(gMember).name) == undefined) continue;
			if (ns.gang.getAscensionResult(ns.gang.getMemberInformation(gMember).name).str >= memberAscension) {
				ns.gang.ascendMember(ns.gang.getMemberInformation(gMember).name);
			}
		}
	}

	function memberWarfare() {
		//Territory warfare checks
		let myGang = ns.gang.getGangInformation();
		let clashChance = [
			ns.gang.getChanceToWinClash("Tetrads"),
			ns.gang.getChanceToWinClash("The Syndicate"),
			ns.gang.getChanceToWinClash("The Dark Army"),
			ns.gang.getChanceToWinClash("Speakers for the Dead"),
			ns.gang.getChanceToWinClash("NiteSec"),
			ns.gang.getChanceToWinClash("The Black Hand")
		];
		if (clashChance.every(e => e > .7) && myGang.territory != 1) {
			ns.gang.setTerritoryWarfare(true);
		}
		if (clashChance.some(s => s < .6 || myGang.territory == 1)) ns.gang.setTerritoryWarfare(false);

		return clashChance;
	}

	function memberTasks() {
		//Assign tasks
		const memberCombatTasks = [
			"Mug People",
			"Train Combat",
			"Vigilante Justice",
			"Territory Warfare",
			"Human Trafficking"
		];

		let myGang = ns.gang.getGangInformation();
		let gangRoster = ns.gang.getMemberNames();
		let clashChance = memberWarfare();

		for (const gMember of gangRoster) {
			if (ns.gang.getMemberInformation(gMember).str > 100 && gangRoster.length < 6) {
				ns.gang.setMemberTask(ns.gang.getMemberInformation(gMember).name, memberCombatTasks[0]);
				continue;
			}
			if (ns.gang.getMemberInformation(gMember).str < 500) {
				ns.gang.setMemberTask(ns.gang.getMemberInformation(gMember).name, memberCombatTasks[1]);
				continue;
			}
			if (myGang.wantedPenalty < .05) {
				ns.gang.setMemberTask(ns.gang.getMemberInformation(gMember).name, memberCombatTasks[2]);
				continue;
			}
			if (clashChance.some(s => s < .8) && myGang.territory != 1 && gangRoster.length == 12) {
				ns.gang.setMemberTask(ns.gang.getMemberInformation(gMember).name, memberCombatTasks[3]);
				continue;
			}
			ns.gang.setMemberTask(ns.gang.getMemberInformation(gMember).name, memberCombatTasks[4]);
		}
	}

	function recruitNewMembers(memberNames) {
		//Check for recruits
		let gangRoster = ns.gang.getMemberNames();
		if (ns.gang.canRecruitMember()) {
			for (const gMember of memberNames) {
				if (gangRoster.indexOf(gMember) === -1) {
					var newName = gMember;
					break;
				}
			}
			ns.gang.recruitMember(newName);
			ns.gang.setMemberTask(newName, "Train Combat");
		}
	}

	while (true) {
		let myGang = ns.gang.getGangInformation();
		let gangRoster = ns.gang.getMemberNames();

		memberAscend();
		recruitNewMembers(memberNames);
		memberBuy(memberWeapons);
		memberBuy(memberArmor);
		memberBuy(memberVehicles);
		memberBuy(memberCombatAugments);
		if (buyHackingStuff) {
			memberBuy(memberRootkits);
			memberBuy(memberHackingAugments);
		}
		memberTasks();

		//Update Log
		let max_length = 20;
		let max_length2 = 9;
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
			outputHeaderName + ' '.repeat(max_length - outputHeaderName.length) + outputHeaderTask + ' '.repeat(27 - outputHeaderAscenscion.length) + outputHeaderAscenscion +
			outputBlank + '-'.repeat(border_max_length - outputBlank.length)
		);

		for (const gMember of gangRoster) {
			let memberName = ns.gang.getMemberInformation(gMember).name;
			let memberTask = ns.gang.getMemberInformation(gMember).task;
			let memberCombatAscension = ns.nFormat(1.00, '0,0.00');
			if (ns.gang.getAscensionResult(memberName) != undefined) {
				memberCombatAscension = ns.nFormat(ns.gang.getAscensionResult(memberName).str, '0,0.00');
			}
			ns.print(memberName + ' '.repeat(max_length - memberName.length) + memberTask.padEnd(17) + ' '.repeat(max_length2 - memberCombatAscension.length) + memberCombatAscension + "/" + ns.nFormat(memberAscension, '0,0.00'));
		}
		await ns.sleep(250);
	}
}