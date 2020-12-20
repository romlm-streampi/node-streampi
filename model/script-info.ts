
export interface ScriptParameter {
	name: string,
	type: "string" | "provided" | "number" | "boolean",
	description: string | undefined,
	provider: string | undefined,
	value: any | undefined
}

export default interface ScriptInfo {
	name: string,
	category: string,
	parameters?: ScriptParameter[]
}