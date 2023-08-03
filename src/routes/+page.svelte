<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import { onMount } from 'svelte';

	import '$lib/styles/global.scss';
	import I2DTable from '$lib/components/I2DTable/index.svelte';
	import { type Data, fetchData } from '$lib/api/fetch-data';

	let data: Data[] = [];
	let fetching = false;
	let topAppBar: TopAppBar;

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
	</Row>
</TopAppBar>

<AutoAdjust {topAppBar} class="main main-container content-max-width">
	<I2DTable {fetching} {data} />
</AutoAdjust>
