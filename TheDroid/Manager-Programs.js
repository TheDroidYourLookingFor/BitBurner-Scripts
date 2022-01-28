/** @param {import(".").NS } ns */
import {
    consoleMessage,
    debugMessage,
    logMessage
} from "/TheDroid/TheDroid-Core.js";

let autoBuyTorRouter = true;
let portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
/** @param {import(".").NS } ns */
export async function main(ns) {
    if (autoBuyTorRouter) ns.purchaseTor();
    while (!ns.fileExists(portBusters[0], "home") || !ns.fileExists(portBusters[1], "home") || !ns.fileExists(portBusters[2], "home") || !ns.fileExists(portBusters[3], "home") || !ns.fileExists(portBusters[4], "home")) {
        for (let i = 0; i < portBusters.length; i++) {
            if (!ns.fileExists(portBusters[i], "home")) {
                consoleMessage(ns, `Purchasing ${portBusters[i]}`)
                ns.purchaseProgram(portBusters[i]);
            }
        }
    }
    consoleMessage(ns, `Purchased all port busters.`)
}