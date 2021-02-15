import ScriptPicker from "@components/script-picker";
import { IManagementPositioner, IPositioner, IPositionerInfo, IScriptPositioner } from "@model/layout";
import { GetPluginScriptFromId, PluginComponent, PluginScript } from "@model/plugin-export";
import { IScriptInstance, NewScriptInstance } from "@model/script";
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
	plugins: PluginScript[];
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

const getDefaultButtonFeatures = (button: IPositioner) => {
	const defaultButtonFeatures = {
		management: (button as IManagementPositioner).management,
		scripts: (button as IScriptPositioner).scripts
	};
	if (defaultButtonFeatures.management == undefined && defaultButtonFeatures.scripts == undefined) {
		defaultButtonFeatures.scripts = [];
	}
	return defaultButtonFeatures;
}

export const scriptArrIndexFromId = (scripts: IScriptInstance[], scriptId: string) => scripts.map((scr, index) => ({ ...scr, index })).find(({ id }) => id === scriptId)?.index

export default function ButtonParametrer({
	button,
	onPositionerDelete,
	onLayoutChangeRequest,
	onPositionerSave,
	plugins
}: IProps) {

	const [info, setInfo] = useState<IPositionerInfo>(button.info || { text: "", iconPath: "" });

	const [buttonFeatures, setButtonFeatures] = useState<{ management?: any, scripts?: IScriptInstance[] }>(getDefaultButtonFeatures(button));
	const [pickedScript, setPickedScript] = useState<{ scriptId: string, plugin: PluginScript } | undefined>();
	const [scriptPickerShown, setScriptPickerShown] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fileInputRef.current.files = new DataTransfer().files;
		setInfo(button.info || { text: "", iconPath: "" });
		setButtonFeatures(getDefaultButtonFeatures(button));
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
		if (buttonFeatures.scripts) {
			res.scripts = buttonFeatures.scripts
		} else {
			res.management = { type: "folder" };
		}
		onPositionerSave(res);
	}

	const onScriptPicked = (script: IScriptInstance) => {
		const plugin = GetPluginScriptFromId(plugins, script.descriptor.id);
		if (plugin)
			setPickedScript({ scriptId: script.id, plugin });
	}

	const onTypeChanged = (ev: React.ChangeEvent<HTMLSelectElement>) => {
		ev.preventDefault();
		switch (ev.target.value) {
			case "script":
				setButtonFeatures({ scripts: [] });
				break;
			case "folder":
				setButtonFeatures({ management: { type: "folder" } });
				break;
		}
	}

	const onPluginPicked = (plugin: PluginScript) => {
		setScriptPickerShown(false);
		const script = NewScriptInstance({descriptor: plugin.descriptor});
		setButtonFeatures({ scripts: [...buttonFeatures.scripts, script] })
		setPickedScript({ scriptId: script.id, plugin })
	}

	const onScriptUpdated = (params: any) => {
		const currentScript = buttonFeatures.scripts[scriptArrIndexFromId(buttonFeatures.scripts, pickedScript.scriptId)];
		currentScript.parameters = params;
	}

	const onScriptDelete = (ev: React.MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault();
		setButtonFeatures({scripts: buttonFeatures.scripts.filter(({id}) => id !== pickedScript.scriptId)});
		setPickedScript(undefined);
	}

	return (<div className={styles.container}>
		<form className={styles.form} onSubmit={onInfoFormSubmit}>

			<input type="file" id="button-file-input" onChange={onImageChange} className={styles['icon-input']} ref={fileInputRef} />
			<label htmlFor="button-file-input">
				{
					info?.iconPath ? <img src={info?.iconPath} /> : <span>choose an icon</span>
				}

			</label>
			<select onChange={onTypeChanged} value={buttonFeatures.scripts ? "script" : "folder"}>
				<option value="script">script</option>
				<option value="folder">folder</option>
			</select>
			<input type="text" id="button-text-input" value={info?.text} className={styles['text-input']} onChange={onTextChange} />
			<label htmlFor="button-text-input">icon title: </label>


			<button className={styles.delete} onClick={(ev) => { ev.preventDefault(); onPositionerDelete() }}>delete script</button>
			<button className={styles.save}>save</button>

		</form>
		{
			buttonFeatures.management && (() => {
				const layoutId = (button as IManagementPositioner).management?.parameters?.layoutId;
				if (layoutId)
					return <FolderPane
						onClick={() => onLayoutChangeRequest(layoutId)}
					/>
				else
					return (<div className={styles["folder-pane"]}>save to generate folder</div>)
			})()
		}
		{
			buttonFeatures.scripts && (<><div className={styles.scripts}>
				<ul className={styles.list}>
					{
						buttonFeatures.scripts.map((ins: IScriptInstance) => {
							return (<li
								className={styles.script}
								key={nanoid()}
								onClick={() => onScriptPicked(ins)}>
								{ins.descriptor.info.displayName}
							</li>)
						})
					}
				</ul>
				<div className={styles.buttons}>
					<button onClick={onScriptDelete} className={styles["delete-script"]}>delete script</button>
					<button onClick={() => setScriptPickerShown(true)} className={styles["add-script"]}>add script</button>
				</div>
			</div>

				<div className={styles.param}>
					{
						pickedScript ? (<>
							{
								<pickedScript.plugin.component
									bundle={pickedScript.plugin.bundle}
									onParametersChanged={onScriptUpdated}
									currentParameters={buttonFeatures.scripts[scriptArrIndexFromId(buttonFeatures.scripts, pickedScript.scriptId)].parameters} />
							}
						</>)
							: <>pick a script in the list or add one</>
					}
				</div></>)
		}
		{
			scriptPickerShown && (<><ScriptPicker
				plugins={plugins}
				onPluginPicked={onPluginPicked}
			/>
				<div className={styles.filter}></div>
			</>)
		}


	</div>)
}