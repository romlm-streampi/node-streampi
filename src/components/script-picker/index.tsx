import { PluginScript } from "@model/plugin-export";
import { isEqual } from "lodash";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import styles from "./script-picker.module.scss";

interface IProps {
	plugins: PluginScript[];
	onPluginPicked: (plg: PluginScript) => void;
}

const sortCategories = (a: string, b: string): number => {
	if (a === "others") {
		return 10;
	} else if (b === "others") {
		return -10;
	} else if (a < b) {
		return -1;
	} else if (a > b) {
		return 1;
	}
	return 0;
}


export default function ScriptPicker({ plugins, onPluginPicked }: IProps) {

	const [pickedPlugin, setPickedPlugin] = useState<PluginScript | undefined>(undefined);
	const [orderedPlugins, setOrderedPlugins] = useState<any>({});

	useEffect(() => {
		const categories = {};
		plugins.forEach((plg) => {
			const category = plg.descriptor.info.category || "others";
			if (Object.keys(categories).includes(category)) {
				categories[category].push(plg)
			} else {
				categories[category] = [plg];
			}
		});

		setOrderedPlugins(categories);
	}, [plugins])


	return (<div className={styles.container}>
		<div className={styles["script-list"]}>
			{


				Object.keys(orderedPlugins).sort(sortCategories).map((category) => {

					const plgList = orderedPlugins[category];


					return (<div key={nanoid()} className={styles["category-pane"]}>
						<div className={styles["pane-title"]}>{category}</div>
						{plgList.map((plg) => {
							const id = nanoid();
							const { descriptor: { info: { displayName }, id: scriptId } } = plg;
							return (
								<div key={id} className={styles.script}>
									<input
										type="radio"
										id={`script-radio-${id}`}
										value={[scriptId.moduleName, scriptId.script]}
										onChange={(ev) => ev.target.checked && setPickedPlugin(plg)}
										name="script"
										checked={isEqual(plg.descriptor.id, pickedPlugin?.descriptor.id)}
									/>
									<label htmlFor={`script-radio-${id}`}>{displayName}</label>
								</div>
							)
						})}
					</div>)
				})
			}
		</div>

		{
			pickedPlugin && (
				<div className={styles["script-visualizer"]}>
					<div>module: {pickedPlugin.descriptor.id.moduleName}</div>
					<div>name: {pickedPlugin.descriptor.info.displayName}</div>
					{
						pickedPlugin.descriptor.info.description && (<div>
							descripton: {pickedPlugin.descriptor.info.description}
						</div>)
					}
				</div>
			)
		}

		<button onClick={() => onPluginPicked(pickedPlugin)} className={styles.save}>add plugin</button>
		<button onClick={() => onPluginPicked(undefined)} className={styles.exit}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M0 0h24v24H0z" fill="none" />
				<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
			</svg>
		</button>


	</div>);
}