import ReactDOM from "react-dom";
import React from "react";

import '@styles/styles.scss';

import Admin from "@pages/admin";
import Client from "@pages/client";

switch (document.location.pathname.replace(/\//, '').toLowerCase()) {
	case "admin":
		ReactDOM.render(<Admin />, document.getElementById("root"));
		break;
	case "client":
		ReactDOM.render(<Client />, document.getElementById("root"));
		break;
	default:
		ReactDOM.render(<Admin />, document.getElementById("root"));
		break;

}
