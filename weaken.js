/** @param {NS} ns **/
import {
  userDebug,
  attackSrvWeaken
} from "/TheDroid/TheDroid-Core.js";

/** @param {NS} ns **/
export async function main(ns) {
  const args = ns.flags([['help', false]]);
  if (args.help) {
    ns.tprint("This script will weaken our target automatically.");
    ns.tprint(`USAGE: run ${ns.getScriptName()} TARGET_NAME`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`);
    return;
  }
  const target = ns.args[0];
  const useDebug = userDebug;
  if (useDebug) ns.tprint("Weaken " + target + " from " + ns.getHostname());
  while (true) {
    await attackSrvWeaken(ns, target);
    await ns.asleep(250);
  }
}