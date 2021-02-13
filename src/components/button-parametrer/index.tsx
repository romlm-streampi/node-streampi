import Layout, { IManagementPositioner, IPositioner, IPositionerInfo, IScriptPositioner, IsManagementScript } from "@model/layout";
import { PluginComponent } from "@model/plugin-export";
import { IScriptInstance } from "@model/script";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import styles from './button-parametrer.module.scss';


const FolderPane = ({ onClick }: { onClick: any }) => (
	<div className={styles['folder-pane']} onClick={onClick}>
		access folder
	</div>
)

interface IProps {
	button: IPositioner;
	plugins: PluginComponent[];
	onPositionerSave: (info: {
		info?: {
			icon: File,
			text: string
		},
		scripts?: IScriptInstance[],
		management?: {
			type: string,
			parameters?: any
		}
	}) => void;
	onPositionerDelete: Function;
	onLayoutChangeRequest: (layoutId: string) => void;
}

export default function ButtonParametrer({
	button,
	onPositionerDelete,
	onLayoutChangeRequest,
	onPositionerSave
}: IProps) {

	const [info, setInfo] = useState<IPositionerInfo>(button.info || { text: "", iconPath: "" });
	const [isScript, setIsScript] = useState<Boolean>((button as IManagementPositioner).management === undefined);
	const [pickedScript, setPickedScript] = useState<IScriptInstance | undefined>();

	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fileInputRef.current.files = new DataTransfer().files;
		setInfo(button.info || { text: "", iconPath: "" });
		setIsScript((button as IManagementPositioner).management === undefined);
		setPickedScript(undefined);
	}, [button]);

	const onTextChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		ev.preventDefault();
		setInfo({ ...info, text: ev.target.value });
	}

	const onImageChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		ev.preventDefault();
		const { target: { files } } = ev;
		files[0].arrayBuffer().then((buffer: ArrayBuffer) => {
			const b64data = Buffer.from(buffer).toString('base64');
			setInfo({ ...info, iconPath: `data:image/${files[0].type};base64, ${b64data}` });
		});

	};

	const onInfoFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		const { files } = ev.target[0];
		const res = { info: undefined, scripts: undefined, management: undefined };
		if (files?.length > 0) {
			res.info = { ...res.info, icon: files[0] };
		}
		if (info.text) {
			res.info = { ...res.info, text: info.text };
		}
		if (isScript) {
			res.scripts = []
		} else {
			res.management = { type: "folder" };
		}
		onPositionerSave(res);
	}

	const onScriptPicked = (ins: IScriptInstance) => {
		setPickedScript(ins);
	}

	const onTypeChanged = (ev: React.ChangeEvent<HTMLSelectElement>) => {
		ev.preventDefault();
		switch (ev.target.value) {
			case "script":
				setIsScript(true);
				break;
			case "folder":
				setIsScript(false);
				break;
		}
	}

	return (<div className={styles.container}>
		<form className={styles.form} onSubmit={onInfoFormSubmit}>

			<input type="file" id="button-file-input" onChange={onImageChange} className={styles['icon-input']} ref={fileInputRef} />
			<label htmlFor="button-file-input">
				{
					info?.iconPath ? <img src={info?.iconPath} /> : <span>choose an icon</span>
				}

			</label>
			<select onChange={onTypeChanged} value={isScript ? "script" : "folder"}>
				<option value="script">script</option>
				<option value="folder">folder</option>
			</select>
			<input type="text" id="button-text-input" value={info?.text} className={styles['text-input']} onChange={onTextChange} />
			<label htmlFor="button-text-input">icon title: </label>


			<button className={styles.delete} onClick={(ev) => { ev.preventDefault(); onPositionerDelete() }}>delete script</button>
			<button className={styles.save}>save</button>

		</form>
		{
			IsManagementScript(button) ? (() => {
				const layoutId = (button as IManagementPositioner).management.parameters.layoutId;

				return <FolderPane
					onClick={() => onLayoutChangeRequest(layoutId)}
				/>
			})() : (<><div className={styles.scripts}>
				<ul className={styles.list}>
					{
						((button as IScriptPositioner).scripts || []).map((ins: IScriptInstance) => {
							return (<li
								className={styles.script}
								key={nanoid()}
								onClick={() => onScriptPicked(ins)}>
								{ins.descriptor.info.displayName}
							</li>)
						})
					}
				</ul>
			</div>

				<div className={styles.param}>
					{
						pickedScript ? (<>
							{pickedScript.parameters}
						</>)
							: <>pick a script in the list or add one</>
					}
				</div></>)
		}


	</div>)
}