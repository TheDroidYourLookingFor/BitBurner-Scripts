/** @param {import(".").NS } ns */
import {
    consoleMessage,
    debugMessage,
    logMessage
} from "/TheDroid/TheDroid-Core.js";
/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog("ALL");
    // Automagically Install Augments
    let autoInstallAugments = false;
    
    // Buy augments from factions
    let autoBuyEarlyGameAugments = false;

    // Which factions to grind
    let grindEarlyGameFaction = true;
    let grindCityFaction = false;
    let grindHackingFaction = false;
    let grindCorporationFaction = false;
    let grindCriminalFaction = false;
    let grindEndGameFaction = false;
    
    let factionEarlyGame = [{
        name: "Netburners",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "CyberSec",
        repGoal: "10000",
        job: "Hacking Contracts"
    }, {
        name: "Tian Di Hui",
        repGoal: "12500",
        job: "Hacking Contracts"
    }]
    let factionCity = [{
        name: "Sector-12",
        repGoal: "50000",
        job: "Hacking Contracts"
    }, {
        name: "Chongqing",
        repGoal: "50000",
        job: "Hacking Contracts"
    }, {
        name: "New Tokyo",
        repGoal: "50000",
        job: "Hacking Contracts"
    }, {
        name: "Ishima",
        repGoal: "50000",
        job: "Hacking Contracts"
    }, {
        name: "Aevum",
        repGoal: "50000",
        job: "Hacking Contracts"
    }, {
        name: "Volhaven",
        repGoal: "50000",
        job: "Hacking Contracts"
    }];
    let factionHacking = [{
        name: "NiteSec",
        repGoal: "112500",
        job: "Hacking Contracts"
    }, {
        name: "The Black Hand",
        repGoal: "112500",
        job: "Hacking Contracts"
    }, {
        name: "BitRunners",
        repGoal: "875000",
        job: "Hacking Contracts"
    }];
    let factionCorporation = [{
        name: "ECorp",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "MegaCorp",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "KuaiGong International",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "Four Sigma",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "NWO",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "Blade Industries",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "OmniTek Incorporated",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "Bachman & Associates",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "Clarke Incorporated",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "Fulcrum Secret Technologies",
        repGoal: "12500",
        job: "Hacking Contracts"
    }];
    let factionCriminal = [{
        name: "Slum Snakes",
        repGoal: "22500",
        job: "Field Work"
    }, {
        name: "Tetrads",
        repGoal: "22500",
        job: "Hacking Contracts"
    }, {
        name: "Silhouette",
        repGoal: "22500",
        job: "Hacking Contracts"
    }, {
        name: "Speakers for the Dead",
        repGoal: "22500",
        job: "Hacking Contracts"
    }, {
        name: "The Dark Army",
        repGoal: "22500",
        job: "Hacking Contracts"
    }, {
        name: "The Syndicate",
        repGoal: "22500",
        job: "Hacking Contracts"
    }];
    let factionEndGame = [{
        name: "The Covenant",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "Daedalus",
        repGoal: "12500",
        job: "Hacking Contracts"
    }, {
        name: "Illuminati",
        repGoal: "12500",
        job: "Hacking Contracts"
    }];

    if (grindEarlyGameFaction) {
        logMessage(ns, `Attempting to start early game faction work.`);
        await processFactionWork(ns, factionEarlyGame);
    }
    if (grindCityFaction) {
        logMessage(ns, `Attempting to start city faction work.`);
        await processFactionWork(ns, factionCity);
    }
    if (grindHackingFaction) {
        logMessage(ns, `Attempting to start hacking faction work.`);
        await processFactionWork(ns, factionHacking);
    }
    if (grindCorporationFaction) {
        logMessage(ns, `Attempting to start corporation faction work.`);
        await processFactionWork(ns, factionCorporation);
    }
    if (grindCriminalFaction) {
        logMessage(ns, `Attempting to start criminal faction work.`);
        await processFactionWork(ns, factionCriminal);
    }
    if (grindEndGameFaction) {
        logMessage(ns, `Attempting to start end game faction work.`);
        await processFactionWork(ns, factionEndGame);
    }
    logMessage(ns, "Completed faction grinding for all available factions.");
    if (autoBuyEarlyGameAugments) {
        for (const faction of factionEarlyGame) {
            buyAllFactionAugments(ns, faction.name);
        }
    }
    if (autoInstallAugments) installAugments(ns);
}
/** @param {import(".").NS } ns */
export function installAugments(ns) {
    if (ns.getOwnedAugmentations() < ns.getOwnedAugmentations(true)) {
        consoleMessage(ns, `Attempting to install augmentations and reset.`)
        ns.installAugmentations("/TheDroid/Manager-Startup.js")
    }
}
/** @param {import(".").NS } ns */
export async function buyAllFactionAugments(ns, factionName) {
    let factionAugments = ns.getAugmentationsFromFaction(factionName);
    let augments = [];

    for (const augment of factionAugments) {
        augments.push({
            name: augment,
            price: ns.getAugmentationPrice(augment)
        });
    }

    function compareSecondColumn(a, b) {
        if (a[1] === b[1]) {
            return 0;
        } else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    }
    augments.sort(compareSecondColumn(augments[0], augments[1]));

    for (const augName of augments) {
        if (!ns.getOwnedAugmentations().includes(augName) && ns.getAugmentationPrice() < ns.getServerMoneyAvailable("home")) {
            ns.purchaseAugmentation(factionName, augName);
        }
    }
}
/** @param {import(".").NS } ns */
export async function processFactionWork(ns, factionArray) {
    for (const currentFaction of factionArray) {
        if (ns.getPlayer().factions.includes(currentFaction.name)) {
            while (ns.getFactionRep(currentFaction.name) < currentFaction.repGoal) {
                if (!ns.isBusy() && ns.getFactionRep(currentFaction.name) < currentFaction.repGoal) {
                    logMessage(ns, `Starting faction grind for ${currentFaction.name} until ${currentFaction.repGoal}.`);
                    ns.workForFaction(currentFaction.name, currentFaction.job);
                }
                printFactionLog(ns, currentFaction.name, currentFaction.repGoal);
                await ns.sleep(250)
            }
            if (ns.isBusy()) ns.stopAction();
        }
    }
}
/** @param {import(".").NS } ns */
export function printFactionLog(ns, currentFaction, factionRepGoal) {
    ns.clearLog();
    ns.print(`
---------------------------------------------------
        Current Faction Information
---------------------------------------------------
        Faction:        ${currentFaction}
        Reputation:     ${ns.getFactionRep(currentFaction)}
        Goal:           ${factionRepGoal}
        Augments:       ${ns.getAugmentationsFromFaction(currentFaction).length}
        Pending Join:   ${ns.checkFactionInvitations()}
---------------------------------------------------
`);
}
