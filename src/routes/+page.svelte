<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import Fab, { Icon } from '@smui/fab';
	import { onMount } from 'svelte';

	import '$lib/styles/css-variables.scss';
	import '$lib/styles/global.scss';
	import ImageToDescriptionTable from '$lib/components/ImageToDescriptionTable.svelte';
	import { type Data, fetchData } from '$lib/api/fetch-data';

	let data: Data[] = [];
	let loaded = false;
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
		loaded = true;
	});
</script>

<TopAppBar bind:this={topAppBar} variant="fixed" dense>
	<Row>
		<Section>
			<Title>Image to description (AI)</Title>
		</Section>

		<Section align="end" toolbar class="navigation-toolbar">
			{#each toolbarActionsConfig as item}
				<Fab mini aria-label={item.aria} color="primary" on:click={item.handler}>
					<Icon class="material-icons">{item.icon}</Icon>
				</Fab>
			{/each}
		</Section>
	</Row>
</TopAppBar>

<AutoAdjust {topAppBar} class="page-container container-max-width">
	<ImageToDescriptionTable
		rowsPerPage={25}
		rowsPerPageVariants={[5, 25, 100]}
		currentPage={0}
		{loaded}
		items={data}
	/>
</AutoAdjust>
