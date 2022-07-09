<script type="ts">
let version;
import Form from "./builtins/Form.svelte";
import Titlebar from "./builtins/Titlebar.svelte";
</script>

<Titlebar></Titlebar>
<main>
	<h1>Hello {version}!</h1>
	<Form></Form>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>