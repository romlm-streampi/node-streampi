import { useState } from "react";
import ButtonInfo from "../../../model/button-info";
import Layout, { ButtonPositioner, getButtonForLayoutAt } from "../../../model/layout";
import Button from "../button/button";
import styles from "./visualizer.module.css";

interface IProps {
	layout: Layout;
	onButtonClicked: (buttonPositioner: ButtonPositioner) => void;
	className?: string;
	highlightSelected?: boolean;
}

interface FrameProps {
	buttonInfo?: ButtonInfo;
	onClick?: any;
	selected?: boolean;
}

const ButtonFrame = ({ buttonInfo, onClick, selected }: FrameProps) => {
	return (
		<div className={styles["button-frame"] + (selected ? ` ${styles["selected-button"]}` : "")} onClick={onClick}>
			{
				buttonInfo && <Button info={buttonInfo} />
			}
		</div>
	);
}

ButtonFrame.defaultProps = {
	selected: false
}

const Visualizer = ({ layout, onButtonClicked, className, highlightSelected }: IProps) => {

	const [selected, setSelected] = useState<ButtonPositioner>({ colIndex: -1, rowIndex: -1 });

	const onclick = (positioner: ButtonPositioner) => {

		
		setSelected(positioner);
		onButtonClicked(positioner)

	}

	return (
		<div className={`${styles.visualizer} ${className ? className : ""}`} >
			{
				// value param ignored here since Array.from({length}) produces an array of undefined of specified length
				Array.from({ length: layout.colNumber }).map((_, colId) => {
					return (
						<div className={styles["visualizer-column"]} key={`col-${colId}`}>
							{
								// same as above
								Array.from({ length: layout.rowNumber }).map((_, rowId) => {
									const buttonPositioner = getButtonForLayoutAt(layout, colId as number, rowId as number) || { colIndex: colId, rowIndex: rowId };
									return (<ButtonFrame key={`col-${colId}_row-${rowId}`} buttonInfo={buttonPositioner?.info} onClick={() => onclick(buttonPositioner)} selected={(rowId === selected.rowIndex && colId === selected.colIndex && highlightSelected)} />)
								})
							}
						</div>
					)
				})
			}
		</div>
	)
};

Visualizer.defaultProps = {
	highlightSelected: false
}

export default Visualizer;