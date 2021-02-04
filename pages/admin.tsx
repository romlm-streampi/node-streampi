import Visualizer from "@components/visualizer";
import Layout from "@model/layout";
import { MANAGEMENT_SCRIPTS } from "@model/management-scripts";
import { IScriptDescriptor, IScriptInstance } from "@model/script";
import { nanoid } from "nanoid";
import React from "react";

const testDescriptor: IScriptDescriptor = {
	id: {
		moduleName: "test",
		script: "test"
	},
	info: {
		displayName: "a test script"
	}

}

const testInstance: IScriptInstance = {
	descriptor: testDescriptor,
	text: "test script",
	iconPath: "/images/test.png"
}


interface IState {
	layouts: Layout[];
}

export default class Admin extends React.Component<{}, IState> {

	constructor(props) {
		super(props);
		this.state = { layouts: [] }
	}

	componentDidMount() {
		const testInstance2 = {
			descriptor: MANAGEMENT_SCRIPTS.ADD_FOLDER_DESCRIPTOR,
			parameters: { layoutId: nanoid() },
			text: "test script 2",
			iconPath: "/resources/nico_plat.png"
		}
		const positioners = [
			{ script: testInstance, colIndex: 1, rowIndex: 2 },
			{ script: testInstance2, colIndex: 2, rowIndex: 3 }
		]
		this.setState({ layouts: [new Layout(nanoid(), { colNumber: 5, rowNumber: 3 }, positioners)] });
	}

	onLayoutChangeRequest = (id: string) => {
		console.log("fetching layout", id);
	}


	render() {
		const { layouts } = this.state;
		return (
			<div>
				{
					(layouts && layouts.length > 0) && (<Visualizer onLayoutChangeRequest={this.onLayoutChangeRequest} layout={layouts[0]} />)
				}
			</div>
		)
	}
}
