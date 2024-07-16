import React from "react";
import "../App.css";
import "./styles/Layout.css";
import { Grid, TextField } from "@mui/material";

const Layout = (props) => {
	const { fields } = props;
	const title =
		props.template === "report"
			? "Отчет по производственной практике"
			: "Дневник практики";

	return (
		<div className="container">
			<div className="inputs">
				{fields.map((field) => (
					<div key={field}>
						<label>{field}</label>
						<TextField
							type="text"
							name={field}
							value={props.documentData[field]}
							onChange={props.handleInputChange}
							fullWidth
						/>
					</div>
				))}
			</div>
			<div className="output">
				<div dangerouslySetInnerHTML={{ __html: props.htmlContent }} />
			</div>
		</div>
	);
};

export default Layout;
