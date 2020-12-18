import styles from "./script-setter.module.css";
import ButtonInfo from "../../../model/button-info";
import { ChangeEvent, FormEvent, useState } from "react";

import { sendFile, IMAGE_BASE_PATH } from "../../../model/utils/client-utils";

export default function ScriptSetter({ scriptInfo, onScriptChanged, onDelete, onCloseRequested }: { scriptInfo: ButtonInfo | undefined, onScriptChanged: ((scriptInfo: ButtonInfo) => any), onDelete: () => void, onCloseRequested: () => any }) {

	const [formValid, setFormValid] = useState(scriptInfo !== undefined);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [iconPath, setIconPath] = useState(scriptInfo?.iconPath);
	const [text, setText] = useState(scriptInfo?.text);

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
					if (scriptInfo) {
						scriptInfo.text = text;
						scriptInfo.iconPath = IMAGE_BASE_PATH + path;
						onScriptChanged(scriptInfo)
					} else {
						onScriptChanged({ text, iconPath: IMAGE_BASE_PATH + path });
					}
				}
			}).catch(console.error);
		}


		ev.preventDefault();
	};

	return (
		<div className={styles["script-setter-container"]}>
			<form className={styles["script-setter"]} onSubmit={onSubmit}>
				<div className={styles["script-setter-close"]} onClick={onCloseRequested}>
					<svg transform="rotate(45)" viewBox="0 0 16 16" className="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
					</svg>
				</div>

				<div className={styles["script-setter-form"]}>
					<legend>icon: </legend>
					<label htmlFor="script-setter-form-filePicker">

						<img src={iconPath || "/resources/default.png"} className={styles["script-setter-form-fileViewer"]} />


					</label>
					<input type="file" id="script-setter-form-filePicker" className={styles["script-setter-form-filePicker"]} accept="image/png" multiple={false} onChange={onFileChanged} />
					<legend>text: </legend>
					<input type="text" className={styles["script-setter-form-text"]} onChange={onTextChanged} value={text} placeholder="text" />
				</div>
				<div className={styles["buttons-container"]}>

					<button className={styles["script-setter-delete"]} onClick={onDelete} disabled={!scriptInfo}>delete</button>
					<button className={styles["script-setter-submit"]} type="submit" disabled={!formValid}>ok</button>
				</div>
			</form>
		</div>

	)

}