import { IPositioner, IPositionerInfo } from "@model/layout";
import { PluginComponent } from "@model/plugin-export";
import { IScriptInstance } from "@model/script";
import React, { useEffect, useState } from "react";
import styles from './button-parametrer.module.scss';

interface IProps {
	button: IPositioner | { colIndex: number, rowIndex: number };
	plugins: PluginComponent[];
	onButtonInfoSave: ({ text: string, icon: File }) => void;
	onButtonScriptsChanged?: (scripts: IScriptInstance[]) => void;
	onScriptDelete: Function
}

export default function ButtonParametrer({ button, onButtonInfoSave, onScriptDelete }: IProps) {

	const [info, setInfo] = useState<IPositionerInfo>((button as IPositioner).info || { text: "", iconPath: "" });

	useEffect(() => {
		setInfo((button as IPositioner).info || { text: "", iconPath: "" });
	}, [button]);

	const onTextChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		ev.preventDefault();
		setInfo({ ...info, text: ev.target.value });
	}

	const onImageChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		ev.preventDefault();
		const { target: { files } } = ev;
		files[0].arrayBuffer().then((buffer: ArrayBuffer) => {
			console.log(Buffer);
			const b64data = Buffer.from(buffer).toString('base64');
			setInfo({ ...info, iconPath: `data:image/${files[0].type};base64, ${b64data}` });
		});

	};

	const onInfoFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		const { files } = ev.target[0];

		onButtonInfoSave({ text: info.text, icon: files[0] as File });
	}

	return (<div className={styles.container}>
		<form className={styles.form} onSubmit={onInfoFormSubmit}>
			<input type="file" id="button-file-input" onChange={onImageChange} className={styles['icon-input']} />
			<label htmlFor="button-file-input">
				<img src={info?.iconPath} />
			</label>

			<input type="text" id="button-text-input" value={info?.text} className={styles['text-input']} onChange={onTextChange} />
			<label htmlFor="button-text-input">icon title: </label>


			<button className={styles.delete} onClick={(ev) => {ev.preventDefault();onScriptDelete()}}>delete script</button>
			<button className={styles.save}>save</button>

		</form>

		<div className={styles.scripts}>
			test
		</div>
	</div>)
}