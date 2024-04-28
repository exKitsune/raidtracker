<script>

    export let selected_raid;
</script>

<main>
    <section>
        bruh
    </section>
</main>


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

        section {
            background-color: $secondary-color;
            padding: 2rem;
        }
    }
</style>