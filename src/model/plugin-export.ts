import { getProvider } from "@utils/http-utils";
import { isEqual } from "lodash";
import { IScriptDescriptor, IScriptIdentifier } from "./script";

export interface PluginExport {
	component: JSX.Element;
	script: string;
	displayName?: string;
	description?: string;
	category?: string;
}

interface PluginComponentProps {
	bundle: PluginBundle;
	onParametersChanged: (parameters: any) => void;
	currentParameters?: any;
}

export type PluginComponent = React.ReactElement<PluginComponentProps, any>;

export class PluginBundle {
	constructor(public readonly scriptId: IScriptIdentifier) { }

	async getProvider(name: string) {
		const { moduleName } = this.scriptId;
		return await getProvider({ moduleName, script: name });
	}
}

export function GetPluginScriptFromId(plugins: PluginScript[], scriptId: IScriptIdentifier) {
	return plugins.find(({ descriptor: { id } }) => isEqual(id, scriptId));
}

export interface PluginScript {
	descriptor: IScriptDescriptor;
	component: PluginComponent;
	bundle: PluginBundle;
}