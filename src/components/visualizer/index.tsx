import Layout, { IPositioner } from "@model/layout";
import { isEqual, range } from "lodash";
import { nanoid } from "nanoid";
import React from "react";
import styles from './visualizer.module.scss';



const getPositionStyling = (positioner: IPositioner) => [styles[`col-${positioner.colIndex}`], styles[`row-${positioner.rowIndex}`]].join(' ');

const Button = ({ positioner, onClick }: { positioner: IPositioner, onClick: Function }) => {
	return (<div className={[getPositionStyling(positioner), styles.button].join(' ')} onClick={() => onClick()}>
		<div className={styles["icon-canvas"]}>
			<img src={positioner.info.iconPath} className={styles.icon} />
		</div>
		<span className={styles.text}>{positioner.info.text}</span>
	</div>)
}

const EmptyButton = ({ position, onClick }: { position: IPositioner, onClick: Function }) => {
	return (<div className={[getPositionStyling(position), styles.button].join(' ')} onClick={() => onClick()}>
		<div className={styles["icon-canvas"]}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" width="50%" height="50%">
				<path d="M0 0h24v24H0z" fill="none" />
				<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
			</svg>
		</div>
	</div>)
}


interface IProps {
	layout: Layout;
	onButtonClicked: (positioner: IPositioner) => void;
}


export default function Visualizer({ layout, onButtonClicked }: IProps) {

	let sizeStyle;
	if (isEqual(layout.size, { colNumber: 3, rowNumber: 2 })) {
		sizeStyle = styles["container-mini"];
	} else if (isEqual(layout.size, { colNumber: 5, rowNumber: 3 })) {
		sizeStyle = styles['container-default']
	} else if (isEqual(layout.size, { colNumber: 8, rowNumber: 4 })) {
		sizeStyle = styles['container-large']
	} else {
		throw new Error("unknow layout size: " + layout.size);
	}

	return (
		<div className={[styles.container, sizeStyle].join(' ')}>
			{
				range(1, layout.size.colNumber + 1).map(colIndex => {
					return range(1, layout.size.rowNumber + 1).map(rowIndex => {
						return (() => {
							const positioner = (layout.positioners || []).find(({ colIndex: x, rowIndex: y }) => colIndex === x && rowIndex === y);
							if (positioner)
								return <Button positioner={positioner} key={nanoid()} onClick={() => onButtonClicked(positioner)} />
							return <EmptyButton position={{ colIndex, rowIndex }} key={nanoid()} onClick={() => onButtonClicked({colIndex, rowIndex})} />
						})()
					})
				})
			}
		</div>
	);
}
