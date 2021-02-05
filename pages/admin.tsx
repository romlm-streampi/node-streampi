import Visualizer from "@components/visualizer";
import Layout, { createLayout, IPositioner } from "@model/layout";
import { IsFolderScript, IsManagementScript } from "@model/management-scripts";
import { getLayout, executeScript } from "@utils/http-utils";
import React from "react";


interface IState {
	currentLayout?: Layout;
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
		getLayout().then((data: Layout[]) => {
			this.layouts = data;
			if (data.length <= 0)
				this.layouts.push(createLayout())
			this.setState({ currentLayout: this.layouts[0] });
		});
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
			if(IsFolderScript(descriptor) && positioner.script.parameters?.layoutId) {
				this.onLayoutChangeRequest(positioner.script.parameters?.layoutId);
			}

		} else {
			return executeScript(positioner.script);
		}
	}


	render() {
		const { currentLayout: layout } = this.state;
		return (
			<div>
				{
					layout && (<Visualizer onButtonClicked={this.onButtonClicked} layout={layout} />)
				}
			</div>
		)
	}
}
