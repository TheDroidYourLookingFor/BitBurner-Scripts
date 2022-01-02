/** @param {NS} ns **/
import {
	consoleMessage,
	debugMessage,
	probeNetwork
} from "/TheDroid/TheDroid-Core.js";
/** @param {NS} ns **/
export async function main(ns) {
	let serverList = probeNetwork(ns);
	for (const svHost of serverList) {
		ns.killall(svHost.hostname);
	}
}