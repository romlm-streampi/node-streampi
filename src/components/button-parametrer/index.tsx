import { IPositioner } from "@model/layout";
import { PluginComponent } from "@model/plugin-export";
import { IScriptInstance } from "@model/script";
import React, { useEffect, useState } from "react";
import styles from './button-parametrer.module.scss';

interface IProps {
	button: IPositioner | { colIndex: number, rowIndex: number };
	plugins: PluginComponent[];
	onButtonInfoSave?: ({ text: string, icon: File }) => void;
	onButtonScriptsChanged?: (scripts: IScriptInstance[]) => void;
}

export default function ButtonParametrer({ button }: IProps) {

	const [info, setInfo] = useState<{ text: string, iconPath: string }>((button as IPositioner).script || { text: "", iconPath: "" });

	useEffect(() => {
		setInfo((button as IPositioner).script || { text: "", iconPath: "" });
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

	return (<div className={styles.container}>
		<form className={styles.form}>

			<input type="file" id="button-file-input" onChange={onImageChange} />
			<label htmlFor="button-file-input" className={styles['icon-label']}>
				<img src={info?.iconPath} />
			</label>


			<label htmlFor="button-text-input">icon title</label>
			<input type="text" id="button-text-input" value={info?.text} onChange={onTextChange} />

		</form>
	</div>)
}