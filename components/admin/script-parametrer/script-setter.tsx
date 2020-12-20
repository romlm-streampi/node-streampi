import { cloneDeep } from "lodash";
import { ChangeEvent, FormEvent, useState } from "react";
import { ScriptableButtonInfo } from "../../../model/button-info";
import { ButtonPositioner } from "../../../model/layout";
import ScriptInfo, { ScriptParameter } from "../../../model/script-info";
import { IMAGE_BASE_PATH, sendFile } from "../../../model/utils/client-utils";
import styles from "./script-setter.module.css";



const ParamForm = ({ param, onParamChanged }: { param: ScriptParameter, onParamChanged: (param: ScriptParameter) => void }) => {

	const [value, setValue] = useState(param.value);

	if (param.type === "string" || param.type === "boolean") {

		const onTextChange = (ev: ChangeEvent<HTMLInputElement>) => {
			const { target: { value } } = ev;
			setValue(value);
			onParamChanged({ name: param.name, description: param.description, type: param.type, value, provider: param.provider })
		}

		const onCheckedChange = (ev: ChangeEvent<HTMLInputElement>) => {
			const { target: { checked } } = ev;
			console.log(`checked: ${checked}`)
			setValue(checked);
			onParamChanged({ name: param.name, description: param.description, type: param.type, value: checked, provider: param.provider })
		}

		const id = `${param.name.replace(" ", "-").toUpperCase()}__${Date.now()}`

		return (
			<div className={styles["script-parametrer__param-form"]}>
				<label htmlFor={id} >{param.name}: </label>

				{
					param.type === "boolean" && (
						<input type="checkbox" onChange={onCheckedChange} checked={value} id={id} />
					)
				}
				{
					param.type === "string" && (
						<input type="text" onChange={onTextChange} value={value} id={id} />
					)
				}
				{ param.description && (
					<p className={styles["script-param-form__decription"]}>
						{param.description}
					</p>
				)}
			</div>
		);
	}
	return (<></>);
}

export default function ScriptSetter({ positioner, scriptInfo: info, onScriptChanged, onDelete, onCloseRequested }: { positioner: ButtonPositioner, scriptInfo: Readonly<ScriptInfo>, onScriptChanged: ((scriptInfo: ScriptableButtonInfo) => any), onDelete: (positioner: ButtonPositioner) => void, onCloseRequested: () => any }) {

	const [formValid, setFormValid] = useState(positioner.info !== undefined);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [iconPath, setIconPath] = useState(positioner.info?.iconPath);
	const [text, setText] = useState(positioner.info?.text);

	const scriptInfo = cloneDeep(info);

	const onFileChanged = (ev: ChangeEvent<HTMLInputElement>) => {

		const { target: { files } } = ev;
		if (files && files.length > 0) {
			const reader: FileReader = new FileReader();
			setFile(files[0])
			reader.readAsArrayBuffer(files[0]);
			reader.onloadend = () => {
				if (reader.result instanceof ArrayBuffer) {
					setIconPath(`data:image/png;base64,${Buffer.from(reader.result as ArrayBuffer).toString("base64")}`);
					setFormValid(text !== undefined);
				} else {
					setFormValid(false)
				}
			}
		} else {
			setFormValid(false);
		}

		ev.preventDefault();


	}

	const onTextChanged = (ev: ChangeEvent<HTMLInputElement>) => {
		const { target: { value: text } } = ev;

		if (text) {
			setFormValid(iconPath !== undefined);
		} else {
			setFormValid(false);
		}
		setText(text);

		ev.preventDefault();
	}

	const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
		if (file) {
			sendFile(file).then(({ path }) => {
				if (text && path) {
					onScriptChanged({ text, iconPath: IMAGE_BASE_PATH + path, script: scriptInfo } as ScriptableButtonInfo);
				}
			}).catch(console.error);
		} else if (iconPath && text) {
			onScriptChanged({ text, iconPath: iconPath, script: scriptInfo } as ScriptableButtonInfo);
		}


		ev.preventDefault();
	};

	return (
		<div className={styles["script-setter-container"]}>

			<form className={styles["script-setter"]} onSubmit={onSubmit}>
				<header className={styles["script-setter-header"]} >
					<div className={[styles["script-setter-button"], styles["script-setter-close"]].join(" ")} onClick={onCloseRequested}>
						<svg transform="rotate(45)" viewBox="0 0 16 16" className="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
						</svg>
					</div>
				</header>

				<div className={styles["script-setter-form"]}>

					<fieldset className={styles["script-setter-form__button-parametrer"]}>
						<label htmlFor="script-setter-form__filePicker">button icon: </label>
						<label htmlFor="script-setter-form__filePicker">

							<img src={iconPath || "/resources/default.png"} className={styles["script-setter-form__fileViewer"]} />
						</label>
						<input type="file" id="script-setter-form__filePicker" className={styles["script-setter-form__filePicker"]} accept="image/png" multiple={false} onChange={onFileChanged} />
						<label htmlFor="script-setter-form__button-name-field">button name: </label>
						<input type="text" className={styles["script-setter-form__button-name-field"]} id="script-setter-form__button-name-field" onChange={onTextChanged} value={text} />

					</fieldset>

					{
						scriptInfo.parameters && (
							<fieldset className={styles["script-setter-form__script-parametrer"]}>
								<legend>{scriptInfo.name} script</legend>
								{
									scriptInfo.parameters.map((param: ScriptParameter, index: number) => {
										return (<ParamForm key={`script-setter__${scriptInfo.name}__${param.name}`} param={param} onParamChanged={(parameter) => {
											if (scriptInfo.parameters) {
												scriptInfo.parameters[index].value = parameter.value;
											}
										}} />);
									})
								}
							</fieldset>)
					}



				</div>
				<footer className={styles["script-setter-footer"]}>
					<button className={[styles["script-setter-button"], styles["script-setter-delete"]].join(" ")} onClick={() => onDelete({ colIndex: positioner.colIndex, rowIndex: positioner.rowIndex, info: positioner.info })} disabled={!formValid}>delete</button>
					<button className={[styles["script-setter-button"], styles["script-setter-submit"]].join(" ")} type="submit" disabled={!formValid}>ok</button>
				</footer>
			</form>
		</div>

	)

}