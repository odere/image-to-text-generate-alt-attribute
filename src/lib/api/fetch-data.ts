// TODO: change data interface
export interface Data {
	id: string;
	title: string;
	completed: boolean;
	userId: number;
}

export const fetchData = async (): Promise<Data[]> => {
	try {
		const response = await fetch(
			'https://gist.githubusercontent.com/hperrin/e24a4ebd9afdf2a8c283338ae5160a62/raw/dcbf8e6382db49b0dcab70b22f56b1cc444f26d4/todos.json'
		);
		const data = await response.json();
		return (data as any[]).map(({ id, ...rest }) => ({
			...rest,
			id: `${id}`
		}));
	} catch (error) {
		console.error(error);
		return [];
	}
};
