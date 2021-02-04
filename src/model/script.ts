
export interface IScriptIdentifier {
	moduleName: string;
	script: string;
}

export interface IScriptInfo {
	displayName: string;
	description?: string;
}

export interface IScriptDescriptor {
	id: IScriptIdentifier;
	info: IScriptInfo;
	defaultParams?: any;
}

export interface IScriptInstance {
	descriptor: IScriptDescriptor;
	text: string;
	iconPath: string;
	parameters?: any;
}