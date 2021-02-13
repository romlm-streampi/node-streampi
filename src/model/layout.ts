import { isEqual, xor } from "lodash";
import { nanoid } from "nanoid";
import { IScriptInstance } from "./script";


export interface IScriptPositioner extends IPositioner {
	scripts: IScriptInstance[];
	info: IPositionerInfo;
}

export interface IManagementPositioner extends IPositioner {
	management: { type: "folder", parameters: any }
	info: IPositionerInfo;
}

export interface IPositioner {
	info?: IPositionerInfo;
	colIndex: number;
	rowIndex: number;
}

export interface IPositionerInfo {
	text: string;
	iconPath: string;
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

	addPositioner(pos: IPositioner) {
		if (pos.colIndex > this.size.colNumber || pos.rowIndex > this.size.rowNumber) {
			throw new Error(`invalid position given: ${pos}`)
		}
		const { index } = this.positioners
			.map(({ colIndex, rowIndex }, index) => ({ index, colIndex, rowIndex }))
			.find(({ rowIndex, colIndex }) => isEqual({ rowIndex, colIndex }, { rowIndex: pos.rowIndex, colIndex: pos.colIndex }));
		if (index !== undefined) {
			this.positioners[index] = pos
		} else {
			this.positioners.push(pos);
		}
	}
}

export function SetPositioner(layout: Layout, pos: IPositioner) {
	if (pos.colIndex > layout.size.colNumber || pos.rowIndex > layout.size.rowNumber) {
		throw new Error(`invalid position given: ${pos}`)
	}
	if (!layout.positioners) {
		layout.positioners = [];
	}
	const index = layout.positioners
		.map(({ colIndex, rowIndex }, index) => ({ index, colIndex, rowIndex }))
		.find(({ rowIndex, colIndex }) => isEqual({ rowIndex, colIndex }, { rowIndex: pos.rowIndex, colIndex: pos.colIndex }))?.index;
	if (index !== undefined) {
		layout.positioners[index] = pos
	} else {
		layout.positioners.push(pos);
	}
}

export function RemovePositioner(layout: Layout, pos: IPositioner) {
	layout.positioners = layout.positioners.filter(({ colIndex, rowIndex }) => !isEqual(
		{ colIndex, rowIndex },
		{ colIndex: pos.colIndex, rowIndex: pos.rowIndex }
	))
}

export function createLayout({ size = LAYOUT_SIZES.DEFAULT, positioners = [], id = nanoid() }: { size?: ILayoutSize, positioners?: IPositioner[], id?: string }) {
	return new Layout(id, size, positioners);
}

export function IsManagementScript(pos: IPositioner) {
	return (pos as IManagementPositioner).management;
}
