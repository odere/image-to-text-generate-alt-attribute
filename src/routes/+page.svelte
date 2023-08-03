<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import { onMount } from 'svelte';

	import I2DTable from '$lib/components/I2DTable/index.svelte';
	import { type Data, fetchData } from '$lib/api/fetch-data';
	import I2DTableToolbar from '$lib/components/I2DTable/I2DTableToolbar.svelte';

	import '$lib/styles/global.scss';

	let data: Data[] = [];
	let fetching = false;
	let topAppBar: TopAppBar;

	onMount(async () => {
		data = await fetchData();
		fetching = true;
	});
</script>

<TopAppBar
	bind:this={topAppBar}
	variant="fixed"
	class="header header-container"
	color={'secondary'}
>
	<!-- Depend on media query HTML element would be displayed none -->
	<Row class="header-row content-max-width">
		<Section class="header-title-section">
			<Title>I-2-T</Title>
		</Section>
		<Section class="header-toolbar-section hidden-on-mobile landscape" align="end" toolbar>
			<I2DTableToolbar />
		</Section>
	</Row>

	<!-- TODO: use resize observer to prevent component rendering -->
	<!-- Depend on media query HTML element would be displayed none -->
	<Row class="header-row content-max-width mobile hidden-on-landscape">
		<Section class="header-toolbar-section">
			<I2DTableToolbar />
		</Section>
	</Row>
</TopAppBar>

<AutoAdjust {topAppBar} class="main main-container content-max-width">
	<I2DTable {fetching} {data} />
</AutoAdjust>
