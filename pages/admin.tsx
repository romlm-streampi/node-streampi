import Visualizer from "@components/visualizer";
import ScriptPicker from "@components/script-picker";
import Layout, { createLayout, IPositioner } from "@model/layout";
import { IsFolderScript, IsManagementScript } from "@model/management-scripts";
import { PluginComponent } from "@model/plugin-export";
import { getLayout, executeScript, getPluginNames } from "@utils/http-utils";
import { GetPlugins } from "@utils/plugin-utils";
import React from "react";
import styles from "@styles/admin.module.scss";


interface IState {
	currentLayout?: Layout;
	plugins?: PluginComponent[];
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
			console.log("changed layout");
		} else {
			console.warn("could not find layout ", layoutId);
		}
	}

	onButtonClicked = (positioner: IPositioner): Promise<any> | undefined => {
		const descriptor = positioner.script.descriptor;
		if (IsManagementScript(descriptor)) {
			if (IsFolderScript(descriptor) && positioner.script.parameters?.layoutId) {
				this.onLayoutChangeRequest(positioner.script.parameters?.layoutId);
			}

		} else {
			return executeScript(positioner.script);
		}
	}


	render() {
		const { currentLayout: layout, plugins } = this.state;
		return (
			<div className={styles["admin-container"]}>
				{
					layout && (<Visualizer onButtonClicked={this.onButtonClicked} layout={layout} />)
				}
				{
					plugins && (<ScriptPicker plugins={plugins} />)
				}
			</div>
		)
	}
}
