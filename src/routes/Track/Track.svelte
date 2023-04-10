<script>
  import NavBar from "@/lib/NavBar.svelte";
  import SideBar from "@/routes/Track/components/SideBar.svelte";


</script>

<NavBar />

<main>
  <div id="sidebar_container">
    <SideBar />
  </div>
  <div id="track_container">
    track
  </div>
</main>


<style lang="scss">
  main {
    display: flex;

    #sidebar_container {
      flex: 2;
    }

    #track_container {
      flex: 8;
    }
  }
</style>