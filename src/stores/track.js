import { toast } from "@zerodevx/svelte-toast";
import { writable, get } from "svelte/store";
import { z } from "zod";

// the names of the raids that we are tracking
// we'll make a new store for each raid
let savedRaids = JSON.parse(localStorage.getItem("raids")) // a JSON object of type [str...]
const raids = writable(savedRaids ? savedRaids : [])
raids.subscribe(state => localStorage.setItem("raids", JSON.stringify(state)))

// each raid has it's own store
const raidStores = writable({})

const raidStoreSchema = z.object({
    start_date: z.string().datetime(),
    end_date: z.nullable(z.string().datetime()),
    total_wipes: z.number().gte(0),
    wipe_reasons: z.object({
        unknown: z.number().gte(0), // you literally don't know
        everybody: z.number().gte(0), // multiple people messed up / everyone messed up, generally you can blame mulitple people at once
        nobody: z.number().gte(0), // excusable reason, lag, car crashes into power pole outside
        players: z.record(z.string(), z.number().gte(0)) 
    })
})

function getDefaultRaidStoreState() {
    let currentTime = new Date().toISOString();
    return {
        start_date: currentTime,
        end_date: null,
        total_wipes: 0,
        wipe_reasons: {
            unknown: 0,
            everybody: 0,
            nobody: 0,
            players: {}
        }
    }
}

// lets populate it
get(raids).foreach(raid_name => {
    raidStores.update(state => {
        // get the raid state from local storage
        let savedRaidState = JSON.parse(localStorage.getItem("raid-"+ raid_name))

        // create our store and update local storage on store update
        let raidStore = writable(savedRaidState ? savedRaidState : getDefaultRaidStoreState())
        // track unsubscribe to delete it on raid delete, so no memory leak
        let unsub = raidStore.subscribe(state => localStorage.setItem("raid-" + raid_name, JSON.stringify(state)))

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
    if(raid_name in get(raidStores)) {
        return get(raidStores)[raid_name].store
    } 

    return null  
}

// what if we want to add/delete raids
// returns true if creation success
// raid_name is a string
export function addRaid(raid_name) {
    // we can either use $raids.include, or if the name is a key in raid stores
    if(raid_name in get(raidStores)) {
        // already exists
        toast.push(`${raid_name} already exists`)
        return false
    }
    // update our tracked raids
    raids.update(state => [...state, raid_name])
    // give the new raid its own storage
    raidStores.update(state => {
        // create our store and update local storage on store update
        let raidStore = writable(getDefaultRaidStoreState())
        // check to see if we can make raids, and init local storage
        try {
            localStorage.setItem('raid-' + raid_name, JSON.stringify(get(raidStore)))
        } catch (e) {
            toast.push("Could not create new raid, either enable local storage or remove some raids")
            return false
        }
        let unsub = raidStore.subscribe(state => localStorage.setItem("raid-" + raid_name, JSON.stringify(state)))

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
    if(!(raid_name in get(raidStores))) {
        // doesn't exist
        toast.push(`${raid_name} couldn't be deleted because it doesn't exist`)
        return false
    }

    // delete from tracked names
    let raidsIdx = get(raids).findIndex(raid => raid == raid_name)
    let raidsCpy = get(raids)
    raidsCpy.splice(raidsIdx, 1)
    raids.set(raidsCpy)

    // unsubscribe local storage update for raid data
    get(raidStores)[raid_name].unsub()

    // delete raid data
    let raidStoresCpy = get(raidStores)
    delete raidStoresCpy[raid_name]
    
    // delete local storage entry
    localStorage.removeItem("raid-" + raid_name)

    return true
}

// returns true on successful import
// raid_data is a JSON string, imported directly from user clipboard
export function importRaid(raid_name, import_string) {
    if(raid_name in get(raidStores)) {
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
        // create our store and update local storage on store update
        let raidStore = writable(raid_data)
        // check to see if we can make raids, and init local storage
        try {
            localStorage.setItem('raid-' + raid_name, JSON.stringify(get(raidStore)))
        } catch (e) {
            toast.push("Could not create new raid, either enable local storage or remove some raids")
            return false
        }
        let unsub = raidStore.subscribe(state => localStorage.setItem("raid-" + raid_name, JSON.stringify(state)))

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