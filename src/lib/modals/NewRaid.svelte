<script>
    import { addRaid } from "@/stores/track";
    import Modal from "../Modal.svelte";

    export let showModal;
    export let selected_raid;

    let newName = '';
    let success = true;

    let dialogClose;

    function handleAdd() {
        if(newName) {  
            success = addRaid(newName)

            if(success) {
                selected_raid = newName;
                newName = '';
                dialogClose();
            }
        }
    }
</script>

<Modal bind:showModal bind:close={dialogClose}>
	<h2 slot="header" style="margin: 0">
		New Raid
	</h2>
    <div id="input_container">
        <input bind:value={newName} placeholder="My Awesome Raid" class:invalid={!success}>
    </div>
    <div id="button_container">
        <button on:click={() => handleAdd()}>
            Create
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