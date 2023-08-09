<script lang="ts">
	// TODO: Create modal to edit data
	// TODO: Create new mock for data
	import Checkbox from '@smui/checkbox';
	import DataTable, { Head, Body, Row, Cell, SortValue } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import LinearProgress from '@smui/linear-progress';
	import { Image } from '@smui/image-list';
	import { Label as ButtonLabel } from '@smui/button';

	import type { Data } from '$lib/api/fetch-data';

	import I2DTablePagination from './I2DTablePagination.svelte';
	import { tableI2DState, type PageSize } from './I2DTable.store';

	export let data: Data[] = [];
	export let fetching = false;

	let sort: keyof Data = 'title';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

	$: allSelected = $tableI2DState.allSelected;
	$: selected = $tableI2DState.selectedRows;

	$: {
		if (data.length !== $tableI2DState.data.length && !$tableI2DState.action) {
			tableI2DState.init({ data });
		}
	}

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

	const onSort = () => {
		tableI2DState.sortPageItems(sort, sortDirection);
	};
</script>

<div class="root">
	<DataTable
		sortable
		bind:sort
		bind:sortDirection
		on:SMUIDataTable:sorted={onSort}
		table$aria-label="Image to description table"
		class="content-max-width i2d-table"
	>
		<Head>
			<Row>
				<Cell>
					<Checkbox
						on:change={onAllCheckboxChange}
						bind:checked={allSelected}
						indeterminate={allSelected === null}
					/>
				</Cell>

				<Cell sortable={false}>Preview</Cell>

				<Cell columnId="title" class="full-width">
					<ButtonLabel>URL</ButtonLabel>
					<IconButton class="material-icons">arrow_upward</IconButton>
				</Cell>
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
						<Image
							class="image-preview"
							src="https://placehold.co/64x64?text=square"
							alt="Image placeholder"
						/>
					</Cell>

					<Cell class="full-width long-text-cell">
						{item.id} -- {item.title} https://shared.cdn.smp.schibsted.com/v2/images/02f62bd3-4a13-4c79-b718-0b75a2f611b0?fit=crop&h=1425&w=1900&s=f4d7a442348f73d8085928d2a9caa7ee7ad1002b
					</Cell>
				</Row>
			{/each}
		</Body>

		<LinearProgress
			slot="progress"
			indeterminate
			aria-label="Data is being loaded..."
			bind:closed={fetching}
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
			width: calc(100% - var(--gap-medium) * 2);
		}
	}

	:global(.image-preview) {
		width: auto;
		display: inherit;
		margin: var(--gap) 0;
	}

	:global(.long-text-cell) {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100px;
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
