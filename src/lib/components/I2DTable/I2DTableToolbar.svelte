<script lang="ts">
	import Button, { Group, GroupItem, Label, Icon } from '@smui/button';
	import IconButton from '@smui/icon-button';
	import List, { Item, Text } from '@smui/list';
	import Menu from '@smui/menu';
	import Snackbar, { Actions as SnackbarActions, Label as SnackbarLabel } from '@smui/snackbar';
	import Textfield from '@smui/textfield';
	import { classMap } from '@smui/common/internal';
	import { createEventDispatcher } from 'svelte';
	import HelperText from '@smui/textfield/helper-text';

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
	<div class="filter-input">
		<Textfield bind:value={filterQuery} label="Filter by URL">
			<HelperText slot="helper">Clear to revert filtering</HelperText>
			<IconButton
				class={classMap({
					'material-icons': true,
					hidden: !filterQuery
				})}
				slot="trailingIcon"
				on:click={onClear}
				ripple={false}
			>
				close
			</IconButton>
		</Textfield>
	</div>

	<div class="action-section">
		<Button
			on:click={actionsConfig.addRecord.handler}
			aria-label={actionsConfig.addRecord.aria}
			variant="outlined"
		>
			<Label>{actionsConfig.addRecord.label}</Label>
		</Button>

		<Group variant="outlined">
			<Button
				disabled={!showDeleteOption}
				on:click={actionsConfig.delete.handler}
				aria-label={actionsConfig.delete.aria}
				variant="outlined"
			>
				<Label>{actionsConfig.delete.label}</Label>
			</Button>

			<div use:GroupItem>
				<Button
					disabled={!showDeleteOption}
					on:click={() => menu.setOpen(true)}
					variant="outlined"
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
