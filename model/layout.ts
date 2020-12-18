import ButtonInfo from "./button-info";

export default interface Layout {
	buttons: ButtonPositioner[],
	colNumber: number,
	rowNumber: number,
}

export function getDefaultLayout(): Layout {
	return {buttons: [], colNumber: 4, rowNumber: 3};
}

export function getButtonForLayoutAt(layout: Layout, colId: number, rowId: number): ButtonPositioner |undefined {
	if (colId > layout.colNumber || rowId > layout.rowNumber) {
		return undefined;
	}

	const buttons = layout.buttons.filter(({ colIndex, rowIndex }) => colIndex === colId && rowIndex === rowId);
	if (buttons.length > 0) {
		return buttons[0]
	}
	return undefined;
}

export function setButtonForLayoutAt(layout: Layout, positioner: ButtonPositioner) {
	layout.buttons = layout.buttons.filter(({ colIndex, rowIndex }: ButtonPositioner) => rowIndex != positioner.rowIndex || colIndex != positioner.colIndex)
	layout.buttons.push(positioner);
}

export interface ButtonPositioner {
	colIndex: number,
	rowIndex: number,
	info?: ButtonInfo
}