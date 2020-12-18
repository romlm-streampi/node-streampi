import { Component } from "react";
import ScriptSetter from "../components/admin/script-parametrer/script-setter";
import ScriptPanel from "../components/admin/scripts-panel/scripts-panel";
import ButtonInfo, { BackButtonInfo, FolderButtonInfo, ScriptableButtonInfo } from "../model/button-info";
import Layout, { ButtonPositioner, getDefaultLayout, setButtonForLayoutAt } from "../model/layout";
import ScriptInfo from "../model/script-info";
import Visualizer from "../components/shared/visualizer/visualizer";
import styles from "../styles/Admin.module.css";
import { getLayoutFromServer, prepareLayout, saveLayout } from "../model/utils/client-utils";


const ADD_FOLDER_SCRIPT = { id: "addFolder", name: "add folder", category: "management" };

interface AdminState {
	pickedScript: ScriptInfo | undefined,
	pickedButton: ButtonPositioner | undefined,
	currentLayout: Layout
}

export default class Admin extends Component<{}, AdminState> {

	private rootLayout: Layout = getDefaultLayout();
	private scripts: ScriptInfo[] = [];

	constructor(props: {} | Readonly<{}>) {
		super(props);

		this.state = {
			pickedButton: undefined,
			pickedScript: undefined,
			currentLayout: this.rootLayout
		}
	}

	componentDidMount() {

		// TODO : implement server fetching
		this.scripts.push({ id: "scr1", name: "test", category: "test category", parameters: {} });
		this.scripts.push({ id: "scr2", name: "test2", category: "test category 2", parameters: {} });


		this.scripts.push(ADD_FOLDER_SCRIPT);

		getLayoutFromServer().then(
			(layout: Layout) => {
				this.rootLayout = prepareLayout(layout);
				this.setState({ currentLayout: this.rootLayout });
			});

	}

	onScriptPicked = (script: ScriptInfo) => {
		this.setState({ pickedScript: script })
	}

	onButtonClicked = (positioner: ButtonPositioner) => {

		const { info } = positioner;

		const { pickedScript } = this.state;
		if (!(info instanceof BackButtonInfo)) {
			
			if (pickedScript) {
				this.setState({ pickedButton: positioner })
			} else {
				if (!info) {
					console.log("no info provided");
				}
				else if ((info as ScriptableButtonInfo).script) {
					this.setState({pickedButton: positioner, pickedScript: (info as ScriptableButtonInfo).script});
				}
				else if ((info as FolderButtonInfo).layout) {
					this.setState({ currentLayout: (info as FolderButtonInfo).layout, pickedButton: undefined })
				}
			}
		} else {
			this.setState({currentLayout: info.layout});
		}

	}

	onScriptDelete = () => {

		const { pickedButton, currentLayout } = this.state;

		currentLayout.buttons = currentLayout.buttons.filter((positioner: ButtonPositioner) => (positioner.colIndex !== pickedButton?.colIndex || positioner.rowIndex !== pickedButton.rowIndex))
		this.setState({ pickedButton: undefined });

		saveLayout(this.rootLayout);

	}

	onScriptSet = (info: ButtonInfo) => {

		const { pickedScript, pickedButton, currentLayout } = this.state;

		if (pickedScript && pickedButton) {

			let buttonInfo: ScriptableButtonInfo | FolderButtonInfo;
			if (pickedScript.category === "management") {
				// implement all management scripts
				if (true) {
					const backButton: BackButtonInfo = new BackButtonInfo(currentLayout);
					const subLayout: Layout = { rowNumber: currentLayout.rowNumber, colNumber: currentLayout.colNumber, buttons: [{ colIndex: 0, rowIndex: 0, info: backButton }] }
					buttonInfo = { text: info.text, iconPath: info.iconPath, layout: subLayout };
				}

			}

			else {
				buttonInfo = { text: info.text, iconPath: info.iconPath, script: pickedScript };

			}

			const positioner: ButtonPositioner = pickedButton;
			positioner.info = buttonInfo;
			setButtonForLayoutAt(currentLayout, positioner);

			this.setState({ pickedScript: undefined, pickedButton: undefined });

			saveLayout(this.rootLayout);
		}
	}

	onScriptCloseRequested = () => {
		this.setState({ pickedButton: undefined, pickedScript: undefined });
	}

	render() {

		const { pickedButton, pickedScript, currentLayout } = this.state;

		return (
			<div className={styles.admin}>
				{(pickedButton && pickedScript) && <ScriptSetter scriptInfo={pickedButton?.info} onDelete={this.onScriptDelete} onCloseRequested={this.onScriptCloseRequested} onScriptChanged={this.onScriptSet} />}
				<Visualizer layout={currentLayout} onButtonClicked={this.onButtonClicked} className={styles.visualizer} highlightSelected={true} />
				<ScriptPanel scripts={this.scripts} onScriptPicked={this.onScriptPicked} />
			</div>
		)
	}

}
