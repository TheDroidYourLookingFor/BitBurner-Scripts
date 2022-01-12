/** @param {import(".").NS } ns */
import {
    consoleMessage,
    debugMessage,
    logMessage,
    currentHHMMSS
} from "/TheDroid/TheDroid-Core.js";

const settings = {
    keys: {
        crimes: 'BB_CRIMES',
        crimesStop: 'BB_CRIMES_STOP',
    },
    crimes: [
        'shoplift',
        'rob store',
        'mug',
        'larceny',
        'deal drugs',
        'bond forgery',
        'traffick arms',
        'homicide',
        'grand theft auto',
        'kidnap',
        'assassinate',
        'heist',
    ],
    intervalToRecheck: 10 * 60 * 1000,
}

function getItem(key) {
    let item = localStorage.getItem(key)
    return item ? JSON.parse(item) : undefined
}

function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

/** @param {import(".").NS } ns */
function getCrimesData(ns) {
    const crimesCache = getItem(settings.keys.crimes) || {}
    const crimes = {}
    settings.crimes.map((crime) => {
        const chance = ns.getCrimeChance(crime)
        crimes[crime] = {
            ...crimesCache[crime],
            chance
        }
    })
    setItem(settings.keys.crimes, crimes)
    getCrimesData2(ns)
}

/** @param {import(".").NS } ns */
function getCrimesData2(ns) {
    const crimesCache = getItem(settings.keys.crimes) || {}
    const crimes = {}
    settings.crimes.map((crime) => {
        const stats = ns.getCrimeStats(crime)
        crimes[crime] = {
            ...crimesCache[crime],
            stats
        }
    })
    setItem(settings.keys.crimes, crimes)
}

function selectCrime(crimes) {
    const crimesList = Object.keys(crimes)
    crimesList.sort((a, b) => crimes[b].chance - crimes[a].chance)
    const solidChanceCrimes = crimesList.filter((crime) => crimes[crime].chance >= 0.8)
    const topCrimesList = solidChanceCrimes.length > 3 ? solidChanceCrimes : crimesList.slice(0, 2)

    let bestCrime = 'shoplift'
    let bestCrimeWeight = 0

    topCrimesList.forEach((crime) => {
        const crimeWeight =
            crimes[crime].chance *
            (crimes[crime].stats.money / crimes[crime].stats.time) *
            ((crimes[crime].stats.intelligence_exp * 0.1 + 1) / (crimes[crime].stats.intelligence_exp * 0.1 + 2))

        if (crimeWeight > bestCrimeWeight) {
            bestCrime = crime
            bestCrimeWeight = crimeWeight
        }
    })

    return bestCrime
}
/** @param {import(".").NS } ns */
export async function main(ns) {
    logMessage(ns, `[INFO]Starting ${ns.getScriptName()}`)
    ns.tail();
    ns.disableLog("ALL")
    ns.enableLog("commitCrime")

    let hostname = ns.getHostname()

    if (hostname !== 'home') {
        throw new Exception('Run the script from home')
    }

    getCrimesData(ns);

    while (true) {
        let continueCommitingCrime = true
        const crimes = getItem(settings.keys.crimes)

        if (!crimes) {
            getCrimesData(ns)
            return
        }

        const crimeToCommit = selectCrime(crimes)
        const endTime = new Date().getTime() + settings.intervalToRecheck

        while (continueCommitingCrime) {
            const crimesStop = getItem(settings.keys.crimesStop)

            if (crimesStop || new Date().getTime() > endTime) {
                continueCommitingCrime = false
            } else {
                while (ns.isBusy()) {
                    await ns.sleep(100)
                }

                logMessage(ns, `[INFO]Commiting crime: ${crimeToCommit}`)
                ns.commitCrime(crimeToCommit)
                logMessage(ns, `[INFO]Commiting crime operations sleeping until ${currentHHMMSS(crimes[crimeToCommit].stats.time + 5)} on ${ns.getHostname()}.`);
                await ns.sleep(crimes[crimeToCommit].stats.time + 5)
            }
        }

        const crimesStop = getItem(settings.keys.crimesStop)
        if (!crimesStop) {
            getCrimesData(ns)
        } else {
            setItem(settings.keys.crimesStop, false)
        }
        await ns.asleep(250)
    }
}