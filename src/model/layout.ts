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

export default class Layout {
	constructor(
		public readonly id: string,
		public size: ILayoutSize,
		public positioners: IPositioner[]
	) { }
}