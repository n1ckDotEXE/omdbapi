import React from "react";

const Button = (props) => {
	//console.log(props.propsName);
	return (
		<button
			disabled={props.propsButtonToggle}
			onClick={props.propsOnClick}
			className={props.propsClassName}
		>
			{props.propsName}
		</button>
	);
};

export default Button;
