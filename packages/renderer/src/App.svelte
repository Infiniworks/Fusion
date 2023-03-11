<script lang="ts">
	import Login from "$comps/Login.svelte";
	import "carbon-components-svelte/css/g100.css";
	import { onMount } from "svelte";
	import Container from "./components/Container.svelte";
	import { ContentSwitcher, Switch } from "carbon-components-svelte";

	import { get } from 'svelte/store';
	import { data } from "$data/localStore.js";

	let globalData = get(data);

	let selectedIndex = 0;
	let selectedPack = 0;

	onMount(async ()=> {
		console.log(await window.please.get("clients"));
	})

	$: data.update((thing) => thing = globalData);

	const getClients = async () => {
		const clients = await window.please.get("clients");
		console.log(clients);
		return clients;
	}
</script>

<main class="font-medium lining-nums">
	{#await getClients() then clients}
	<div class="dragBar"></div>
	<div class="topBar">
		<div class="title">
			Fusion Client
		</div>
		<div class="gameName">
			{clients[selectedPack].pack_data.name}
		</div>
		<div class="login">
			<Login globalData/>
		</div>
	</div>
	<span class="mainPage">
		<div class="leftBar">
				{#each clients as client, i}
					<div class="client {selectedPack == i ? "selected" : ""}" >
						<button on:click={
							()=>console.log("heiy")
						}>
						</button>

						<button class="element" on:click={
							()=>{
								selectedPack = i;
							}
						}>
							{client.pack_data.name}
							{client.pack_data.version}
						</button>
						
					</div>
				{/each}
		</div>
		<span class="actualPage">
			<ContentSwitcher bind:selectedIndex>
				<Switch text="Launch Menu" />
				<Switch text="Mods" />
				<Switch text="Settings" />
			</ContentSwitcher>
			<Container globalData selectedPack={selectedPack} profileData={clients[selectedPack]} selectedIndex={selectedIndex}></Container>
		</span>
	</span>
	{/await}
</main>

<style>
	.title {
		font-size: 40px;
		font-weight: bold;
		letter-spacing: -1.25px;
		color:  #f7f7f7;
		text-shadow: 0 0.1em 0.2em rgba(94, 94, 94, .35);
		flex: 3;
	}
	.login {
		flex: 4
	}
	.gameName {
		flex: 6;
	}
	.selected {
		background-color: rgb(146, 146, 146) !important; 
	}
	.client {
		background-color: rgb(31, 31, 31);
		display: flex;
		flex-direction: row;
		margin-bottom: 5px;
		padding: 15px;
	}
	main {
		height: 100%;
		width: 100%;
		background-color: rgb(0, 55, 255);
		display: flex;
		flex-direction: column;
	}
	.dragBar {
		-webkit-app-region: drag;
		flex: 0.3;
		background-color: dimgrey;
	}
	.topBar {
		z-index:10;
		flex: 1;
		display:flex;
		align-items: center;
		padding: 8px;
	}
	.leftBar {
		/* -webkit-app-region: drag; */
		flex: 1;
		overflow: hidden;
		max-width: 270px;
	}
	.mainPage {
		flex: 8;
		background-color: rgb(0, 155, 103);
		display: flex;
	}
	.actualPage {
		flex: 4;
		background-color: rgb(44, 44, 44);
		display: flex;
		flex-direction: column;
	}
	:global(.bx--list-box__menu-item, .bx--list-box__menu-item__option) {
		height: auto;
	}
</style>