<script lang="ts">
	import Button, { Group, GroupItem, Label, Icon } from '@smui/button';
	import IconButton from '@smui/icon-button';
	import List, { Item, Text } from '@smui/list';
	import Menu from '@smui/menu';
	import Snackbar, { Actions as SnackbarActions, Label as SnackbarLabel } from '@smui/snackbar';
	import { classMap } from '@smui/common/internal';
	import { createEventDispatcher } from 'svelte';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';

	import { tableI2DState, type Actions } from './I2DTable.store';

	const dispatch = createEventDispatcher();

	let menu: Menu;
	let snackbar: Snackbar;
	let filterQuery = '';

	$: itemsToDelete =
		$tableI2DState.itemsPreviousState.length - $tableI2DState.items.length ||
		$tableI2DState.data.length;

	$: showDeleteOption = $tableI2DState.selectedRows.length;

	$: {
		tableI2DState.filterData(filterQuery);
	}

	const handleClosedStacked = () => {
		tableI2DState.update({
			executedAction: undefined
		});
	};

	const executeAction = (action: Actions) => {
		if ($tableI2DState.executedAction) {
			return;
		}

		tableI2DState[action]();

		snackbar.open();
	};

	const onClear = () => {
		filterQuery = '';
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

<div class="image-to-description-table__toolbar">
	<Paper class="filter-input" elevation={6}>
		<Icon class="material-icons">search</Icon>
		<Input bind:value={filterQuery} placeholder="Search" class="solo-input" />
		<IconButton
			class={classMap({
				'material-icons': true,
				'close-button': true,
				hidden: !filterQuery
			})}
			on:click={onClear}
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
				<Label class="hidden-on-mobile">{actionsConfig.delete.label}</Label>
				<Icon class="material-icons action-icons mobile">delete</Icon>
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
</div>

<Snackbar bind:this={snackbar} on:SMUISnackbar:closed={handleClosedStacked}>
	<SnackbarLabel>You have deleted {itemsToDelete} items.</SnackbarLabel>
	<SnackbarActions>
		<Button
			action="undo"
			on:click={() => {
				tableI2DState.undoAction();
				// Sync binded value
				dispatch('undoDeleteAll');
			}}>Undo</Button
		>
		<IconButton action="dismiss" class="material-icons" title="Dissmiss">close</IconButton>
	</SnackbarActions>
</Snackbar>
