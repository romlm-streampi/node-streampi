import { nanoid } from "nanoid";
import { IScriptInstance } from "./script";


export interface IPositioner {
	script: IScriptInstance;
	colIndex: number;
	rowIndex: number;
}

export interface ILayoutSize {
	colNumber: number;
	rowNumber: number;
}

export const LAYOUT_SIZES = {
	MINI: { colNumber: 3, rowNumber: 2 },
	DEFAULT: { colNumber: 5, rowNumber: 3 },
	LARGE: { colNumber: 8, rowNumber: 5 }
}

export default class Layout {
	constructor(
		public readonly id: string,
		public size: ILayoutSize,
		public positioners: IPositioner[]
	) { }
}

export function createLayout(size = LAYOUT_SIZES.DEFAULT, positioners = []) {
	return new Layout(nanoid(), size, positioners);
}
