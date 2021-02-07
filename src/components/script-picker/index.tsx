import { PluginComponent } from "@model/plugin-export";
import { nanoid } from "nanoid";
import React, { useRef, useState } from "react";
import styles from "./script-picker.module.scss";

const Pane = ({ category, expanded = false, children, onClick }: { category: string, expanded?: boolean, onClick?: any, children?: JSX.Element[] | JSX.Element }) => {

	const ref = useRef<HTMLDivElement>();

	if (expanded) {
		const timer = setInterval(() => {
			if (ref) {
				ref.current.classList.toggle(styles.expanded, true);
				clearInterval(timer);
			}
		}, 10);
	}

	return (<div className={styles.pane}>
		<span className={styles.title} onClick={onClick}>{category}</span>
		<div className={styles.content} ref={ref}>
			{children}
		</div>
	</div>)

}


interface IProps {
	plugins: PluginComponent[];
	onPluginPicked: (plugin: PluginComponent) => void;
}

export default function ScriptPicker({ plugins, onPluginPicked }: IProps): JSX.Element {

	const [expandedPane, setExpandedPane] = useState<string | undefined>();

	const onChangeExpanded = (category: string) => {
		if (category !== expandedPane)
			setExpandedPane(category)
		else
			setExpandedPane(undefined);
	}

	const orderedPlugins = {};
	for (let plg of plugins) {
		const category = plg.descriptor.info.category || "others";
		if (Object.values(orderedPlugins).includes(category)) {
			orderedPlugins[category].push(plg);
		} else {
			orderedPlugins[category] = [plg];
		}
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

	return <div className={styles.container}>
		{
			Object.keys(orderedPlugins).sort(sortCategories).map((category) => {
				return (
					<Pane key={nanoid()} category={category} expanded={category === expandedPane} onClick={() => onChangeExpanded(category)}>
						{
							orderedPlugins[category].map((plg: PluginComponent) => {
								return (<div key={nanoid()} className={styles.script} onClick={() => onPluginPicked(plg)}>
									{plg.descriptor.info.displayName}
								</div>)
							})
						}
					</Pane>
				)
			})
		}
	</div>

}