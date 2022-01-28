/** @param {import(".").NS } ns */
import {
    consoleMessage,
    logMessage,
    debugMessage,
    lookForBackdoorTargs,
    probeNetwork
} from "/TheDroid/TheDroid-Core.js";

let serverList = [];
/** @param {import(".").NS } ns */
export async function main(ns) {
    // Let the system automatically backdoor new servers
    ns.disableLog("scan");
    const useAutoBackdoor = true;

    consoleMessage(ns, `[INFO]${ns.getScriptName()} starting up.`);
    consoleMessage(ns, `[INFO]AutoBackdoor: ${useAutoBackdoor}`);

    while (true) {
        if (useAutoBackdoor) {
            serverList = probeNetwork(ns);
            try {
                await lookForBackdoorTargs(ns, serverList);
            } catch (e) {}
        }
        await ns.asleep(250);
    }
}