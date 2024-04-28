import { toast } from "@zerodevx/svelte-toast";
import { writable, get, derived } from "svelte/store";
import { z } from "zod";
import * as idb from 'idb-keyval';
import { JOB_LIST } from "@/lib/FFXIV_Icons.svelte"
import { DUTY_NAMES } from "@/lib/FFXIV_Duties.svelte";

// the names of the raids that we are tracking
// we'll make a new store for each raid
let savedRaids = await idb.get("raids") // a JSON object of type [str...]
const raids = writable(savedRaids ? savedRaids : [])
raids.subscribe(state => idb.set("raids", state))

// export a readable only version of raids, to prevent accidental edits
export const raid_names = derived(raids, $raids => $raids)

// each raid has it's own store
const raidStores = writable({})

// z.enum wants a [string...] but a string[] will work just fine
// @ts-ignore
const JobEnum = z.enum(JOB_LIST)
// @ts-ignore
const DutyListEnum = z.enum(DUTY_NAMES)

const raidStoreSchema = z.object({
    version: z.number().gte(0), // currently on version 1
    start_date: z.string().datetime(),
    end_date: z.nullable(z.string().datetime()),
    duty: DutyListEnum,
    current_wipe: z.number().gte(0), // tracking total wipes
    // name: {
    //      job: "PLD",
    //      wipes: [1, 4, 10]
    // }
    players: z.record(z.string(), z.object({
        job: JobEnum,
        wipes: z.number().array()
    }))
})

function getDefaultRaidStoreState() {
    let currentTime = new Date().toISOString();
    let defaultState = {
        version: 1,
        start_date: currentTime,
        end_date: null,
        current_wipe: 0,
        players: {}
    }

    // check our own default just to make sure we don't break anything when we update the app
    return raidStoreSchema.parse(defaultState)
}

// lets populate it
get(raids).forEach(async raid_name => {
    // get the raid state from local storage
    let savedRaidState = await idb.get("raid-" + raid_name)

    let raidStore = writable(savedRaidState ? savedRaidState : getDefaultRaidStoreState())
    
    raidStores.update(state => {
        // track unsubscribe to delete it on raid delete, so no memory leak
        let unsub = raidStore.subscribe(state => idb.set("raid-" + raid_name, state))
            // put the new store in our big store
        return {
            ...state,
            [raid_name]: {
                store: raidStore,
                unsub: unsub
            }
        }
    })
})

// a function to get each raid store
export function getRaidStore(raid_name) {
    // we have to check by object key because the init population is async
    if(raid_name in get(raidStores)) {
        return get(raidStores)[raid_name].store
    } 

    return null  
}

// what if we want to add/delete raids
// returns true if creation success
// raid_name is a string
export function addRaid(raid_name) {
    if(get(raids).includes(raid_name)) {
        // already exists
        toast.push(`${raid_name} already exists`)
        return false
    }
    // update our tracked raids
    // we put it at the front so that it gets rendered at top of sidebar
    raids.update(state => [raid_name, ...state])
    // give the new raid its own storage
    raidStores.update(state => {
        let raidStore = writable(getDefaultRaidStoreState())

        idb.set('raid-' + raid_name, get(raidStore))

        let unsub = raidStore.subscribe(state => idb.set("raid-" + raid_name, state))

        return {
            ...state,
            [raid_name]: {
                store: raidStore,
                unsub: unsub
            }
        }
    })

    return true
}

// returns true on deletion success
export function deleteRaid(raid_name) {
    if(!get(raids).includes(raid_name)) {
        // doesn't exist
        toast.push(`${raid_name} couldn't be deleted because it doesn't exist`)
        return false
    }

    // delete from tracked names
    let raidsIdx = get(raids).findIndex(raid => raid == raid_name)
    let raidsCpy = get(raids)
    raidsCpy.splice(raidsIdx, 1)
    raids.set(raidsCpy)

    get(raidStores)[raid_name].unsub()

    // delete raid data
    let raidStoresCpy = get(raidStores)
    delete raidStoresCpy[raid_name]
    
    idb.del("raid-" + raid_name)
    toast.push(`${raid_name} successfully deleted`)
    return true
}

// returns true on successful import
// raid_data is a JSON string, imported directly from user clipboard
export function importRaid(raid_name, import_string) {
    if(get(raids).includes(raid_name)) {
        // already exists, make a new name
        toast.push(`${raid_name} already exists`)
        return false
    }
    let imported_data = null;
    try {
        imported_data = JSON.parse(import_string)
    } catch {
        toast.push(`Import failed - Could not parse import string`)
        return false
    }

    let raid_data = null
    try {
        raid_data = raidStoreSchema.parse(imported_data)
    } catch {
        toast.push(`Import failed - Invalid import string`)
        return false
    }

    // update our tracked raids
    raids.update(state => [...state, raid_name])
    // give the new raid its own storage
    raidStores.update(state => {
        let raidStore = writable(raid_data)

        idb.set('raid-' + raid_name, get(raidStore))

        let unsub = raidStore.subscribe(state => idb.set("raid-" + raid_name, state))

        return {
            ...state,
            [raid_name]: {
                store: raidStore,
                unsub: unsub
            }
        }
    })

    return true
}

// exporting of a raid is handled in track component
// this is because we already return the store, and we can stringify it in the component