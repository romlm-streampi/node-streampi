import ButtonParametrer from "@components/button-parametrer";
import Visualizer from "@components/visualizer";
import Layout, { createLayout, IPositioner } from "@model/layout";
import { IsFolderScript, IsManagementScript } from "@model/management-scripts";
import { PluginComponent } from "@model/plugin-export";
import styles from "@styles/admin.module.scss";
import { executeScript, getLayout, getPluginNames } from "@utils/http-utils";
import { GetPlugins } from "@utils/plugin-utils";
import React from "react";


interface IState {
	currentLayout?: Layout;
	plugins?: PluginComponent[];
	currentButton?: IPositioner | { colIndex: number, rowIndex: number }
}

function getLayoutFromId(layouts: Layout[], layoutId: string) {
	return layouts.find(({ id }) => id === layoutId);
}

export default class Admin extends React.Component<{}, IState> {

	private layouts: Layout[];
	private parentLayoutsIds: string[] = [];

	constructor(props) {
		super(props);
		this.state = {};
	}

	async componentDidMount() {
		try {
			this.layouts = await getLayout();
			if (this.layouts.length <= 0)
				this.layouts.push(createLayout())
			this.setState({ currentLayout: this.layouts[0] });
		} catch (err) {
			console.error("failed fetching layouts:", err)
		}

		try {
			const plugins = await GetPlugins(await getPluginNames());
			this.setState({ plugins });
		} catch (err) {
			console.error("failed fetching plugins:", err);
		}

	}

	onLayoutChangeRequest = (layoutId: string) => {
		const layout = getLayoutFromId(this.layouts, layoutId);
		if (layout) {
			this.parentLayoutsIds.push(this.state.currentLayout.id);
			this.setState({ currentLayout: layout });
		} else {
			console.warn("could not find layout ", layoutId);
		}
	}


	render() {
		console.log("re-rendered")
		const { currentLayout: layout, currentButton, plugins } = this.state;
		return (
			<div className={styles["admin-container"]}>
				{
					layout && (<Visualizer
						onButtonClicked={(pos) => this.setState({ currentButton: pos })}
						layout={layout} />)
				}

				{
					(currentButton && plugins && plugins.length > 0) ? <ButtonParametrer button={currentButton} plugins={plugins} /> : (<div>pick a button</div>)
				}

			</div>
		)
	}
}
