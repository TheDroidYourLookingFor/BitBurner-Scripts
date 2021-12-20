/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];
  ns.tprint("Hacking " + target + " from " + ns.getHostname());
  while (true) {
    await ns.hack(target);
  }
}