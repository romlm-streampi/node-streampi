
export interface IScriptIdentifier {
	moduleName: string;
	script: string;
}

export interface IScriptInfo {
	displayName: string;
	description?: string;
	category?: string;
}

export interface IScriptDescriptor {
	id: IScriptIdentifier;
	info: IScriptInfo;
	defaultParams?: any;
}

export interface IScriptInstance {
	descriptor: IScriptDescriptor;
	parameters?: any;
}