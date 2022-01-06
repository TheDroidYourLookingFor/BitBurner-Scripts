/** @param {NS} ns **/
import {
  consoleMessage,
  logMessage,
  debugMessage,
  attackSrvGrow
} from "/TheDroid/TheDroid-Core.js";
/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("all");
  const args = ns.flags([['help', false]]);
  if (args.help) {
    ns.tprint("This script will grow our target automatically.");
    ns.tprint(`USAGE: run ${ns.getScriptName()} TARGET_NAME`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`);
    return;
  }
  const target = ns.args[0];
  await ns.sleep(ns.args[1]);
  logMessage(ns, `[INFO]Grow operations started against ${target} from ${ns.getHostname()}.`);
  await attackSrvGrow(ns, target);
  logMessage(ns, `[INFO]Grow operations completed against ${target} from ${ns.getHostname()}.`);
}