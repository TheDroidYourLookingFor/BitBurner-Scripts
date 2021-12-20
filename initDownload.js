/** @param {NS} ns **/
const scriptToLaunch = 'Manager-Startup.js';
const scriptToLaunchThreads = 1;
const launchScript = true;
const usrDirectory = "/TheDroid/";

async function loadConfig(ns) {
  var userConfig = await ns.read(usrDirectory + "userConfig.awesome").split("\r\n");
  for (var i = 0; i < userConfig.length; ++i) {
    var userData = userConfig[i].split(',');
    if (userData.length < 18) break;
    var curVersion = userData[1];
    var outputDir = userData[3];
    var autoManageHacking = userData[5];
    var autoManageHackNet = userData[7];
    var autoManageHackNetNodes = userData[9];
    var autoManageStock = userData[11];
    var autoManageServers = userData[13];
    var autoManageServersRam = userData[15];
    var autoManageHomeSrv = userData[17];

    usrDirectory = outputDir;
  }
}
loadConfig(ns);

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