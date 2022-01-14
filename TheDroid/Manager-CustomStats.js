/** @param {import(".").NS } ns */
import {
	consoleMessage,
	debugMessage,
	lookForBestTarget,
	probeNetwork
} from "/TheDroid/TheDroid-Core.js";
/** @param {import(".").NS } ns */
export async function main(ns) {
    const args = ns.flags([
        ["help", false]
    ]);
    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const useDebug = false;
    if (useDebug) ns.tail();
    const usrDirectory = "/TheDroid/";
    const doc = eval("document");
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');
    const hook2 = doc.getElementById('Target-hook-1');
    const hook3 = doc.getElementById('Karma-hook-1');

    while (true) {
        try {
            let serverList = probeNetwork(ns);
			let targName = await lookForBestTarget(ns, serverList)
            const headers = []
            const values = [];
            // Add script income per second
            headers.push("Income:");
            values.push(ns.nFormat(ns.getScriptIncome()[0].toPrecision(5), '$0.0a') + '/s');
            // Add script exp gain rate per second
            headers.push("Exp:");
            values.push(ns.nFormat(ns.getScriptExpGain().toPrecision(5), '0.0a') + '/s');
            // Add target
            headers.push("Target:");
            values.push(targName);
            // Add karma
            headers.push("Karma:");
            values.push(ns.nFormat(ns.heart.break(), '0.0a'));
            // TODO: Add more neat stuff

            // Now drop it into the placeholder elements
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
            hook2.innerText = values.join("\n");
            hook3.innerText = values.join("\n");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
}