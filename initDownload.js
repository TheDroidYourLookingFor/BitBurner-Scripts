/** @param {NS} ns **/
const scriptToLaunch = 'Manager-Startup.js';
const scriptToLaunchThreads = 1;
const launchScript = true;
const usrDirectory = "/TheDroid/";
const scVersion = 1.00;

const baseUrl = 'https://raw.githubusercontent.com/TheDroidYourLookingFor/BitBurner-Scripts/main/'
const filesToDownload = [
  'TheDroid-Core.js',
  'Manager-Contracts.js',
  'Manager-CustomStats.js',
  'Manager-Deployment.js',
  'Manager-Hacknet.js',
  'Manager-Home.js',
  'Manager-ProfitGraph.js',
  'Manager-Prep.js',
  'Manager-Server.js',
  'Manager-Snow.js',
  'Manager-Startup.js',
  'Manager-Stock.js',
  'Manager-Windows.js',
  'Target-Hack.js',
  'Target-Weaken.js',
  'Target-Grow.js',
  'PollServer.js',
  'RunOnAll.js'
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
    ns.tprint(`[${localeHHMMSS()}] Spawning ` + usrDirectory + scriptToLaunch);
    ns.run(usrDirectory + scriptToLaunch, scriptToLaunchThreads);
  }
}