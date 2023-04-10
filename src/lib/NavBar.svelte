<script>
    import small_logo from "@/assets/small-logo.png"

    import {location, querystring} from 'svelte-spa-router'
    import { link } from "svelte-spa-router";
</script>

<nav>
    <div>
        <img src={small_logo} alt="logo">
    </div>
    <div class:active={$location.includes("/track")}>
        <a href="/track" use:link>Track</a>
    </div>
    <div class:active={$location.includes("/spec")}>
        <a href="/spec" use:link>Spectate</a>
    </div>
    <div class:active={$location.includes("/about")}>
        <a href="/about" use:link>About</a>
    </div>
</nav>

<style lang="scss">
@import "../vars.scss";
    nav {
        background-color: $secondary-color;
        width: 100vw;
        height: 3.5rem;
        display: inline-flex;
        gap: 0.25rem;

        img {
            height: 2.5rem;
        }

        div {
            display: flex;
            align-self: center;
            padding-left: 1rem;
            padding-right: 1rem;
            font-size: large;
            line-height: 3.5rem;

            a {
                color: $color;

                &:link, &:visited {
                    text-decoration: none;
                }

                &:hover {
                    text-decoration: underline;
                }
            }

            &.active {
                background-color: $background-color;
            }
        }
    }
</style>