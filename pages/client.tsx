import Visualizer from "@components/visualizer";
import Layout, { IManagementPositioner, IPositioner, IScriptPositioner } from "@model/layout";
import { executeScript, getLayout } from "@utils/http-utils";
import React from "react";
import styles from "@styles/client.module.scss";


interface IState {
	currentLayout: Layout;
}

function layoutArrIndexFromId(layouts: Layout[], layoutId: string) {
	return layouts.map(({ id }, index) => ({ id, index })).find(({ id }) => id === layoutId)?.index;
}

export default class Client extends React.Component<{}, IState> {

	private layouts: Layout[] = [];
	private parentLayoutIds: string[] = [];

	constructor(props) {
		super(props);
		this.state = { currentLayout: undefined };
	}

	componentDidMount() {
		getLayout().then((layouts) => {
			this.layouts = layouts;
			this.setState({currentLayout: layouts[0]})
		});
	}

	onButtonClicked = (pos: IPositioner) => {
		let feature: any;
		if(feature = (pos as IManagementPositioner).management) {
			if(feature.type === "folder") {
				if(feature.parameters.layoutId === "__parent__") {
					this.setState({currentLayout: this.layouts[layoutArrIndexFromId(this.layouts, this.parentLayoutIds.pop())]})
				} else {
					const newLayout = this.layouts[layoutArrIndexFromId(this.layouts, feature.parameters.layoutId)]
					this.parentLayoutIds.push(this.state.currentLayout.id);
					this.setState({currentLayout: newLayout})
				}
			}
		} else if(feature = (pos as IScriptPositioner).scripts) {
			feature.forEach(executeScript)
		}
	}


	render() {
		return (<div className={styles.container}>
			{
				this.state.currentLayout && <Visualizer
					layout={this.state.currentLayout}
					client={true}
					onButtonClicked={this.onButtonClicked}
				/>
			}

		</div>

		)
	}
}
