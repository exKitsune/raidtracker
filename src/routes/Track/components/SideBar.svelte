<script>
    import import_svg from "@/assets/import-svgrepo-com.svg";
  import ImportRaid from "@/lib/modals/ImportRaid.svelte";
  import NewRaid from "@/lib/modals/NewRaid.svelte";

    export let saved_raids;
    export let selected_raid;

    let showNewRaidModal = false;
    let showImportRaidModal = false;
</script>

<nav>
    <div id="button_container">
        <button id="new_raid_button" on:click={() => showNewRaidModal = true}>Track New Raid</button>
        <button id="import_raid_button" on:click={() => showImportRaidModal = true}>
            <img src={import_svg} alt="import">
        </button>
    </div>
    <hr>
    
    {#each saved_raids as saved_raid}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class:active={selected_raid === saved_raid}
        on:click={() => {selected_raid = saved_raid}}
        >
        {saved_raid}
    </div>
    <hr>
    {/each}
</nav>

<NewRaid bind:showModal={showNewRaidModal} bind:selected_raid />
<ImportRaid bind:showModal={showImportRaidModal} bind:selected_raid />

<style lang='scss'>
@import "../../../vars.scss";
    nav {
        height: calc(100vh - $navbar-height);
        background-color: $tertiary-color;
        border-right: 3px solid $tertiary-color;
        border-left: 3px solid $tertiary-color;
        overflow-y: auto;
        // hide scrollbars
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        &::-webkit-scrollbar {
            display: none;
        }

        hr {
            height: 3px;
            background-color: $background-color;
            border: none;
            margin: 0;
        }

        #button_container {
            width: 90%;
            height: 2rem;
            margin: 1rem 5% 1rem 5%;
            display: flex;

            button {
                background-color: $accent-color;
                border: none;
                color: white;
                cursor: pointer;

                &:hover {
                    background-color: darken($accent-color, 10%);
                }
            }
            #new_raid_button {              
                flex: 7; 
                border-radius: 100px 0 0 100px;
                border-right: 2px solid $tertiary-color;
            }

            #import_raid_button {
                flex: 3;
                border-radius: 0 100px 100px 0;
                
                img {
                    height: 1rem;
                }
            }
        }
        

        div:not(#button_container) {
            min-height: 4rem;
            
            padding: 0.25rem;
            padding-left: 1rem;
            padding-right: 1rem;

            word-break: break-all;

            display: flex;
            justify-content: center;
            align-content: center;
            flex-direction: column;

            &.active {
                background-color: $background-color;
                border-left: 0.5rem solid $theme-color;
            }

            &:hover:not(.active) {
                cursor: pointer;
                background-color: lighten($background-color, 10%)
            }
        }
    }
</style>