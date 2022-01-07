/** @param {import(".").NS } ns */
import {
    userDebug,
    srvGetMinSecurityLevel,
    srvGetSecurityLevel,
    srvGetMaxMoney,
    srvGetMoneyAvailable,
    attackSrvHack,
    attackSrvGrow,
    attackSrvWeaken
} from "/TheDroid/TheDroid-Core.js";

/** @param {import(".").NS } ns */
export async function main(ns) {
    var target = ns.args[0];
    const useDebug = userDebug;
    if (useDebug) ns.tprint("Attacking " + target + " from " + ns.getHostname());
    while (true) {
        var moneyThresh = srvGetMaxMoney(ns, target) * 0.75;
        var securityThresh = srvGetMinSecurityLevel(ns, target) + 5;
        if (srvGetSecurityLevel(ns, target) > securityThresh) {
            await attackSrvWeaken(ns, target);
        } else if (srvGetMoneyAvailable(ns, target) < moneyThresh) {
            await attackSrvGrow(ns, target);
        } else {
            await attackSrvHack(ns, target);
        }
    }
}