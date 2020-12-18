import Layout from "./layout";
import ScriptInfo from "./script-info";

export default interface ButtonInfo {
	text: string;
	iconPath?: string;
}

export interface FolderButtonInfo extends ButtonInfo {
	layout: Layout;
}

export class BackButtonInfo implements FolderButtonInfo {

	public text: string;
	public iconPath?: string;
	constructor(public layout: Layout) {
		this.text = "back";
		this.iconPath = "/resources/back.png";
	}

}

export interface ScriptableButtonInfo extends ButtonInfo {
	script: ScriptInfo;
}