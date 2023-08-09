<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import Button, { Label } from '@smui/button';

	import '$lib/styles/global.scss';

	let topAppBar: TopAppBar;
</script>

<TopAppBar bind:this={topAppBar} variant="fixed" class="header header-container" color="secondary">
	<Row class="header-row content-max-width">
		<Section class="header-title-section" align="start">
			<Title class="title">I-2-D</Title>
			<Button color="primary" href="/">
				<Label>Image list</Label>
			</Button>
			<Button color="primary" href="/about">
				<Label>About</Label>
			</Button>
		</Section>
	</Row>
</TopAppBar>

<AutoAdjust {topAppBar} class="main main-container content-max-width">
	<slot />
</AutoAdjust>

<style lang="scss">
	:global(.main.main-container) {
		background-color: var(--background);
		padding: var(--gap-medium);
		margin-top: var(--navigation-header-height);
		box-sizing: border-box;
		height: calc(100vh - var(--navigation-header-height));
		overflow: auto;
	}

	:global(.header-row) {
		height: var(--navigation-header-height);
	}

	:global(.title) {
		margin-right: var(--gap-large);
	}

	:global(.header.header-container) {
		top: 0;
	}
</style>
