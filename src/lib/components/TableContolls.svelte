<script lang="ts">
	import Icon from '@smui/textfield/icon';
	import IconButton from '@smui/icon-button';
	import Select, { Option } from '@smui/select';
	import Textfield from '@smui/textfield';
	import { Label } from '@smui/common';
	import { Pagination } from '@smui/data-table';
	import { createEventDispatcher } from 'svelte';
	import { classMap } from '@smui/common/internal';

	const dispatch = createEventDispatcher();
	const noop = () => {};

	export let total: number = 0;
	export let currentPage: number = 0;
	export let rowsPerPage: number = 10;
	export let rowsPerPageVariants: number[] = [rowsPerPage, 25, 100];
	export let gotoFirstPage: () => void = noop;
	export let gotoPrevPage: () => void = noop;
	export let gotoNextPage: () => void = noop;
	export let gotoLastPage: () => void = noop;

	let value = '';

	$: start = currentPage * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, total);
	$: lastPage = Math.max(Math.ceil(total / rowsPerPage) - 1, 0);

	const onClear = () => {
		value = '';

		dispatch('onFilter', '');
	};

	$: {
		dispatch('onFilter', value);
	}

	const onRowsPerPageUpdate = (event: any) => {
		const clickedItemIndex = event.detail.index || 0;

		dispatch('onRowsPerPageUpdate', rowsPerPageVariants[clickedItemIndex]);
	};

	const paginationControlsConfig = [
		{
			handler: gotoFirstPage,
			aria: 'Go to first page',
			icon: 'first_page',
			action: 'first-page',
			disabled: currentPage === 0,
			title: 'First page'
		},
		{
			handler: gotoPrevPage,
			aria: 'Go to previous page',
			icon: 'chevron_left',
			action: 'prev-page',
			disabled: currentPage === 0,
			title: 'Prev page'
		},
		{
			handler: gotoNextPage,
			aria: 'Go to next page',
			icon: 'chevron_right',
			action: 'next-page',
			disabled: currentPage === lastPage,
			title: 'Next page'
		},
		{
			handler: gotoLastPage,
			aria: 'Go to last page',
			icon: 'last_page',
			action: 'last-page',
			disabled: currentPage === lastPage,
			title: 'Last page'
		}
	];
</script>

<div class="table-controls-wrapper">
	<Textfield bind:value variant="outlined" class="filter-input">
		<Icon class="material-icons" slot="leadingIcon">filter_alt</Icon>

		<IconButton
			class={classMap({
				'material-icons': true,
				hidden: !value
			})}
			slot="trailingIcon"
			on:click={onClear}
			ripple={false}
			style="height: 36px; padding: 0;"
		>
			close
		</IconButton>
	</Textfield>

	<Pagination class="table-controls__pagination">
		<svelte:fragment slot="rowsPerPage">
			<Label>Rows Per Page</Label>
			<Select
				variant="outlined"
				bind:value={rowsPerPage}
				noLabel
				on:SMUIMenu:selected={onRowsPerPageUpdate}
			>
				{#each rowsPerPageVariants as item}
					<Option value={item}>{item}</Option>
				{/each}
			</Select>
		</svelte:fragment>

		<svelte:fragment slot="total">
			{start + 1}-{end} of {total}
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
</div>

<style>
	.table-controls-wrapper {
		display: flex;
		justify-content: space-between;
		gap: calc(var(--gap) * 4);
		padding: 0 calc(var(--gap) * 4);
		align-items: center;
		border-top: 1px solid rgba(0, 0, 0, 0.12);
	}
</style>
