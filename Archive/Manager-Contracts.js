// Based on https://github.com/danielyxie/bitburner/blob/master/src/data/codingcontracttypes.ts
/** @param {NS} ns **/
import {
	debugMessage,
	userDirectory,
	usrProbeData00,
	usrProbeData01,
	findAnswer,
	findContracts
} from "/TheDroid/TheDroid-Core.js";

export var contractsDb;
/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("sleep")
	debugMessage(ns, `Starting ` + ns.getScriptName())
	let hostname = ns.getHostname()
	if (hostname !== 'home') {
		throw new Exception('Run the script from home')
	}
	contractsDb = [];
	while (true) {
		await findContracts(ns, userDirectory + usrProbeData00, contractsDb);
		await findContracts(ns, userDirectory + usrProbeData01, contractsDb);
		if (contractsDb.length) {
			for (let i = 0; i < contractsDb.length; i++) {
				const contract = contractsDb[i]
				const answer = findAnswer(contract)
				if (answer != null) {
					const solvingResult = ns.codingcontract.attempt(answer, contract.contract, contract.svName, { returnReward: true })
					if (solvingResult) {
						debugMessage(ns, `Solved ${contract.contract} on ${contract.svName}. ${solvingResult}`)
					} else {
						debugMessage(ns, `Wrong answer for ${contract.contract} on ${contract.svName}`)
					}
				} else {
					debugMessage(ns, `Unable to find the answer for: ${JSON.stringify(contract)}`)
				}
			}
		}
		await ns.sleep(10*60*1000)
	}
}