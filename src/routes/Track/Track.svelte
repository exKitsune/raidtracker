<script>
  import NavBar from "@/lib/NavBar.svelte";
  import SideBar from "@/routes/Track/components/SideBar.svelte";

  import {raid_names} from "@/stores/track";
  import RaidTracker from "./components/RaidTracker.svelte";

  let selected_raid = '';
</script>

<NavBar />

<main>
  <div id="sidebar_container">
    <SideBar saved_raids={$raid_names} bind:selected_raid/>
  </div>
  <div id="track_container">
    <RaidTracker selected_raid={selected_raid}/>
  </div>
</main>


<style lang="scss">
  main {
    display: flex;

    #sidebar_container {
      flex: 1.5;
      min-width: 15rem;
    }

    #track_container {
      flex: 8.5;
    }
  }
</style>