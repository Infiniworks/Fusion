<script>
import { data } from "../data/localStore.js";
let name;
$: {
    data.naym=name
};

</script>
<h1>Warning... this page may contain sensitive information...</h1>
<main>
    {JSON.stringify($data)}<br>
    {name}
    <input bind:value={name}/>
</main>


<style>
    main {
        word-break: break-all;
        overflow-y: scroll;
        font-size: 13px;
    }
</style>