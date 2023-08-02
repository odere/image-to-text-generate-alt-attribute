<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import Fab, { Icon } from '@smui/fab';
	import { onMount } from 'svelte';

	import '$lib/styles/global.scss';
	import I2DTable from '$lib/components/I2DTable/index.svelte';
	import { type Data, fetchData } from '$lib/api/fetch-data';

	let data: Data[] = [];
	let fetching = false;
	let topAppBar: TopAppBar;

	const toolbarActionsConfig = [
		{
			handler: () => console.log('delete_forever'),
			aria: `Delete all records (${data.length})`,
			icon: 'delete_forever'
		},
		{
			handler: () => console.log('Delete record'),
			aria: 'Delete record',
			icon: 'delete'
		},
		{
			handler: () => console.log('Add record'),
			aria: 'Add record',
			icon: 'add'
		}
	];

	onMount(async () => {
		data = await fetchData();
		fetching = true;
	});
</script>

<TopAppBar bind:this={topAppBar} variant="standard" class="header header-container">
	<Row class="header-row content-max-width">
		<Section class="header-title-section">
			<Title>I-2-T</Title>
		</Section>

		<Section align="end" toolbar class="header-toolbar-section">
			{#each toolbarActionsConfig as item}
				<Fab mini aria-label={item.aria} color="primary" on:click={item.handler}>
					<Icon class="material-icons">{item.icon}</Icon>
				</Fab>
			{/each}
		</Section>
	</Row>
</TopAppBar>

<AutoAdjust {topAppBar} class="main main-container content-max-width">
	<I2DTable {fetching} {data} />
</AutoAdjust>
