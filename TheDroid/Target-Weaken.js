/** @param {import(".").NS } ns */
import {
  consoleMessage,
  logMessage,
  debugMessage,
  currentHHMMSS,
  attackSrvWeaken
} from "/TheDroid/TheDroid-Core.js";
/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.enableLog("weaken");
  const args = ns.flags([
    ['help', false]
  ]);
  if (args.help) {
    ns.tprint("This script will weaken our target automatically.");
    ns.tprint(`USAGE: run ${ns.getScriptName()} TARGET_NAME`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`);
    return;
  }
  const target = ns.args[0];
  logMessage(ns, `[INFO]Weaken operations sleeping until ${currentHHMMSS(ns.args[1])} on ${ns.getHostname()}.`);
  await ns.sleep(ns.args[1]);
  logMessage(ns, `[INFO]Weaken operations started against ${target} from ${ns.getHostname()}.`);
  await attackSrvWeaken(ns, target);
  logMessage(ns, `[INFO]Weaken operations completed against ${target} from ${ns.getHostname()}.`);
}