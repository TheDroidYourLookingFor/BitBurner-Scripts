/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];
  const useDebug = false;
  if (useDebug) ns.tprint("Growing " + target + " from " + ns.getHostname());
  while (true) {
    await ns.grow(target);
  }
}