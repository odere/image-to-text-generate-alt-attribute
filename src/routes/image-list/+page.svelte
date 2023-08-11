<script lang="ts">
	import { Row, Section } from '@smui/top-app-bar';

	import I2DTable from '$lib/components/I2DTable/index.svelte';
	import I2DTableToolbar from '$lib/components/I2DTable/I2DTableToolbar.svelte';
	import type { Data } from '$lib/types';

	export let data: Data;
</script>

<Row class="header-row table-toolbar">
	<Section class="header-toolbar-section content-max-width">
		<I2DTableToolbar />
	</Section>
</Row>

<I2DTable {data} />

<style lang="scss">
	@import '../../lib/styles/breakpoints.scss';

	/* Override parent component styles */
	:global(.main.main-container) {
		height: unset;
		overflow: unset;
		max-width: unset;
		margin: 0;
		padding: 0;
		padding-top: var(--navigation-header-height);
	}

	:global(.header-toolbar-section) {
		display: flex;
		gap: var(--gap-medium);
		padding: var(--gap-small) 0;
		background: var(--background);
		justify-content: space-between;
	}

	:global(.table-toolbar) {
		position: fixed;
		top: var(--navigation-header-height);
		z-index: 100;
		background-color: var(--background);
		padding: var(--gap-small) var(--gap-medium);
		width: 100%;

		:global(.mobile) {
			display: none;
		}
	}

	@media only screen and (max-width: calc($mobileBreakpoint - 1px)) {
		:global(.table-toolbar) {
			:global(.mobile.material-icons) {
				display: inline-block;
				margin: 0;
			}
		}
	}
</style>
