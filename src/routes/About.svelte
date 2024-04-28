<script>
    import Logo from "@/assets/logo.png";
    import NavBar from "@/lib/NavBar.svelte";
</script>

<NavBar />

<main>
    <section>
        <div class="img_container">
            <img id="main_logo" src={Logo} alt="raidtracker logo">
        </div>
        
        <h1>About RaidTracker</h1>
        <hr>
        <p>
            This tool was made as a funny joke to keep track of wipes in
            raids. Since FFLogs can't truly know who caused a wipe, the stats are 
            entirely tracked by the hoster of the session.
        </p>
        <p>
            Stats are also saved in the browser, meaning if you clear your site-data, 
            you'll lose your data unless you saved an export string.
        </p>
        <p>
            Please don't take this too seriously, it's just a fun visualization tool.
        </p>
        <hr>
    </section>
</main>

<style lang="scss">
@import "../vars.scss";
    main {
        margin: 0 auto;
        max-width: 1280px;

        .img_container {
            display: flex;
            justify-content: center;
        }
        
        #main_logo {
            width: 256px;
        }

        section {
            margin: 1rem;
            padding: 1rem;
            background-color: $secondary-color;
        }
    }
</style>