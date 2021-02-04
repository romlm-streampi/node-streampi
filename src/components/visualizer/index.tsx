import Layout, { IPositioner } from "@model/layout";
import { IsFolderScript, IsManagementScript } from "@model/management-scripts";
import { isEqual } from "lodash";
import { nanoid } from "nanoid";
import React from "react";
import styles from './visualizer.module.scss';



const getPositionStyling = (positioner: IPositioner) => [styles[`col-${positioner.colIndex}`], styles[`row-${positioner.rowIndex}`]].join(' ');

const Button = ({ positioner, onClick }: { positioner: IPositioner, onClick: (positioner: IPositioner) => void }) => {
	return (<div className={[getPositionStyling(positioner), styles.button].join(' ')} onClick={(ev) => onClick(positioner)}>
		<div className={styles["icon-canvas"]}>
			<img src={positioner.script.iconPath} className={styles.icon} />
		</div>
		<span className={styles.text}>{positioner.script.text}</span>
	</div>)
}


interface IProps {
	layout: Layout;
	onLayoutChangeRequest?: (id: string) => void;
	onButtonClicked?: (positioner: IPositioner) => void;
}


export default function Visualizer({ layout, onLayoutChangeRequest, onButtonClicked }: IProps) {

	let sizeStyle;
	if (isEqual(layout.size, { colNumber: 3, rowNumber: 2 })) {
		sizeStyle = styles["container-mini"];
	} else if (isEqual(layout.size, { colNumber: 5, rowNumber: 3 })) {
		sizeStyle = styles['container-default']
	} else if (isEqual(layout.size, { colNumber: 8, rowNumber: 4 })) {
		sizeStyle = styles['container-large']
	}

	const onClick = (positioner: IPositioner) => {
		const mgmtScript = IsManagementScript(positioner.script.descriptor);
		if (mgmtScript && onLayoutChangeRequest) {
			if (IsFolderScript(positioner.script.descriptor) && positioner.script.parameters?.layoutId) {
				onLayoutChangeRequest(positioner.script.parameters.layoutId);
			}
		} else {
			if (onButtonClicked)
				onButtonClicked(positioner);
		}
	}

	return (
		<div className={[styles.container, sizeStyle].join(' ')}>
			{
				layout.positioners.map((positioner) => <Button key={nanoid()} onClick={onClick} positioner={positioner} />)
			}
		</div>
	);
}
