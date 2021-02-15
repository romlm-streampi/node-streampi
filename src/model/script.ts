import { nanoid } from "nanoid";

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
}

export interface IScriptInstance {
	id: string;
	descriptor: IScriptDescriptor;
	parameters?: any;
}

export const NewScriptInstance = ({ id = nanoid(), descriptor, parameters = {} }: { id?: string, descriptor: IScriptDescriptor, parameters?: any }): IScriptInstance => ({ id, descriptor, parameters })