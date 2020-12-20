import { Component } from "react";
import ScriptSetter from "../components/admin/script-parametrer/script-setter";
import ScriptPanel from "../components/admin/scripts-panel/scripts-panel";
import Visualizer from "../components/shared/visualizer/visualizer";
import { BackButtonInfo, FolderButtonInfo, ScriptableButtonInfo } from "../model/button-info";
import Layout, { ButtonPositioner, getDefaultLayout, setButtonForLayoutAt } from "../model/layout";
import ScriptInfo from "../model/script-info";
import { deleteImage, getLayoutFromServer, getScriptsFromServer, prepareLayout, saveLayout } from "../model/utils/client-utils";
import styles from "../styles/Admin.module.css";


const ADD_FOLDER_SCRIPT = { name: "add folder", category: "management" };

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

		getScriptsFromServer().then((scripts: ScriptInfo[]) => {
			this.scripts = scripts;
			this.scripts.push(ADD_FOLDER_SCRIPT);
		})



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
					this.setState({ pickedButton: positioner, pickedScript: (info as ScriptableButtonInfo).script });
				}
				else if ((info as FolderButtonInfo).layout) {
					this.setState({ currentLayout: (info as FolderButtonInfo).layout, pickedButton: undefined })
				}
			}
		} else {
			this.setState({ currentLayout: info.layout });
		}

	}

	onScriptDelete = (positioner: ButtonPositioner) => {

		const { currentLayout } = this.state;

		currentLayout.buttons = currentLayout.buttons.filter((pos: ButtonPositioner) => (positioner.colIndex !== pos.colIndex || positioner.rowIndex !== pos.rowIndex))

		if (positioner.info?.iconPath) {
			deleteImage(positioner.info.iconPath);

		}

		this.setState({ pickedButton: undefined });
		saveLayout(this.rootLayout);

	}

	onScriptSet = (info: ScriptableButtonInfo) => {

		const { pickedScript, pickedButton, currentLayout } = this.state;

		if (pickedScript && pickedButton) {

			let buttonInfo: ScriptableButtonInfo | FolderButtonInfo;
			if (pickedScript.category === "management") {
				// implement all management scripts
				if (pickedScript === ADD_FOLDER_SCRIPT) {
					const backButton: BackButtonInfo = new BackButtonInfo(currentLayout);
					const subLayout: Layout = { rowNumber: currentLayout.rowNumber, colNumber: currentLayout.colNumber, buttons: [{ colIndex: 0, rowIndex: 0, info: backButton }] }
					buttonInfo = { text: info.text, iconPath: info.iconPath, layout: subLayout };
				} else {
					return;
				}

			}

			else {
				buttonInfo = { text: info.text, iconPath: info.iconPath, script: info.script };
				console.log(buttonInfo);

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
				{
					(pickedButton && pickedScript) &&
					(
						<>
							<ScriptSetter scriptInfo={pickedScript} positioner={pickedButton} onDelete={this.onScriptDelete} onCloseRequested={this.onScriptCloseRequested} onScriptChanged={this.onScriptSet} />
							<div className={styles["dark-filter"]}></div>
						</>
					)
				}
				<Visualizer layout={currentLayout} onButtonClicked={this.onButtonClicked} className={styles.visualizer} highlightSelected={true} />
				<ScriptPanel scripts={this.scripts} onScriptPicked={this.onScriptPicked} />
			</div>
		)
	}

}
