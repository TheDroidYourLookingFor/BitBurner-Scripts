/** @param {NS} ns **/
import {
  debugMessage,
  attackSrvHack
} from "/TheDroid/TheDroid-Core.js";

/** @param {NS} ns **/
export async function main(ns) {
  const args = ns.flags([['help', false]]);
  if (args.help) {
    ns.tprint("This script will hack our target automatically.");
    ns.tprint(`USAGE: run ${ns.getScriptName()} TARGET_NAME`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`);
    return;
  }
  const target = ns.args[0];
  debugMessage(ns, "Hacking " + target + " from " + ns.getHostname());
  while (true) {
    await attackSrvHack(ns, target);
    await ns.asleep(250);
  }
}