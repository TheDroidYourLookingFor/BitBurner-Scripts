/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tail();
    ns.disableLog("ALL")
    let myStats = ns.getPlayer();
    let moneyReserve = 1000000;
    let trainGoal = 25;
    let trainLimit = 1500;
    let trainIncrement = 25;
    let currentTrainingStat = "strength";
    let gymList = [{
        gym: "Powerhouse Gym",
        city: "Sector-12"
    }];

    while (true) {
        myStats = ns.getPlayer();
        ns.disableLog("ALL");
        ns.clearLog();
        ns.print(`
---------------------------------------------------
            Current Training Information
---------------------------------------------------
    Working:    ${currentTrainingStat}
    Goal:       ${trainGoal}
    Limit:      ${trainLimit}
    Money:      ${ns.nFormat(ns.getServerMoneyAvailable("home"), '$0,0.00')}
    Reserve:    ${ns.nFormat(moneyReserve, '$0,0.00')}
---------------------------------------------------
                Current Stats
---------------------------------------------------
    Strength:   ${myStats.strength}
    Defense:    ${myStats.defense}
    Dexterity:  ${myStats.dexterity}
    Agility:    ${myStats.agility}
    Charisma:   ${myStats.charisma}
    Int:        ${myStats.intelligence}
---------------------------------------------------
        `);
        while (ns.getServerMoneyAvailable("home") < moneyReserve) {
            if (ns.isBusy()) ns.stopAction();
            await ns.asleep(250);
        }
        if (currentTrainingStat == "strength" && myStats.strength >= trainGoal) {
            currentTrainingStat = "defense";
            ns.stopAction();
        }
        if (currentTrainingStat == "defense" && myStats.defense >= trainGoal) {
            currentTrainingStat = "dexterity";
            ns.stopAction();
        }
        if (currentTrainingStat == "dexterity" && myStats.dexterity >= trainGoal) {
            currentTrainingStat = "agility";
            ns.stopAction();
        }
        if (currentTrainingStat == "agility" && myStats.agility >= trainGoal) {
            if (trainGoal < trainLimit) {
                trainGoal = trainGoal + trainIncrement;
                currentTrainingStat = "strength";
                ns.stopAction();
            } else {
                ns.print(`Reached our training limit of ${trainLimit}`)
                ns.exit();
            }
        }
        await ns.sleep(1000);
        if (currentTrainingStat == "strength" && myStats.strength < trainGoal && !ns.isBusy()) {
            trainStat(ns, gymList[0].gym, gymList[0].city, "strength");
        }
        if (currentTrainingStat == "defense" && myStats.defense < trainGoal && !ns.isBusy()) {
            trainStat(ns, gymList[0].gym, gymList[0].city, "defense");
        }
        if (currentTrainingStat == "dexterity" && myStats.dexterity < trainGoal && !ns.isBusy()) {
            trainStat(ns, gymList[0].gym, gymList[0].city, "dexterity");
        }
        if (currentTrainingStat == "agility" && myStats.agility < trainGoal && !ns.isBusy()) {
            trainStat(ns, gymList[0].gym, gymList[0].city, "agility");
        }
        await ns.asleep(250);
    }
}
/** @param {import(".").NS } ns */
export function trainStat(ns, gymTarget, gymCity, statToTrain) {
    let player = ns.getPlayer();
    if (player.location != gymCity) ns.travelToCity(gymCity);
    ns.gymWorkout(gymTarget, statToTrain);
}
/** @param {import(".").NS } ns */
export function factionWork(ns, factionTarget, factionJob, factionRepTarget) {
    while (ns.getFactionRep(factionTarget) < factionRepTarget) {
        ns.workForFaction(factionTarget, factionJob);
        ns.sleep(1 * 60 * 1000);
    }
}