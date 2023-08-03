import { writable } from 'svelte/store';
import type { Data } from '$lib/api/fetch-data';
import type { SortValue } from '@smui/data-table';

export type PageSize = 10 | 25 | 50 | 100;
export type Actions = 'delete' | 'deleteAll';

export interface TableState {
	currentPage: number;
	data: Data[];
	executedAction?: Actions;
	items: Data[];
	itemsPreviousState: Data[];
	lastPage: number;
	pageEnd: number;
	pageItems: Data[];
	pageSize: PageSize;
	pageSizes: PageSize[];
	pageStart: number;
	selectedRows: number[];
	selectedRowsPreviousState: number[];
}

export const defaultI2DState: TableState = {
	data: [],
	items: [],
	itemsPreviousState: [],
	pageItems: [],
	currentPage: 0,
	executedAction: undefined,
	lastPage: 0,
	pageEnd: 0,
	pageSize: 10,
	pageSizes: [10, 25, 100],
	pageStart: 0,
	selectedRows: [],
	selectedRowsPreviousState: []
};

const createCount = () => {
	const { subscribe, set, update } = writable<TableState>(defaultI2DState);

	return {
		subscribe,
		update: (props: Partial<TableState>) => {
			if (!Object.keys(props).length) {
				return;
			}

			return update((state) => {
				console.debug('tableI2DState:update', { ...props });

				return {
					...state,
					...props
				};
			});
		},
		toggleSelectedRow: (selectedID: number) =>
			update((state) => {
				const { selectedRows } = state;

				const isSelected = selectedRows.includes(selectedID);
				let updateState: Partial<TableState> = {};

				if (isSelected) {
					updateState = {
						selectedRows: selectedRows.filter((id) => id !== selectedID)
					};
				} else {
					updateState = {
						selectedRows: [...selectedRows, selectedID].sort()
					};
				}

				console.debug('tableI2DState:toggleSelectedAllRows', updateState);

				return {
					...state,
					...updateState
				};
			}),
		toggleSelectedAllRows: () =>
			update((state) => {
				const { selectedRows, pageItems } = state;

				let updateState: Partial<TableState> = {
					selectedRows: []
				};

				if (selectedRows.length !== pageItems.length) {
					updateState = {
						selectedRows: pageItems.map(({ id }) => id).sort()
					};
				}

				console.debug('tableI2DState:toggleSelectedAllRows', updateState);

				return {
					...state,
					...updateState
				};
			}),
		setPageSize: (size: PageSize) =>
			update((state) => {
				const { pageStart, items } = state;

				const pageEnd = Math.min(pageStart + size, items.length);
				const lastPage = Math.max(Math.ceil(items.length / size) - 1, 0);
				const pageItems = items.slice(pageStart, pageEnd);

				const updateState: Partial<TableState> = {
					pageSize: size,
					lastPage,
					pageEnd,
					pageItems
				};

				console.debug('tableI2DState:setPageSize', updateState);

				return {
					...state,
					...updateState
				};
			}),
		sortPageItems: (
			propertyToSort: keyof Data,
			sortDirection: Lowercase<keyof typeof SortValue> = 'ascending'
		) =>
			update((state) => {
				if (!state.pageItems.length) {
					return state;
				}

				const pageItems = state.pageItems.sort((a, b) => {
					const getOrderedArray = () => {
						const aVal = a[propertyToSort];
						const bVal = b[propertyToSort];

						if (sortDirection === 'ascending') {
							return [aVal, bVal];
						}

						return [bVal, aVal];
					};

					const [aVal, bVal] = getOrderedArray();

					if (typeof aVal === 'string' && typeof bVal === 'string') {
						return aVal.localeCompare(bVal);
					}

					return Number(aVal) - Number(bVal);
				});

				console.debug('tableI2DState:sortPageItems', { pageItems });

				return {
					...state,
					pageItems
				};
			}),
		filterData: (query = '') =>
			update((state) => {
				const { pageSize, pageStart, data } = state;

				if (!data.length) {
					return state;
				}

				const items = data.filter((item) => item.title.includes(query));
				const pageEnd = Math.min(pageStart + pageSize, items.length);
				const lastPage = Math.max(Math.ceil(items.length / pageSize) - 1, 0);
				const pageItems = items.slice(pageStart, pageEnd);

				const updateState: Partial<TableState> = {
					items,
					lastPage,
					pageEnd,
					pageItems
				};

				console.debug('tableI2DState:filterData', updateState);

				return {
					...state,
					...updateState
				};
			}),
		selectRows: (rows: number[]) =>
			update((state) => {
				const { pageSize } = state;

				const selectedRows = pageSize < rows.length ? rows.slice(0, pageSize) : rows;

				console.debug('tableI2DState:selectRows', { selectedRows });

				return {
					...state,
					selectedRows
				};
			}),
		undoAction: () =>
			update((state) => {
				const {
					data,
					itemsPreviousState,
					selectedRowsPreviousState,
					executedAction,
					pageStart,
					pageEnd
				} = state;

				let updateState: Partial<TableState> = {
					executedAction: undefined
				};

				if (executedAction === 'delete') {
					updateState = {
						...updateState,
						items: [...itemsPreviousState],
						itemsPreviousState: [...data],
						pageItems: itemsPreviousState.slice(pageStart, pageEnd),
						selectedRows: [...selectedRowsPreviousState],
						selectedRowsPreviousState: []
					};
				}

				if (executedAction === 'deleteAll') {
					updateState = {
						...updateState,
						items: [...data],
						itemsPreviousState: [...data],
						pageItems: data.slice(pageStart, pageEnd),
						selectedRows: [],
						selectedRowsPreviousState: []
					};
				}

				console.debug('tableI2DState:undoAction', updateState);

				return {
					...state,
					...updateState
				};
			}),
		delete: () =>
			update((state) => {
				const { selectedRows, items, pageStart, pageSize } = state;

				const updatedItems = items.filter(({ id }) => !selectedRows.includes(id));
				const pageEnd = Math.min(pageStart + pageSize, updatedItems.length);

				const updateState: Partial<TableState> = {
					executedAction: 'delete',
					items: updatedItems,
					itemsPreviousState: [...items],
					pageItems: updatedItems.slice(pageStart, pageEnd),
					selectedRows: [],
					selectedRowsPreviousState: [...selectedRows]
				};

				console.debug('tableI2DState:delete', updateState);

				return {
					...state,
					...updateState
				};
			}),
		deleteAll: () =>
			update((state) => {
				const updateState: Partial<TableState> = {
					executedAction: 'deleteAll',
					items: [],
					pageItems: [],
					selectedRows: []
				};

				console.debug('tableI2DState:deleteAll', updateState);

				return {
					...state,
					...updateState
				};
			}),
		gotoPage: (pageIndex: number) =>
			update((state) => {
				const { lastPage, pageSize, items } = state;

				if (!items.length) {
					return state;
				}

				const currentPage = pageIndex > lastPage ? lastPage : pageIndex;
				const pageStart = currentPage * pageSize;
				const pageEnd = Math.min(pageStart + pageSize, items.length);
				const pageItems = items.slice(pageStart, pageEnd);

				const updateState: Partial<TableState> = {
					currentPage,
					pageEnd,
					pageItems,
					pageStart,
					selectedRows: []
				};

				console.debug('tableI2DState:gotoPage', pageIndex, updateState);

				return {
					...state,
					...updateState
				};
			}),
		init: (props: {
			data: TableState['data'];
			pageSize?: TableState['pageSize'];
			pageSizes?: TableState['pageSizes'];
		}) => {
			if (!props.data.length) {
				return;
			}
			return update((state) => {
				const pageSize = props.pageSize || state.pageSize;
				const pageSizes = props.pageSizes || state.pageSizes;
				const items = [...props.data];
				const pageStart = state.currentPage * pageSize;
				const pageEnd = Math.min(pageStart + pageSize, items.length);
				const lastPage = Math.max(Math.ceil(items.length / pageSize) - 1, 0);
				const pageItems = items.slice(pageStart, pageEnd);

				const updateState: Partial<TableState> = {
					data: props.data,
					items,
					lastPage,
					pageEnd,
					pageItems,
					pageSize,
					pageSizes,
					pageStart
				};

				console.debug('tableI2DState:init', updateState);

				return {
					...state,
					...updateState
				};
			});
		},
		reset: () => set(defaultI2DState)
	};
};

export const tableI2DState = createCount();
