<script lang="ts">
	import Button, { Group, GroupItem, Label, Icon } from '@smui/button';
	import IconButton from '@smui/icon-button';
	import List, { Item, Text } from '@smui/list';
	import Menu from '@smui/menu';
	import Snackbar, { Actions as SnackbarActions, Label as SnackbarLabel } from '@smui/snackbar';
	import { classMap } from '@smui/common/internal';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';

	import { tableI2DState, type ActionType } from './I2DTable.store';

	let menu: Menu;
	let snackbar: Snackbar;
	let filterQuery = '';

	$: showDeleteOption = $tableI2DState.selectedRows.length && !$tableI2DState.action;
	$: actionSelectedItems = $tableI2DState.action?.selectedRows || [];

	const handleClosedStacked = () => {
		const action = $tableI2DState.action;

		if (action) {
			// TODO: make a call to permanent delete
			tableI2DState.update({
				action: undefined
			});
		}
	};

	const executeAction = (action: ActionType) => {
		if (!action) {
			return;
		}

		tableI2DState[action]();

		snackbar.open();
	};

	const onInputChange = (event: CustomEvent<HTMLInputElement>) => {
		const input = event.target as HTMLInputElement;

		if (input) {
			tableI2DState.filterData(input.value);
		}
	};

	const onInputClear = () => {
		filterQuery = '';
		tableI2DState.filterData('');
	};

	const actionsConfig = {
		deleteAll: {
			handler: () => executeAction('deleteAll'),
			aria: `Delete all records (${$tableI2DState.data.length})`,
			label: 'Delete All'
		},
		delete: {
			handler: () => executeAction('delete'),
			aria: 'Delete record',
			label: 'Delete'
		},
		addRecord: {
			handler: () => console.log('Add record'),
			aria: 'Add record',
			label: 'Add record'
		}
	};
</script>

<Paper class="filter-input" elevation={6}>
	<Icon class="material-icons">search</Icon>
	<Input
		bind:value={filterQuery}
		on:input={onInputChange}
		placeholder="Search"
		class="solo-input"
	/>
	<IconButton
		class={classMap({
			'material-icons': true,
			'close-button': true,
			hidden: !filterQuery
		})}
		on:click={onInputClear}
		ripple={false}
	>
		close
	</IconButton>
</Paper>

<div class="action-section">
	<Button
		on:click={actionsConfig.addRecord.handler}
		aria-label={actionsConfig.addRecord.aria}
		variant="raised"
		class="action-button"
	>
		<Label class="hidden-on-mobile">{actionsConfig.addRecord.label}</Label>
		<Icon class="material-icons action-icons mobile">add</Icon>
	</Button>

	<Group variant="raised">
		<Button
			disabled={!showDeleteOption}
			on:click={actionsConfig.delete.handler}
			aria-label={actionsConfig.delete.aria}
			variant="raised"
			class="action-button"
		>
			<Label class="hidden-on-mobile hidden-on-landscape">{actionsConfig.delete.label}</Label>
			<Icon class="material-icons action-icons mobile landscape">delete</Icon>
		</Button>

		<div use:GroupItem>
			<Button
				disabled={!showDeleteOption}
				on:click={() => menu.setOpen(true)}
				variant="raised"
				class="button-group-dropdown"
			>
				<Icon class="material-icons">arrow_drop_down</Icon>
			</Button>

			<Menu bind:this={menu} anchorCorner="TOP_LEFT">
				<List>
					<Item
						disabled={!showDeleteOption}
						on:SMUI:action={actionsConfig.delete.handler}
						aria-label={actionsConfig.delete.aria}
					>
						<Text>{actionsConfig.delete.label}</Text>
					</Item>
					<Item
						disabled={!showDeleteOption}
						on:SMUI:action={actionsConfig.deleteAll.handler}
						aria-label={actionsConfig.deleteAll.aria}
					>
						<Text>{actionsConfig.deleteAll.label}</Text>
					</Item>
				</List>
			</Menu>
		</div>
	</Group>
</div>

<Snackbar bind:this={snackbar} on:SMUISnackbar:closed={handleClosedStacked} leading>
	<SnackbarLabel>You have deleted {actionSelectedItems.length} items.</SnackbarLabel>
	<SnackbarActions>
		<Button action="undo" on:click={tableI2DState.undoAction}>Undo</Button>
		<IconButton action="dismiss" class="material-icons" title="Dissmiss">close</IconButton>
	</SnackbarActions>
</Snackbar>

<style lang="scss">
	@import '../../styles/breakpoints.scss';

	:global(.button-group-dropdown) {
		padding: 0;
		min-width: 36px;

		:global(.material-icons) {
			margin: 0;
		}
	}

	:global(.action-button) {
		padding: 0 var(--gap-small);
		min-width: var(--mdc-protected-button-container-height);
	}

	.action-section {
		display: flex;
		align-items: center;
		gap: var(--gap-medium);
	}

	:global(.filter-input) {
		display: flex;
		align-items: center;
		flex-grow: 1;
		padding: 0 var(--gap-medium);
		height: var(--mdc-protected-button-container-height);
		gap: var(--gap-small);
		max-width: 400px;

		:global(.close-button) {
			margin: 0;
			padding: 0;
			color: var(--mdc-theme-on-surface);
		}

		:global(.solo-input) {
			flex-grow: 1;
			color: var(--mdc-theme-on-surface);

			&::placeholder {
				color: var(--mdc-theme-on-surface);
				opacity: 0.6;
			}
		}
	}

	@media only screen and (max-width: calc($mobileBreakpoint - 1px)) and (orientation: portrait) {
		:global(.mobile) {
			display: flex;
		}

		:global(.hidden-on-mobile) {
			display: none;
		}
	}

	@media only screen and (max-width: calc($mobileBreakpoint - 1px)) and (orientation: landscape) {
		:global(.mobile) {
			display: flex;
		}

		:global(.hidden-on-mobile) {
			display: none;
		}

		:global(.landscape) {
			display: flex;
		}

		:global(.hidden-on-landscape) {
			display: none;
		}
	}
</style>
