import { getProvider } from "@utils/http-utils";
import { IScriptDescriptor, IScriptIdentifier } from "./script";

export interface PluginExport {
	component: JSX.Element;
	script: string;
	displayName?: string;
	description?: string;
	category?: string;
	defaultParams?: {};
}

export class PluginBundle {
	constructor(public readonly scriptId: IScriptIdentifier) {}

	async getProvider(name: string) {
		const {moduleName} = this.scriptId;
		return await getProvider({moduleName, script: name});
	}
}

export interface PluginComponent {
	descriptor: IScriptDescriptor;
	component: JSX.Element;
	bundle: PluginBundle;
}