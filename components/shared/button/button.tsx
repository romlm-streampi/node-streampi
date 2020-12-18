import ButtonInfo from "../../../model/button-info"
import styles from "./button.module.css";

const Button = ({info}: {info: ButtonInfo}) => {

	return (
	<div className={styles.button}>
		<div className={styles["btn-image-canvas"]}>
			<img 
				src={info.iconPath ? info.iconPath : "/resources/default.png"}
				className={styles["btn-image"]}
			/>	
		</div>
		
		<span className={styles["btn-legend"]} >
			{info.text}
		</span>
	</div>
	)

}

export default Button;