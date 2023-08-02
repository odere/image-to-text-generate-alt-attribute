import { writable } from 'svelte/store';
import type { Data } from '$lib/api/fetch-data';
import type { SortValue } from '@smui/data-table';

export type PageSize = 10 | 25 | 50 | 100;
export type Actions = 'delete' | 'delete-all';

export interface TableState {
	currentPage: number;
	data: Data[];
	executedAction?: Actions;
	items: Data[];
	lastPage: number;
	pageEnd: number;
	pageItems: Data[];
	pageSize: PageSize;
	pageSizes: PageSize[];
	pageStart: number;
	selectedRows: number[];
}

export const defaultI2DState: TableState = {
	data: [],
	items: [],
	pageItems: [],
	currentPage: 0,
	executedAction: undefined,
	lastPage: 0,
	pageEnd: 0,
	pageSize: 10,
	pageSizes: [10, 25, 100],
	pageStart: 0,
	selectedRows: []
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
