import ButtonParametrer from "@components/button-parametrer";
import Visualizer from "@components/visualizer";
import Layout, { SetPositioner, createLayout, IManagementPositioner, IPositioner, RemovePositioner, IsManagementScript, IScriptPositioner, IPositionerInfo } from "@model/layout";
import { PluginScript } from "@model/plugin-export";
import styles from "@styles/admin.module.scss";
import { deleteImage, getLayout, getPluginNames, saveLayouts, sendFile } from "@utils/http-utils";
import { GetPlugins } from "@utils/plugin-utils";
import React from "react";
import ReactDOM from "react-dom";
import "@styles/styles.scss";


interface IState {
	currentLayoutId?: string;
	plugins?: PluginScript[];
	currentButton?: IPositioner;
}

function layoutArrIndexFromId(layouts: Layout[], layoutId: string) {
	return layouts.map(({ id }, index) => ({ id, index })).find(({ id }) => id === layoutId)?.index;
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
					parameters: {
						layoutId: "__parent__"
					}
				}
			} as IManagementPositioner);
			this.parentLayoutsIds.push(this.state.currentLayoutId);
			this.setState({ currentLayoutId: layoutId, currentButton: undefined })
		}
	}

	onButtonDeleteRequest = () => {
		const { currentButton: pos } = this.state;
		if (pos) {
			if (pos.info) {
				deleteImage(pos.info.iconPath);
			}
			const currentLayout = this.layouts[layoutArrIndexFromId(this.layouts, this.state.currentLayoutId)];
			RemovePositioner(currentLayout, pos);
			const mgmt = (pos as IManagementPositioner).management;
			if(mgmt && mgmt.parameters?.layoutId) {
				this.layouts = this.layouts.filter(({id}) => id !== mgmt.parameters.layoutId);
			}
			this.setState({ currentButton: undefined })
			saveLayouts(this.layouts);
		}

	}

	onButtonClicked = (pos: IPositioner) => {
		if (IsManagementScript(pos) && (pos as IManagementPositioner).management.parameters.layoutId === "__parent__") {
			this.setState({ currentLayoutId: this.parentLayoutsIds.pop(), currentButton: undefined })
		} else {
			this.setState({ currentButton: pos });
		}
	}

	onButtonSaved = async ({ info, scripts, management }: any) => {
		const currentLayout = this.layouts[layoutArrIndexFromId(this.layouts, this.state.currentLayoutId)];

		const newButton: IPositioner = { ...this.state.currentButton };
		if (info) {
			const { text, icon }: { text: string, icon: File } = info;
			if (newButton.info) {
				if (text) {
					newButton.info.text = text;
				}
				if (icon instanceof File) {
					newButton.info.iconPath = await sendFile(icon);
				}

			} else {
				newButton.info = { text, iconPath: await sendFile(icon) }
			}
		}
		if (management) {
			delete (newButton as IScriptPositioner)?.scripts;
			if(management.type === "folder") {
				const layout: Layout = createLayout({size: currentLayout.size});
				management.parameters = {layoutId: layout.id};
				this.layouts.push(layout);
			}
			(newButton as IManagementPositioner).management = management;
		} else if (scripts) {
			const mgmt = (newButton as IManagementPositioner)?.management;
			if(mgmt?.type === "folder" && mgmt.parameters.layoutId) {
				this.layouts = this.layouts.filter(({id}) => id !== mgmt.parameters.layoutId);
			}
			delete (newButton as IManagementPositioner)?.management;
			(newButton as IScriptPositioner).scripts = scripts
		}

		SetPositioner(currentLayout, newButton);
		this.setState({ currentButton: newButton });
		await saveLayouts(this.layouts);
	}


	render() {
		const { currentLayoutId: layoutId, currentButton, plugins } = this.state;
		return (
			<div className={styles.container}>
				{
					(this.layouts && this.layouts[layoutArrIndexFromId(this.layouts, layoutId)]) && (<Visualizer
						onButtonClicked={this.onButtonClicked}
						layout={this.layouts[layoutArrIndexFromId(this.layouts, layoutId)]} />)
				}

				{
					(currentButton && plugins && plugins.length > 0) ? (<ButtonParametrer
						onPositionerSave={this.onButtonSaved}
						button={currentButton}
						onPositionerDelete={this.onButtonDeleteRequest}
						plugins={plugins}
						onLayoutChangeRequest={this.onLayoutChangeRequest} />)
						: (<div className={styles["button-mock"]}>pick a button</div>)
				}

			</div>
		)
	}
}

ReactDOM.render(<Admin />, document.getElementById("root"));
