<script lang="ts">
	import Checkbox from '@smui/checkbox';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import LinearProgress from '@smui/linear-progress';
	import { Image } from '@smui/image-list';
	import { onMount } from 'svelte';

	import type { Data, ImagePayload } from '$lib/types';

	import I2DTablePagination from './I2DTablePagination.svelte';
	import { tableI2DState } from './I2DTable.store';

	export let data: Data;
	export let fetched: boolean | undefined = false;

	$: allSelected = $tableI2DState.allSelected;
	$: selected = $tableI2DState.selectedRows;

	onMount(() => {
		const { action, data: storeData } = $tableI2DState;
		const { items = [], data: dataPayload = {} } = data || {};

		if (items.length !== storeData.length && !action) {
			tableI2DState.init({ data: items.map((id) => dataPayload[id]) as ImagePayload[] });
		}

		fetched = true;
	});

	const onCheckboxChange = (seldcgtedItems?: string[]) => {
		const selectedRows = seldcgtedItems || selected;
		const isIndeterminateState = selectedRows.length !== $tableI2DState.pageSize;

		if (isIndeterminateState) {
			tableI2DState.update({
				allSelected: null,
				selectedRows
			});

			return;
		}

		if (!selected.length) {
			tableI2DState.update({
				allSelected: false,
				selectedRows
			});

			return;
		}

		tableI2DState.update({
			allSelected: true,
			selectedRows
		});
	};

	const onCheckClick = (itemID: string) => {
		const item = selected.find((id) => id === itemID);

		if (item) {
			onCheckboxChange(selected.filter((id) => id !== itemID));
			return;
		}

		onCheckboxChange([...selected, itemID]);
	};

	const onAllCheckboxChange = (event: CustomEvent<HTMLInputElement>) => {
		const checkbox = event.target as HTMLInputElement;

		if (checkbox) {
			const checked = checkbox.checked;
			const isIndeterminateState = selected.length && selected.length !== $tableI2DState.pageSize;

			if (isIndeterminateState || checked) {
				tableI2DState.update({
					allSelected: false,
					selectedRows: []
				});

				return;
			}

			tableI2DState.update({
				allSelected: true,
				selectedRows: $tableI2DState.pageItems.map(({ id }) => id)
			});
		}
	};
</script>

<div class="root">
	<DataTable table$aria-label="Image to description table" class="i2d-table">
		<Head>
			<Row>
				<Cell sortable={false}>
					<Checkbox
						on:change={onAllCheckboxChange}
						bind:checked={allSelected}
						indeterminate={allSelected === null}
					/>
				</Cell>

				<Cell columnId="id">ID</Cell>

				<Cell sortable={false}>Preview</Cell>

				<Cell columnId="corrected_description">Description</Cell>

				<Cell columnId="url">URL</Cell>
			</Row>
		</Head>

		<Body>
			{#each $tableI2DState.pageItems as item (item.id)}
				<Row>
					<Cell on:click={() => onCheckClick(item.id)}>
						<Checkbox
							bind:group={selected}
							value={item.id}
							valueKey={item.id}
							on:change={() => onCheckboxChange()}
						/>
					</Cell>

					<Cell on:click={() => onCheckClick(item.id)}>
						{item.id}
					</Cell>

					<Cell>
						<Image
							class="image-preview"
							src={item.url || 'https://placehold.co/64x64?text=square'}
							alt="Image placeholder"
						/>
					</Cell>

					<Cell class="full-width long-text-cell">
						{item.corrected_description}
					</Cell>

					<Cell class="url-cell long-text-cell">
						{item.url}
					</Cell>
				</Row>
			{/each}
		</Body>

		<LinearProgress
			slot="progress"
			indeterminate
			aria-label="Data is being loaded..."
			bind:closed={fetched}
		/>

		<I2DTablePagination slot="paginate" />
	</DataTable>
</div>

<style lang="scss">
	@import '../../styles/breakpoints.scss';

	.root {
		display: flex;
		justify-content: center;
		margin-top: var(--navigation-header-height);
		max-height: calc(100vh - var(--gap-medium) - (var(--navigation-header-height) * 2));

		:global(.i2d-table) {
			width: 100%;
		}
	}

	:global(.image-preview) {
		width: auto;
		height: 64px;
		display: inherit;
		margin: var(--gap) 0;
	}

	:global(.long-text-cell) {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(tbodY) {
		max-width: calc(100vw - var(--gap-medium) * 2);
	}

	:global(.url-cell) {
		max-width: 35vw;
	}

	@media only screen and (max-width: calc($mobileBreakpoint - 1px)) {
		:global(table) {
			font-size: 0.5em;
		}

		:global(.mdc-data-table__cell),
		:global(.mdc-data-table__header-cell) {
			padding: 0 var(--gap);
		}
	}

	@media only screen and (min-width: $mobileBreakpoint) and (max-width: calc($tabletBreakpoint - 1px)) {
		:global(table) {
			font-size: 0.75em;
		}

		:global(.mdc-data-table__cell),
		:global(.mdc-data-table__header-cell) {
			padding: 0 var(--gap-small);
		}
	}

	@media only screen and (min-width: $desktopBreakpoint) {
		:global(table) {
			font-size: 1em;
		}

		:global(.mdc-data-table__cell),
		:global(.mdc-data-table__header-cell) {
			padding: 0 var(--gap-medium);
		}
	}
</style>
