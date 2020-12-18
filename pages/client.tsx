import { NextPageContext } from "next";
import { useState } from "react";
import Visualizer from "../components/shared/visualizer/visualizer";
import { FolderButtonInfo, ScriptableButtonInfo } from "../model/button-info";
import Layout, { ButtonPositioner } from "../model/layout";
import { getLayoutFromServer, prepareLayout, sendScript } from "../model/utils/client-utils";
import styles from "../styles/Client.module.css";

const Client = ({ rootLayout }: { rootLayout: Layout }) => {

	rootLayout = prepareLayout(rootLayout);


	const [currentLayout, setCurrentLayout] = useState(rootLayout);


	const onButtonClicked = ({ info }: ButtonPositioner) => {


		if ((info as ScriptableButtonInfo)?.script) {
			sendScript((info as ScriptableButtonInfo).script);
		}
		else if ((info as FolderButtonInfo)?.layout) {
			setCurrentLayout((info as FolderButtonInfo).layout);
		}

	}

	return (
		<div className={styles.client}>
			<Visualizer layout={currentLayout} onButtonClicked={onButtonClicked} />
		</div>
	)
}

export async function getServerSideProps(_context: NextPageContext) {

	const rootLayout = await getLayoutFromServer();

	return {
		props: {
			rootLayout,
		}
	}

}

export default Client;