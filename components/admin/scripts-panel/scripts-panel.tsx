import { useState } from "react";
import ScriptInfo from "../../../model/script-info";
import styles from "./scripts-panel.module.css";


interface IPaneProps {
	name: string,
	scripts: ScriptInfo[];
	onScriptPicked: (script: ScriptInfo) => any;
}


const Pane = ({ name, scripts, onScriptPicked }: IPaneProps) => {
	const [toggled, setToggled] = useState(false);

	return (
		<div className={styles["script-pane"]}>
			<input type="checkbox" id={`script-${name}-pane-toggler`.replace(' ', '_')} onChange={() => setToggled(!toggled)} className={styles["panel-pane-toggler"]} />
			<label htmlFor={`script-${name}-pane-toggler`.replace(' ', '_')} className={styles["script-pane-label"]}>
				<svg viewBox="0 0 16 16" className={"bi bi-caret-right-fill "+styles["script-pane-label-arrow"]} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
				</svg>
				{name}
			</label>
			<div className={styles["panel-pane"] + " " + (toggled ? styles["panel-pane-toggled"] : styles["panel-pane-untoggled"])}>
				{
					scripts.map((script: ScriptInfo, index) => {
						return (
							<div className={styles["script-pane-script"]} key={`script-${index}`} onClick={() => onScriptPicked(script)}>
								{script.name}
							</div>
						)
					})
				}
			</div>
		</div>
	)
}

const ScriptPanel = ({ scripts, onScriptPicked }: { scripts: ScriptInfo[], onScriptPicked: (script: ScriptInfo) => void }) => {
	const categories = [...new Set(scripts.map(({ category }: { category: string }) => category))]

	return (
		<div className={styles["script-panel"]}>
			{
				categories.map((category: string) => {
					return (
						<Pane name={category} key={`${category}-pane`} onScriptPicked={onScriptPicked} scripts={scripts.filter(({ category: cat }) => (cat === category))} />
					)
				})
			}
		</div>
	)
}

export default ScriptPanel;