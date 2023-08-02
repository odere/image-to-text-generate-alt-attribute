<script lang="ts">
	import Button, { Label as ButtonLabel } from '@smui/button';
	import Checkbox from '@smui/checkbox';
	import DataTable, { Head, Body, Row, Cell, SortValue } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import LinearProgress from '@smui/linear-progress';
	import { Image } from '@smui/image-list';
	import Snackbar, { Actions, Label as SnackbarLabel } from '@smui/snackbar';

	import TableContolls from '$lib/components/TableContolls.svelte';
	import type { Data } from '$lib/api/fetch-data';

	// TODO: Optimize deletion
	// TODO: permament delete sent request
	export let items: Data[] = [];
	export let rowsPerPage = 5;
	export let rowsPerPageVariants = [rowsPerPage, 25, 100];
	export let currentPage = 0;
	export let loaded = false;

	let action: 'delete' | 'delete-all' | undefined;
	let deletingIsPending = false;
	let filterStr = '';
	let previosItems: Data[] = [];
	let previouSelected: number[] = [];
	let selected: number[] = [];
	let snackbar: Snackbar;
	let sort: keyof Data = 'title';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';
	let tableItems: Data[] = [];

	$: {
		tableItems = items.filter((item) => item.title.includes(filterStr));
	}

	$: {
		selected = rowsPerPage < selected.length ? selected.slice(0, rowsPerPage) : selected;
	}

	$: start = currentPage * rowsPerPage;

	$: end = Math.min(start + rowsPerPage, tableItems.length);

	$: pageItems = tableItems.slice(start, end);

	$: lastPage = Math.max(Math.ceil(tableItems.length / rowsPerPage) - 1, 0);

	$: if (currentPage > lastPage) {
		currentPage = lastPage;
	}

	const handleClosedStacked = (event: CustomEvent<{ reason: string | undefined }>) => {
		deletingIsPending = false;
		action = undefined;
	};

	// Sort only string properties
	const handleSort = () => {
		pageItems = pageItems.sort((a, b) => {
			const getOrderedArray = () => {
				const aValue = a[sort];
				const bValue = b[sort];

				if (sortDirection === 'ascending') {
					return [aValue, bValue];
				}

				return [bValue, aValue];
			};

			const [aVal, bVal] = getOrderedArray();

			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return aVal.localeCompare(bVal);
			}

			return Number(aVal) - Number(bVal);
		});
	};

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

	const onRowsPerPageUpdate = (event: CustomEvent<number>) => {
		rowsPerPage = event.detail;
	};

	const onFilter = (event: CustomEvent<string>) => {
		filterStr = event.detail;
	};

	const onUndo = () => {
		if (action === 'delete') {
			tableItems = [...previosItems];
			selected = [...previouSelected];
		}

		if (action === 'delete-all') {
			tableItems = [...items];
		}

		action = undefined;
	};

	const gotoFirstPage = () => {
		selected = [];
		currentPage = 0;
	};

	const gotoPrevPage = () => {
		selected = [];
		currentPage--;
	};

	const gotoNextPage = () => {
		selected = [];
		currentPage++;
	};

	const gotoLastPage = () => {
		selected = [];
		currentPage = lastPage;
	};
</script>

<Snackbar bind:this={snackbar} on:SMUISnackbar:closed={handleClosedStacked} timeoutMs={10000}>
	<SnackbarLabel>You have deleted {previosItems.length - tableItems.length} items.</SnackbarLabel>
	<Actions>
		<Button action="undo" on:click={onUndo}>Undo</Button>
		<IconButton action="dismiss" class="material-icons" title="Dissmiss">close</IconButton>
	</Actions>
</Snackbar>

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

			<Cell sortable={false}>Thumbnails</Cell>

			<Cell columnId="title" class="full-width">
				<ButtonLabel>URL</ButtonLabel>
				<IconButton class="material-icons">arrow_upward</IconButton>
			</Cell>

			<Cell sortable={false}>
				<IconButton class="my-colored-icon-button material-icons" on:click={onDelete}>
					delete
				</IconButton>
				<IconButton class="my-colored-icon-button material-icons" on:click={onDeleteAll}>
					delete_forever
				</IconButton>
			</Cell>
		</Row>
	</Head>

	<Body>
		{#each pageItems as item (item.id)}
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

				<Cell>{item.title} - {item.id}</Cell>

				<Cell />
			</Row>
		{/each}
	</Body>

	<LinearProgress
		slot="progress"
		indeterminate
		aria-label="Data is being loaded..."
		bind:closed={loaded}
	/>

	<TableContolls
		slot="paginate"
		on:onFilter={onFilter}
		on:onRowsPerPageUpdate={onRowsPerPageUpdate}
		total={tableItems.length}
		{currentPage}
		{gotoFirstPage}
		{gotoLastPage}
		{gotoNextPage}
		{gotoPrevPage}
		{rowsPerPageVariants}
		{rowsPerPage}
	/>
</DataTable>
