import { PluginComponent } from "@model/plugin-export";
import { isEqual } from "lodash";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import styles from "./script-picker.module.scss";

interface IProps {
	plugins: PluginComponent[];
	onPluginPicked: (plg: PluginComponent) => void;
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

	const [pickedPlugin, setPickedPlugin] = useState<PluginComponent | undefined>(undefined);
	const [orderedPlugins, setOrderedPlugins] = useState<any>({});

	const LoadedComponent: JSX.Element = pickedPlugin?.component

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
		{


			Object.keys(orderedPlugins).sort(sortCategories).map((category) => {

				const plgList = orderedPlugins[category];


				return (<div key={nanoid()}>
					<span>{category}</span>
					{plgList.map((plg) => {
						const id = nanoid();
						const { descriptor: { info: { displayName }, id: scriptId } } = plg;
						return (
							<span key={id}>
								<label htmlFor={`script-radio-${id}`}>{displayName}</label>
								<input
									type="radio"
									id={`script-radio-${id}`}
									value={[scriptId.moduleName, scriptId.script]}
									onChange={(ev) => ev.target.checked && setPickedPlugin(plg)}
									name="script"
									checked={isEqual(plg.descriptor.id, pickedPlugin?.descriptor.id)}
								/>
							</span>
						)
					})}
				</div>)
			})
		}

		<div>
			picked plugin:
			{
				pickedPlugin && <LoadedComponent bundle={pickedPlugin.bundle} />
			}
		</div>
		<button onClick={() => onPluginPicked(undefined)}>exit</button>
		<button onClick={() => onPluginPicked(pickedPlugin)}>add plugin</button>
	</div>);
}