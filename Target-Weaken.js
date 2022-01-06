/** @param {NS} ns **/
import {
  consoleMessage,
  logMessage,
  debugMessage,
  attackSrvWeaken
} from "/TheDroid/TheDroid-Core.js";
/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("ALL");
  const args = ns.flags([['help', false]]);
  if (args.help) {
    ns.tprint("This script will weaken our target automatically.");
    ns.tprint(`USAGE: run ${ns.getScriptName()} TARGET_NAME`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`);
    return;
  }
  const target = ns.args[0];
  await ns.sleep(ns.args[1]);
  logMessage(ns, `[INFO]Weaken operations started against ${target} from ${ns.getHostname()}.`);
  await attackSrvWeaken(ns, target);
  logMessage(ns, `[INFO]Weaken operations completed against ${target} from ${ns.getHostname()}.`);
}