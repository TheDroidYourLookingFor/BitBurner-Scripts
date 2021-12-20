/** @param {NS} ns **/
const scriptToLaunch = 'Manager-Startup.js';
const scriptToLaunchThreads = 1;

const baseUrl = 'https://raw.githubusercontent.com/TheDroidYourLookingFor/BitBurner-Scripts/main/'
const filesToDownload = [
  'Manager-Deployment.js',
  'Manager-Hacknet.js',
  'Manager-Server.js',
  'Manager-Startup.js',
  'Maanger-Stock.js',
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
const valuesToRemove = ['BB_SERVER_MAP']

function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime()
  }

  return new Date(ms).toLocaleTimeString()
}

export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting ` + scriptToLaunch)

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Exception('Run the script from home')
  }

  for (let i = 0; i < filesToDownload.length; i++) {
    const filename = filesToDownload[i]
    const path = baseUrl + filename
    await ns.scriptKill(filename, 'home')
    await ns.rm(filename)
    await ns.sleep(200)
    ns.tprint(`[${localeHHMMSS()}] Trying to download ${path}`)
    await ns.wget(path + '?ts=' + new Date().getTime(), filename)
  }

  valuesToRemove.map((value) => localStorage.removeItem(value))

  ns.tprint(`[${localeHHMMSS()}] Spawning ` + scriptToLaunch)
  ns.spawn(scriptToLaunch, scriptToLaunchThreads)
}