<script>
import { data } from "../data/localStore.js";
let name;
$: {
    data.naym=name
};

</script>

<p>{JSON.stringify($data)}</p>
{name}
<input bind:value={name}/>