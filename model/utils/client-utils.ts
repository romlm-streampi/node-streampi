import axios from "axios";
import FormData from "form-data";
import { cloneDeep } from "lodash";
import { BackButtonInfo, FolderButtonInfo } from "../button-info";
import Layout, { ButtonPositioner, getDefaultLayout, setButtonForLayoutAt } from "../layout";
import ScriptInfo from "../script-info";


export const IMAGE_BASE_PATH = `${process.env.BASE_URL}/resources/icons/`;

const BASE_API_URL = process.env.BASE_URL+"/api";

export async function sendFile(file: File): Promise<any> {

	console.log("sent image")
	const submitURL = `${BASE_API_URL}/image`;
	const data: FormData = new FormData();

	data.append("image", file);

	return await axios.post(submitURL, data, {
		headers: {
			"api-key": process.env.API_KEY
		}
	}).then(response => JSON.parse(response.data))

}

export async function sendScript(script: ScriptInfo) {
	const executeApi = `${BASE_API_URL}/scripts`;
	return await axios.post(executeApi, script, {
		headers: {
			"api-key": process.env.API_KEY
		}
	}).then((response) => JSON.parse(response.data)).catch((_err) => ({ failed: true }));

}

export async function saveLayout(layout: Layout) {
	const postURL = `${BASE_API_URL}/layout`;
	await axios.post(postURL, serializeLayout(layout), {
		headers: {
			"api-key": process.env.API_KEY
		}
	});

}

export async function deleteImage(iconPath: string) {
	const deleteURL = `${BASE_API_URL}/image`;
	const name = iconPath.split("/").pop();

	return await axios.delete(`${deleteURL}/${name}`, {
		headers: {
			"api-key": process.env.API_KEY
		}
	}).catch((_err) => false);
}

export async function getLayoutFromServer() {
	const requestURL = `${BASE_API_URL}/layout`;

	return await axios.get(requestURL, { headers: { "api-key": process.env.API_KEY } })
		.then(
			(response) => {
				return (response.data && response.data.buttons) ? response.data : getDefaultLayout();
			}).catch((_error) => getDefaultLayout());

}

export async function getScriptsFromServer() {
	const requestURL = `${BASE_API_URL}/scripts`;

	return await axios.get(requestURL, { headers: { "api-key": process.env.API_KEY } }).then((response) => response.data || []).catch((_err) => []);
}


const prepareSubLayout = (parentLayout: Layout, childLayout: Layout) => {
	for (let positioner of childLayout.buttons.filter((pos: ButtonPositioner) => (pos.info as FolderButtonInfo)?.layout && !(pos.info instanceof BackButtonInfo))) {
		prepareSubLayout(parentLayout, (positioner.info as FolderButtonInfo).layout);
	}
	setButtonForLayoutAt(childLayout, { colIndex: 0, rowIndex: 0, info: new BackButtonInfo(parentLayout) });

};
export const prepareLayout = (rootLayout: Layout) => {

	const resultLayout: Layout = cloneDeep(rootLayout);
	for (let positioner of resultLayout.buttons.filter((pos: ButtonPositioner) => (pos.info as FolderButtonInfo).layout)) {
		const subLayout: Layout = (positioner.info as FolderButtonInfo).layout;
		prepareSubLayout(resultLayout, subLayout);
	}

	return resultLayout;
};

export function serializeLayout(rootLayout: Layout): Layout {
	const result: Layout = cloneDeep(rootLayout);

	const serializeSubLayout = (subLayout: Layout) => {
		for (let positioner of subLayout.buttons.filter((pos: ButtonPositioner) => (pos.info as FolderButtonInfo)?.layout && !(pos.info instanceof BackButtonInfo))) {
			const subLayout: Layout = (positioner.info as FolderButtonInfo).layout;
			serializeSubLayout(subLayout);
		}
		subLayout.buttons = subLayout.buttons.filter((button) => !((button.info) instanceof BackButtonInfo));
	}

	for (let positioner of result.buttons.filter((pos: ButtonPositioner) => (pos.info as FolderButtonInfo)?.layout)) {
		const subLayout: Layout = (positioner.info as FolderButtonInfo).layout;
		serializeSubLayout(subLayout);
	}

	return result;
}