<script>
    import { fly, slide } from 'svelte/transition';
    import { getRaidStore, deleteRaid } from "@/stores/track";
    import {subStore} from "immer-loves-svelte"
    import Player from "./Player.svelte";
    import addIcon from "@/assets/add-square-svgrepo-com.svg";
    import AddPlayer from "@/lib/modals/AddPlayer.svelte";

    export let selected_raid;

    $: raid = getRaidStore(selected_raid)

    $: start_date = new Date($raid?.start_date)
    $: end_date = $raid?.end_date ? new Date($raid?.end_date) : null;
    $: player_wipes = raid ? subStore(raid, r => r["players"]) : null;

    $: raid_finished = end_date !== null;
    $: days_elapsed = raid_finished ? 
                        ((end_date.getTime() - start_date.getTime()) / 1000 / 60 / 60 / 24).toFixed(2) :
                        ((new Date().getTime() - start_date.getTime()) / 1000 / 60 / 60 / 24).toFixed(2)
    
    $: current_wipe = raid ? $raid.current_wipe : 0;
    let sum = (r, a) => r.map((b, i) => a[i] + b);
    $: total_player_wipes = (player_wipes && Object.keys($player_wipes).length > 0) ? Object.values($player_wipes).reduce(sum) : 0;
    $: best_player = (player_wipes && Object.keys($player_wipes).length > 0) ? calculateBestPlayer() : 'Yoshi P';

    function calculateBestPlayer() {
        let minWipes = Infinity;
        let bestPlayer = '';
        for(const [player, wipes] of Object.entries($player_wipes)) {
            if(wipes.length < minWipes) {
                bestPlayer = player
                minWipes = wipes.length
            }
        }

        return bestPlayer
    }

    let finishRaidState = 0; // 0 for not yet clicked, 1 for show confirm
    function finishRaid() {
        switch(finishRaidState) {
            case 0:
                finishRaidState = 1;
                break;
            case 1:
                finishRaidState = 0;
                $raid.end_date = new Date().toISOString();
                break;
        }
        
    }

    let deleteRaidState = 0; // 0 for not yet clicked, 1 for show confirm
    function handleDeleteRaid() {
        switch(deleteRaidState) {
            case 0:
                deleteRaidState = 1;
                break;
            case 1:
                deleteRaidState = 0;
                deleteRaid(selected_raid)
                selected_raid = '';
                break;
        }
        
    }

    // show management buttons
    let showManagement = false;

    // New wipe, time to blaming
    let newWipe = false;

    // if selected raid changes, reset vars
    $: if(selected_raid) { newWipe = false; showManagement = false }

    let showAddPlayerModal = false;
</script>

<main>
    {#if selected_raid && raid}
    <section>
        <div style="flex: 7">
            <h1 id="title">{selected_raid}</h1>
            <div style="display: flex">
                <div style="flex: 4">
                    <div>
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <label class="date_label">start date 🔰</label>
                        <h3 class="date">{new Intl.DateTimeFormat().format(start_date)}</h3>
                        <h4 class="time">{new Intl.DateTimeFormat('en-US', {hour: "numeric", minute: "numeric", second: "numeric"}).format(start_date)}</h4>
                    </div>
                    {#if end_date}
                    <div>
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <label class="date_label">end date 🏁</label>
                        <h3 class="date">{new Intl.DateTimeFormat().format(end_date)}</h3>
                        <h4 class="time">{new Intl.DateTimeFormat('en-US', {hour: "numeric", minute: "numeric", second: "numeric"}).format(end_date)}</h4>
                    </div>
                    {/if}
                </div>
                <div style="flex: 6" id="stats_container">
                    ✨ stats at a glance ✨
                    <hr>
                    <div style="display: flex">
                        <div style="flex: 1">
                            <p>Days Elapsed 🕒</p>
                            <h1>{days_elapsed}</h1>
                        </div>
                        <div style="flex: 1">
                            <p>Total Wipes 🧻</p>
                            <h1>{current_wipe}</h1>
                        </div>
                        <div style="flex: 1">
                            <p>Best Player 🏆</p>
                            <h1>{best_player}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="flex: 3" id="management_container">
            <!-- Switch between management or wipe button -->
            <div>
                <button class="management" on:click={() => showManagement = !showManagement}>{showManagement ? "Hide" : "Show"} Settings</button>
            </div>
            {#if showManagement}
            <div id="management_buttons_container" transition:slide>
                <div>
                    {#if finishRaidState === 0}
                        <button class="finish_button" disabled={raid_finished} on:click={finishRaid}>Finish Raiding</button>
                    {:else if finishRaidState === 1}
                        <div class="confirm">
                            <button class="confirm_finish_button" on:click={finishRaid} in:fly|local="{{ x: 100, duration: 500}}">Finish</button>
                            <button class="cancel_finish_button" on:click={() => finishRaidState = 0} in:fly|local="{{ x: -100, duration: 500}}">Cancel</button>
                        </div>
                    {/if}
                </div>
                <div>
                    {#if deleteRaidState === 0}
                        <button class="delete_button" on:click={handleDeleteRaid}>Delete Raid</button>
                    {:else if deleteRaidState === 1}
                        <div class="confirm">
                            <button class="delete_button" on:click={handleDeleteRaid} in:fly|local="{{ x: 100, duration: 500}}">Delete</button>
                            <button class="cancel_delete_button" on:click={() => deleteRaidState = 0} in:fly|local="{{ x: -100, duration: 500}}">Cancel</button>
                        </div>
                    {/if}
                </div>
            </div>
            {:else}
            <div id="wipe_button_container" transition:slide>
                {#if newWipe}
                <button id="confirm_wipe_button">
                    <h1>Confirm</h1>
                </button>
                <button id="cancel_wipe_button" on:click={() => {newWipe = false}}>
                    Cancel
                </button>
                {:else}
                <button id="new_wipe_button" on:click={() => {newWipe = true}}>
                    <h1>New Wipe!</h1>
                </button>
                {/if}
            </div>
            {/if}
        </div>
    </section>
    <section>
        <div id="player_container">
            {#if player_wipes}
                {#each Object.keys($player_wipes) as player}
                <Player {player} wipe_store={subStore(player_wipes, p => p[player])} />
                {/each}
            {/if}

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div id="add_new_player" on:click={() => showAddPlayerModal = true}>
                <img src={addIcon} alt="add new player">
            </div>
        </div>
    </section>
    {:else}
    <section>
        <h1>Please select/create a raid</h1>
    </section>
    {/if}
</main>

<AddPlayer bind:showModal={showAddPlayerModal} bind:player_wipes />

<style lang="scss">
@import "../../../vars.scss";
    main {
        margin: 2rem;
        margin-top: 1rem;

        overflow-y: auto;
        // hide scrollbars
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        &::-webkit-scrollbar {
            display: none;
        }

        #title {
            padding: 1rem;
            background-color: $background-color;
        }
        
        .date {
            margin-top: 0;
            margin-bottom: 0;
        }
        .time {
            margin-top: 0;
            padding-left: 3rem;
        }
        .date, .time {  
            &::before {
                content: '';
                transform: translateY(-50%);
                width: 4rem;
                height: 5px;
                display: inline-block;
                background-color: $background-color;
                margin-right: 10px;
            }
        }

        #stats_container {
            text-align: center;
        }

        #management_container {

            #management_buttons_container {
                border-radius: 10px;
                background-color: $tertiary-color;
                display: block;
            }

            div {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                button {
                    background-color: $accent-color;
                    border: none;
                    color: white;
                    cursor: pointer;
                    min-width: 10rem;
                    width: 60%;
                    max-width: 40rem;
                    height: 2rem;
                    margin: 1rem;
                    border-radius: 100px;

                    &:disabled {
                        cursor: default;
                        background: repeating-linear-gradient(
                                    45deg,
                                    #838282,
                                    #838282 10px,
                                    #4d4d4d 10px,
                                    #4d4d4d 20px
                                    );
                    }

                    &.management {
                        background-color: grey;

                        &:hover {
                            background-color: darken(grey, 10%);
                        }
                    }

                    &.new_wipe_button {
                        height: 10rem;
                        width: 100%;
                        border-radius: 10px;
                    }

                    &.finish_button {
                        height: 4rem;

                        &:hover {
                            background-color: darken($accent-color, 10%);
                        }
                    }

                    &.delete_button {
                        height: 2rem;
                        background-color: $theme-color;

                        &:hover {
                            background-color: darken($theme-color, 10%);
                        }
                    }

                    &.confirm_finish_button {
                        height: 4rem;

                        &:hover {
                            background-color: darken($accent-color, 10%);
                        }
                    }

                    &.cancel_finish_button {
                        height: 4rem;
                        background-color: grey;

                        &:hover {
                            background-color: darken(grey, 10%);
                        }
                    }

                    &.cancel_delete_button {
                        background-color: grey;

                        &:hover {
                            background-color: darken(grey, 10%);
                        }
                    }
                }
            }

            #wipe_button_container {
                display: flex;
                flex-grow: 1;

                #confirm_wipe_button {
                    flex: 8;
                    width: 100%;
                    
                    border-radius: 1rem;
                }

                #cancel_wipe_button {
                    flex: 2;
                    background-color: grey;
                }
                
                #new_wipe_button {
                    height: 100%;
                    width: 100%;

                    border-radius: 1rem;
                }
            }
            
        }

        #player_container {
            display: flex;
            gap: 2rem;

            #add_new_player {
                min-width: 12rem;
                height: 20rem;
                border: 4px solid $tertiary-color;
                cursor: pointer;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                &:hover {
                    background-color: darken($secondary-color, 5%);
                }

                img {
                    height: 30%;
                }
            }
        }

        section {
            background-color: $secondary-color;
            padding: 2rem;
            margin-bottom: 1rem;
            display: flex;
            gap: 1rem;
        }
    }
</style>