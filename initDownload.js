/** @param {NS} ns **/
const scriptToLaunch = 'Manager-Startup.js';
const scriptToLaunchThreads = 1;
const launchScript = true;
const usrDirectory = "/TheDroid/";
const scVersion = 1.00;

const baseUrl = 'https://raw.githubusercontent.com/TheDroidYourLookingFor/BitBurner-Scripts/main/'
const filesToDownload = [
  'Manager-Deployment.js',
  'Manager-Hacknet.js',
  'Manager-Server.js',
  'Manager-Startup.js',
  'Manager-Stock.js',
  'HomeRun.js',
  'hack.js',
  'weaken.js',
  'grow.js',
  'aio.js',
  'Distribute.js',
  'Find.js',
  'PollServer.js',
  'SetupNewTargets.js',
  'SetTarget.js',
  'nmap.js',
]
const valuesToRemove = ['BB_SERVER_MAP'];

function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime();
  }

  return new Date(ms).toLocaleTimeString();
}

export async function main(ns) {
  if (launchScript) ns.tprint(`[${localeHHMMSS()}] Starting ` + scriptToLaunch);

  let hostname = ns.getHostname();

  if (hostname !== 'home') {
    throw new Exception('Run the script from home')
  }

  ns.toast("Welcome to Droid Scripts!")
  ns.tprint("Getting started with Droid scripts. Please wait while we download."
    + "\n Version: " + scVersion
    + "\n Quick start information:"
    + "\n run Manager-Startup.js"
    + "\n Please edit Manager-Startup.js if you'd like to take full advantage."
    + "\n The only daemon which will start by default is Manager-Deployment.js."
    + "\n "
    + "\n Manual Start Information:"
    + "\n run nmap.js"
    + "\n find.js"
    + "\n Distribute.js"
    + "\n Run these files in order to probe the network for hosts, write"
    + "\n those hosts to file, evaluate the hosts ranking them, and then"
    + "\n hack any hackable hosts. Once hacked it will copy our Hack, Weaken, and Grow"
    + "\n script to run. It will evenly distribute the three on the host against a target."
    + "\n"
  );

  for (let i = 0; i < filesToDownload.length; i++) {
    const filename = filesToDownload[i]
    const path = baseUrl + filename
    await ns.scriptKill(filename, 'home');
    await ns.rm(filename);
    await ns.sleep(200);
    ns.tprint(`[${localeHHMMSS()}] Trying to download ${path}`);
    await ns.wget(path + '?ts=' + new Date().getTime(), usrDirectory + filename);
  }

  valuesToRemove.map((value) => localStorage.removeItem(value));

  if (launchScript) {
    ns.tprint(`[${localeHHMMSS()}] Spawning ` + scriptToLaunch);
    ns.run(usrDirectory + scriptToLaunch, scriptToLaunchThreads);
  }
}