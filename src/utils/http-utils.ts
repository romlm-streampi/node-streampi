import Layout from "@model/layout";
import { IScriptIdentifier, IScriptInstance } from "@model/script";
import axios from "axios";
import FormData from "form-data";

const resolve = (...args: string[]) => {

	return args.map((arg) => {
		if (arg.endsWith('/')) {
			return arg.slice(0, arg.length - 1);
		}
		return arg;
	}).join('/');
}

const host = `${document.location.protocol}//${document.location.host}/`;

const BASE_API_URL = resolve(host, "api");

const defaultHeaders = {
	"api-key": "hello"
}

export async function sendFile(file: File): Promise<any> {

	const submitURL = `${BASE_API_URL}/image`;
	const data: FormData = new FormData();

	data.append("image", file);

	return await axios.post(submitURL, data, {
		headers: defaultHeaders
	}).then(response => JSON.parse(response.data))

}


export async function executeScript(script: IScriptInstance): Promise<any> {
	const executeApi = resolve(BASE_API_URL, "scripts", script.descriptor.id.moduleName, script.descriptor.id.script);
	const body = script.parameters;

	return await axios.post(executeApi, body, { headers: defaultHeaders })
		.then((res) => res.data)
		.catch((err) => ({ failed: true, err }))
}

export async function getProvider(providerId: IScriptIdentifier): Promise<any> {
	const executeApi = resolve(BASE_API_URL, "providers", providerId.moduleName, providerId.script);
	return await axios.get(executeApi, { headers: defaultHeaders })
		.then((res) => res.data)
		.catch((err) => ({ failed: true, err }))
}

export async function saveLayouts(layouts: Layout[]) {
	const saveURL = resolve(BASE_API_URL, "layout");
	await axios.post(saveURL, layouts, { headers: defaultHeaders }).catch(console.warn);
}

export async function deleteImage(iconPath: string): Promise<any> {
	const deleteURL = `${BASE_API_URL}/image`;
	const name = iconPath.split("/").pop();

	return await axios.delete(`${deleteURL}/${name}`, {
		headers: defaultHeaders
	}).catch((err) => ({ failed: true, err }));
}

export async function getLayout(): Promise<Layout[]> {
	const requestURL = resolve(BASE_API_URL, "layout");
	return axios.get(requestURL, { headers: defaultHeaders })
		.then((res) => res.data)
		.catch((err) => ({ failed: true, err }));
}

export async function getPluginNames(): Promise<string[]> {
	const requestURL = resolve(BASE_API_URL, "names");
	return await axios.get(requestURL, { headers: defaultHeaders })
		.then((response) => response.data)
		.catch((err) => ({ failed: true, err }));

}
