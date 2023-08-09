<script lang="ts">
	import IconButton from '@smui/icon-button';
	import Select, { Option } from '@smui/select';
	import { Label } from '@smui/common';
	import { Pagination } from '@smui/data-table';
	import { tableI2DState } from './I2DTable.store';

	const onRowsPerPageUpdate = (event: any) => {
		const clickedItemIndex = event.detail.index || 0;

		tableI2DState.setPageSize($tableI2DState.pageSizes[clickedItemIndex]);
	};

	$: paginationControlsConfig = [
		{
			handler: () => tableI2DState.gotoPage(0),
			aria: 'Go to first page',
			icon: 'first_page',
			action: 'first-page',
			disabled: $tableI2DState.currentPage === 0,
			title: 'First page'
		},
		{
			handler: () => tableI2DState.gotoPage($tableI2DState.currentPage - 1),
			aria: 'Go to previous page',
			icon: 'chevron_left',
			action: 'prev-page',
			disabled: $tableI2DState.currentPage === 0,
			title: 'Prev page'
		},
		{
			handler: () => tableI2DState.gotoPage($tableI2DState.currentPage + 1),
			aria: 'Go to next page',
			icon: 'chevron_right',
			action: 'next-page',
			disabled: $tableI2DState.currentPage === $tableI2DState.lastPage,
			title: 'Next page'
		},
		{
			handler: () => tableI2DState.gotoPage($tableI2DState.lastPage),
			aria: 'Go to last page',
			icon: 'last_page',
			action: 'last-page',
			disabled: $tableI2DState.currentPage === $tableI2DState.lastPage,
			title: 'Last page'
		}
	];
</script>

<Pagination class="image-to-description-table-pagination">
	<svelte:fragment slot="rowsPerPage">
		<div class="pagination-selector">
			<Label>Page size</Label>
			<Select
				variant="outlined"
				value={$tableI2DState.pageSize}
				noLabel
				on:SMUIMenu:selected={onRowsPerPageUpdate}
			>
				{#each $tableI2DState.pageSizes as item}
					<Option value={item}>{item}</Option>
				{/each}
			</Select>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="total">
		{$tableI2DState.pageStart + 1}-{$tableI2DState.pageEnd} of {$tableI2DState.items.length}
	</svelte:fragment>

	{#each paginationControlsConfig as item}
		<IconButton
			class="material-icons"
			aria-label={item.aria}
			action={item.action}
			title={item.title}
			on:click={item.handler}
			disabled={item.disabled}
		>
			{item.icon}
		</IconButton>
	{/each}
</Pagination>
