import React from "react";
import "../App.css";
import "./styles/Layout.css";
import { Grid, TextField } from "@mui/material";
// import Grid from "@mui/material";

const Layout = (props) => {
	const { template } = props;
	const title =
		template === "report"
			? "Отчет по производственной практике"
			: "Дневник практики";

	return (
		<div>
			<Grid container>
				<Grid item xs={5}>
					{Object.keys(props.documentData).map((field) => (
						<Grid item xs={20}>
							<div key={field}>
								<label>{field}</label>
								<TextField
									type="text"
									name={field}
									value={props.documentData[field]}
									onChange={props.handleInputChange}
								/>
							</div>
						</Grid>
					))}
				</Grid>

				<Grid item xs={20} sm={10}>
					<div
						className="output"
						dangerouslySetInnerHTML={{ __html: props.htmlContent }}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default Layout;
