import { IScriptDescriptor, IScriptInstance } from "./script";
import { isEqual } from "lodash";

const ADD_FOLDER_DESCRIPTOR: IScriptDescriptor = {
	id: {
		moduleName: "management",
		script: "add_folder"
	},
	info: {
		displayName: "add folder",
		description: "create a folder"
	}
};

export const MANAGEMENT_SCRIPTS = {
	ADD_FOLDER_DESCRIPTOR
}

export class FolderScript implements IScriptInstance {
	public descriptor = ADD_FOLDER_DESCRIPTOR;
	public parameters = { layoutId: null };
	constructor(layoutId: string, public text: string, public iconPath: string) {
		this.parameters.layoutId = layoutId;
	}

}

export function IsManagementScript(descriptor: IScriptDescriptor) {
	return Object.values(MANAGEMENT_SCRIPTS).map(({ id }) => id).includes(descriptor.id);
}

export function IsFolderScript(descriptor: IScriptDescriptor) {
	return isEqual(descriptor.id, ADD_FOLDER_DESCRIPTOR.id);
}