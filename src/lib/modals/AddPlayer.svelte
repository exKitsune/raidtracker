<script>
    import {subStore} from "immer-loves-svelte"
    import Modal from "../Modal.svelte";
    import { toast } from "@zerodevx/svelte-toast";

    export let showModal;
    export let player_wipes;

    let player_name = '';
    let success = true;

    let dialogClose;

    function handleAdd() {
        if(player_name) {
            if(player_name in Object.keys($player_wipes)) {
                toast.push("Player name already exists in this raid!")
                success = false
            } else {
                let playerStore = subStore(player_wipes, p => p[player_name])
                playerStore.set([])
                player_name = '';
                success = true
                dialogClose()
            }
        }
    }
</script>

<Modal bind:showModal bind:close={dialogClose}>
	<h2 slot="header" style="margin: 0">
		Add Player
	</h2>
    <div id="input_container">
        <input bind:value={player_name} placeholder="Mr. Final Fantasy" class:invalid={!success}>
    </div>
    <div id="button_container">
        <button on:click={() => handleAdd()}>
            Add
        </button>
    </div>
</Modal>

<style lang="scss">
@import "../../vars.scss";

    #input_container {
        margin: 3rem;

        input {
            font-size: large;
            width: calc(100% - 1rem);
            height: 2rem;
            border-radius: 100px;
            margin-left: -1rem;
            padding-left: 1rem;
            padding-right: 1rem;
            color: $color;
            background-color: $tertiary-color;

            &:focus {
                outline: none;
            }

            &.invalid {
                outline: red solid 2px;
            }
        }
    }

    #button_container {
        display: flex;
        flex-direction: row-reverse;

        button {
            color: $color;
            font-size: larger;
            background-color: $accent-color;
            border: 1px solid lighten($accent-color, 10%);
            border-radius: 100px;
            
            height: 2rem;
            width: 8rem;

            cursor: pointer;

            &:hover {
                background-color: darken($accent-color, 10%);
                border: 1px solid lighten($accent-color, 0%);
            }
        }
    }
</style>