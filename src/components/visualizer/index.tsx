import Layout, { IPositioner } from "@model/layout";
import { IsFolderScript, IsManagementScript } from "@model/management-scripts";
import { isEqual } from "lodash";
import { nanoid } from "nanoid";
import React from "react";
import styles from './visualizer.module.scss';



const getPositionStyling = (positioner: IPositioner) => [styles[`col-${positioner.colIndex}`], styles[`row-${positioner.rowIndex}`]].join(' ');

const Button = ({ positioner, onClick }: { positioner: IPositioner, onClick: (positioner: IPositioner) => void, key?: string }) => {
	return (<div className={[getPositionStyling(positioner), styles.button].join(' ')} onClick={(ev) => onClick(positioner)}>
		<div className={styles["icon-canvas"]}>
			<img src={positioner.script.iconPath} className={styles.icon} />
		</div>
		<span className={styles.text}>{positioner.script.text}</span>
	</div>)
}


interface IProps {
	layout: Layout;
	onButtonClicked?: (positioner: IPositioner) => void;
}


export default function Visualizer({ layout, onButtonClicked }: IProps) {

	let sizeStyle;
	if (isEqual(layout.size, { colNumber: 3, rowNumber: 2 })) {
		sizeStyle = styles["container-mini"];
	} else if (isEqual(layout.size, { colNumber: 5, rowNumber: 3 })) {
		sizeStyle = styles['container-default']
	} else if (isEqual(layout.size, { colNumber: 8, rowNumber: 4 })) {
		sizeStyle = styles['container-large']
	}

	return (
		<div className={[styles.container, sizeStyle].join(' ')}>
			{
				layout.positioners.map((positioner) => <Button key={nanoid()} onClick={onButtonClicked} positioner={positioner} />)
			}
		</div>
	);
}
