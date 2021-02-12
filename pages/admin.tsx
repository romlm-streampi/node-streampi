import ButtonParametrer from "@components/button-parametrer";
import Visualizer from "@components/visualizer";
import Layout, { SetPositioner, createLayout, IManagementPositioner, IPositioner, RemovePositioner } from "@model/layout";
import { PluginComponent } from "@model/plugin-export";
import styles from "@styles/admin.module.scss";
import { deleteImage, getLayout, getPluginNames, saveLayouts, sendFile } from "@utils/http-utils";
import { GetPlugins } from "@utils/plugin-utils";
import React from "react";


interface IState {
	currentLayoutId?: string;
	plugins?: PluginComponent[];
	currentButton?: IPositioner;
}

function layoutArrIndexFromId(layouts: Layout[], layoutId: string) {
	return layouts.map(({ id }, index) => ({ id, index })).find(({ id }) => id === layoutId).index;
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
				this.layouts.push(createLayout({}))
			this.setState({ currentLayoutId: this.layouts[0].id });
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
		if (layoutId === "__parent__" && this.parentLayoutsIds.length > 0) {
			this.setState({ currentLayoutId: this.parentLayoutsIds.pop(), currentButton: undefined })
		} else {
			let newLayout: Layout = this.layouts[layoutArrIndexFromId(this.layouts, layoutId)];
			if (newLayout === undefined) {
				newLayout = createLayout({ size: this.layouts[0].size, id: layoutId });
				this.layouts.push(newLayout);
			}
			SetPositioner(newLayout, {
				colIndex: 1,
				rowIndex: 1,
				info: { text: "back", iconPath: "/resources/back.png" },
				management: {
					type: "folder",
					params: {
						layoutId: "__parent__"
					}
				}
			} as IManagementPositioner);
			this.parentLayoutsIds.push(this.state.currentLayoutId);
			this.setState({ currentLayoutId: layoutId, currentButton: undefined })
		}
	}

	onButtonInfoChange = ({ text, icon }: { text: string, icon: File }) => {
		const { currentButton } = this.state;
		const currentLayout = this.layouts[layoutArrIndexFromId(this.layouts, this.state.currentLayoutId)];
		if (currentButton.info) {
			deleteImage(currentButton.info.iconPath);
		}
		sendFile(icon).then((iconPath) => {
			currentButton.info = { text, iconPath };
			SetPositioner(
				currentLayout,
				currentButton
			)
			saveLayouts(this.layouts);
			this.setState({ currentButton });
		})
	}

	onButtonDeleteRequest = () => {
		const { currentButton: pos } = this.state;
		if (pos) {
			if(pos.info) {
				deleteImage(pos.info.iconPath);
			}
			const currentLayout = this.layouts[layoutArrIndexFromId(this.layouts, this.state.currentLayoutId)];
			console.log(pos);
			RemovePositioner(currentLayout, pos);
			this.setState({currentButton: undefined})
			saveLayouts(this.layouts);
		}

	}


	render() {
		const { currentLayoutId: layoutId, currentButton, plugins } = this.state;
		return (
			<div className={styles.container}>
				{
					(this.layouts && this.layouts[layoutArrIndexFromId(this.layouts, layoutId)]) && (<Visualizer
						onButtonClicked={(pos) => this.setState({ currentButton: pos })}
						layout={this.layouts[layoutArrIndexFromId(this.layouts, layoutId)]} />)
				}

				{
					(currentButton && plugins && plugins.length > 0) ? (<ButtonParametrer
						onButtonInfoSave={this.onButtonInfoChange}
						button={currentButton}
						onScriptDelete={this.onButtonDeleteRequest}
						plugins={plugins}
						onLayoutChangeRequest={this.onLayoutChangeRequest} />)
						: (<div className={styles["button-mock"]}>pick a button</div>)
				}

			</div>
		)
	}
}
