<script>
  import Router, { push, replace } from "svelte-spa-router";
  import { wrap } from 'svelte-spa-router/wrap';
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';

  import Track from "@/routes/Track/Track.svelte";
  import Spectate from "./routes/Spectate.svelte";
  import About from "./routes/About.svelte";

  const routes = {
    '/track': Track,
    '/spec': Spectate,
    '/about': About,
    '*': wrap({
      component: About,
      conditions: [
        // we just want to redirect to /track all the time
        (detail) => {
          return false;
        }
      ]
    })
  }

  function conditionsFailed(event) {
        replace('/track')
	}

    function routeLoaded(event) {
	}

  const toastOptions = {
        duration: 3000,
        pausable: true,
        intro: { y: -64 },
        classes: [
            'customToast'
        ]
    };
</script>

<Router {routes} on:conditionsFailed={conditionsFailed} on:routeLoaded={routeLoaded}/>

<div class="toastWrap">
  <SvelteToast options={toastOptions} />
</div>

<style lang="scss">
  .toastWrap {
        flex: 4;

        --toastContainerTop: 0.5rem;
        --toastContainerRight: 36%;
        --toastContainerBottom: auto;
        --toastContainerLeft: 36%;
        --toastWidth: 100%;
        --toastMinHeight: 40px;
        // --toastHeight: 40px;
        // --toastMsgPadding: 0.35rem 0.25rem;
        --toastPadding: 0 0.5rem;
        --toastBarHeight: 3px;
        // when working with double dash vars, add #{}
        // --toastBarBackground: #{c(accent)};
    }
</style>
