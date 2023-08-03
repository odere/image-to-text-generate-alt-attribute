<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import { onMount } from 'svelte';

	import I2DTable from '$lib/components/I2DTable/index.svelte';
	import { type Data, fetchData } from '$lib/api/fetch-data';
	import I2DTableToolbar from '$lib/components/I2DTable/I2DTableToolbar.svelte';

	import '$lib/styles/global.scss';

	let data: Data[] = [];
	let selected: number[] = [];
	let fetching = false;
	let topAppBar: TopAppBar;

	onMount(async () => {
		data = await fetchData();
		fetching = true;
	});
</script>

<TopAppBar
	bind:this={topAppBar}
	variant="standard"
	class="header header-container"
	color={'secondary'}
>
	<Row class="header-row content-max-width">
		<Section class="header-title-section">
			<Title>I-2-T</Title>
		</Section>
		<Section class="header-toolbar-section hidden-on-mobile" align="end" toolbar>
			<I2DTableToolbar
				on:undoDeleteAll={() => {
					// Sync binded value
					selected = [];
				}}
			/>
		</Section>
	</Row>

	<Row class="header-row content-max-width mobile">
		<Section class="header-toolbar-section">
			<I2DTableToolbar
				on:undoDeleteAll={() => {
					// Sync binded value
					selected = [];
				}}
			/>
		</Section>
	</Row>
</TopAppBar>

<AutoAdjust {topAppBar} class="main main-container content-max-width">
	<I2DTable {fetching} {data} {selected} />
</AutoAdjust>
