<script>
    import closeIcon from "@/assets/close-square-svgrepo-com.svg";
	export let showModal; // boolean

	let dialog; // HTMLDialogElement

	export const close = () => {if (dialog && showModal) dialog.close()}

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<div on:click|stopPropagation>
        <div style="display: flex">
            <div style="flex: 9">
                <slot name="header" />
            </div>
            <div style="flex: 1">
                <!-- svelte-ignore a11y-autofocus -->
		        <button on:click={() => dialog.close()}>
                    <img src={closeIcon} alt="close">
                </button>
            </div>
        </div>
		
		<hr />
		<slot />		
	</div>
</dialog>

<style lang="scss">
@import "../vars.scss";
	dialog {
        min-width: 32em;
		max-width: 48em;
		border-radius: 1em;
		border: none;
		padding: 0;

        color: $color;
        background-color: $background-color;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
        height: 2rem;
        width: 2rem;
		background-color: transparent;
        border: none;
        cursor: pointer;

        img {
            height: 100%;
        }
	}
</style>