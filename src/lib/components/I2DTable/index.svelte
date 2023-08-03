<script lang="ts">
	// TODO: Include table controls into navigation menu
	// TODO: Create modal to edit data
	// TODO: Create new mock for data
	import Checkbox from '@smui/checkbox';
	import DataTable, { Head, Body, Row, Cell, SortValue } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import LinearProgress from '@smui/linear-progress';
	import { Image } from '@smui/image-list';
	import { Label as ButtonLabel } from '@smui/button';

	import I2DTablePagination from '$lib/components/I2DTable/I2DTablePagination.svelte';
	import I2DTableToolbar from '$lib/components/I2DTable/I2DTableToolbar.svelte';
	import type { Data } from '$lib/api/fetch-data';
	import { tableI2DState, type PageSize } from './I2DTable.store';

	export let data: Data[] = [];
	export let fetching = false;

	let selected: number[] = [];
	let sort: keyof Data = 'title';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

	$: {
		if (data.length !== $tableI2DState.data.length) {
			tableI2DState.init({ data });
		}
	}

	const onRowsPerPageUpdate = (event: CustomEvent<PageSize>) => {
		tableI2DState.setPageSize(event.detail);
	};

	const onCheckboxChange = (event: CustomEvent<HTMLInputElement>) => {
		const checkbox = event.target as HTMLInputElement;
		if (checkbox) {
			tableI2DState.toggleSelectedRow(parseInt(checkbox.value, 10));
		}
	};
</script>

<I2DTableToolbar
	on:undoDeleteAll={() => {
		// Sync binded value
		selected = [];
	}}
/>

<DataTable
	sortable
	bind:sort
	bind:sortDirection
	on:SMUIDataTable:sorted={() => {
		tableI2DState.sortPageItems(sort, sortDirection);
	}}
	table$aria-label="Image to description table"
	class="full-width image-to-description-table"
>
	<Head>
		<Row>
			<Cell checkbox>
				<Checkbox on:change={tableI2DState.toggleSelectedAllRows} />
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
				<Cell checkbox>
					<Checkbox
						bind:group={selected}
						value={item.id}
						valueKey={`${item.id}`}
						on:change={onCheckboxChange}
					/>
				</Cell>

				<Cell>
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

	<I2DTablePagination slot="paginate" on:onRowsPerPageUpdate={onRowsPerPageUpdate} />
</DataTable>
