<script lang="ts">

  // TODO: Use multydelete button
  // TODO: Move filter field to navigation
  // TODO: Create modal to edit data
  // TODO: Create new mock for data
	import Button, { Label as ButtonLabel } from '@smui/button';
	import Checkbox from '@smui/checkbox';
	import DataTable, { Head, Body, Row, Cell, SortValue } from '@smui/data-table';
	import Icon from '@smui/textfield/icon';
	import IconButton from '@smui/icon-button';
	import LinearProgress from '@smui/linear-progress';
	import Snackbar, { Actions, Label as SnackbarLabel } from '@smui/snackbar';
	import Textfield from '@smui/textfield';
	import { Image } from '@smui/image-list';
	import { classMap } from '@smui/common/internal';

	import I2DTablePagination from '$lib/components/I2DTable/I2DTablePagination.svelte';
	import type { Data } from '$lib/api/fetch-data';
	import { tableI2DState, type PageSize } from './I2DTable.store';

	export let data: Data[] = [];
	export let fetching = false;

	let action: 'delete' | 'delete-all' | undefined;
	let deletingIsPending = false;
	let previosItems: Data[] = [];
	let previouSelected: number[] = [];
	let selected: number[] = [];
	let snackbar: Snackbar;
	let sort: keyof Data = 'title';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';
	let tableItems: Data[] = [];

	$: {
		if (data.length) {
			tableI2DState.init({ data });
		}
	}

  // TODO: check selection with deletion
	$: {
		// tableI2DState.selectRows(selected);
		// selected = $tableI2DState.selectedRows;
	}

	const handleClosedStacked = (event: CustomEvent<{ reason: string | undefined }>) => {
		deletingIsPending = false;
		action = undefined;
	};

	// Sort only string properties
	const handleSort = () => {
		tableI2DState.sortPageItems(sort, sortDirection);
	};

  // TODO: fix delete
	const onDelete = () => {
		if (deletingIsPending) {
			return;
		}

		deletingIsPending = true;
		previosItems = [...tableItems];
		tableItems = tableItems.filter(({ id }) => !selected.includes(id));
		previouSelected = [...selected];
		selected = [];
		action = 'delete';

		snackbar.open();
	};

  // TODO: fix delete
	const onDeleteAll = () => {
		if (deletingIsPending) {
			return;
		}

		deletingIsPending = true;
		tableItems = [];
		selected = [];
		action = 'delete-all';

		snackbar.open();
	};

	const onRowsPerPageUpdate = (event: CustomEvent<PageSize>) => {
		tableI2DState.setPageSize(event.detail);
	};

	const onUndo = () => {
		if (action === 'delete') {
			tableItems = [...previosItems];
			selected = [...previouSelected];
		}

		if (action === 'delete-all') {
			tableItems = [...data];
		}

		action = undefined;
	};

	let filterQuery = '';

	const onClear = () => {
		filterQuery = '';
	};

	$: {
		tableI2DState.filterData(filterQuery);
	}
</script>

<Snackbar bind:this={snackbar} on:SMUISnackbar:closed={handleClosedStacked} timeoutMs={10000}>
	<SnackbarLabel>You have deleted {previosItems.length - tableItems.length} items.</SnackbarLabel>
	<Actions>
		<Button action="undo" on:click={onUndo}>Undo</Button>
		<IconButton action="dismiss" class="material-icons" title="Dissmiss">close</IconButton>
	</Actions>
</Snackbar>

<Textfield bind:value={filterQuery} variant="outlined" class="filter-input">
	<Icon class="material-icons" slot="leadingIcon">filter_alt</Icon>

	<IconButton
		class={classMap({
			'material-icons': true,
			hidden: !filterQuery
		})}
		slot="trailingIcon"
		on:click={onClear}
		ripple={false}
		style="height: 36px; padding: 0;"
	>
		close
	</IconButton>
</Textfield>

<DataTable
	sortable
	bind:sort
	bind:sortDirection
	on:SMUIDataTable:sorted={handleSort}
	table$aria-label="Image to description table"
	class="full-width image-to-description-table"
>
	<Head>
		<Row>
			<Cell sortable={false} checkbox>
				<Checkbox />
			</Cell>

			<Cell sortable={false}>Preview</Cell>

			<Cell columnId="title" class="full-width">
				<ButtonLabel>URL</ButtonLabel>
				<IconButton class="material-icons">arrow_upward</IconButton>
			</Cell>

			<!-- <Cell sortable={false}>
				<IconButton class="my-colored-icon-button material-icons" on:click={onDelete}>
					delete
				</IconButton>
				<IconButton class="my-colored-icon-button material-icons" on:click={onDeleteAll}>
					delete_forever
				</IconButton>
			</Cell> -->
		</Row>
	</Head>

	<Body>
		{#each $tableI2DState.pageItems as item (item.id)}
			<Row>
				<Cell checkbox>
					<Checkbox bind:group={selected} value={item.id} valueKey={`${item.id}`} />
				</Cell>

				<Cell>
					<Image
						class="image-preview"
						src="https://placehold.co/64x64?text=square"
						alt="Image placeholder"
					/>
				</Cell>

				<Cell class="full-width long-text-cell">
					https://shared.cdn.smp.schibsted.com/v2/images/02f62bd3-4a13-4c79-b718-0b75a2f611b0?fit=crop&h=1425&w=1900&s=f4d7a442348f73d8085928d2a9caa7ee7ad1002b
					{item.title} - {item.id}
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
