import React, { forwardRef } from "react";
import "../App.css";
import "./styles/Layout.css";
import {
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";

const Layout = forwardRef((props, ref) => {
	const {
		fields,
		documentData,
		handleInputChange,
		handleSelectChange,
		practiceTypes,
	} = props;

	const handlePaste = (event) => {
		const clipboardData = event.clipboardData || window.clipboardData;
		const pastedData = clipboardData.getData("Text");

		if (pastedData.length > 40) {
			event.preventDefault();
		}
	};

	return (
		<div className="container" ref={ref}>
			<div className="inputs">
				{fields.map((field) => (
					<div key={field}>
						<label>{field}</label>
						{field === "Вид практики" ? (
							<FormControl fullWidth>
								<InputLabel>{field}</InputLabel>
								<Select
									name={field}
									value={documentData[field]}
									onChange={handleSelectChange}
									className={
										documentData[field] ? "filled" : ""
									}
								>
									{practiceTypes.map((type) => (
										<MenuItem key={type} value={type}>
											{type}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						) : (
							<TextField
								type="text"
								name={field}
								value={documentData[field]}
								onChange={handleInputChange}
								onPaste={handlePaste}
								inputProps={{ maxLength: 40 }}
								fullWidth
								className={documentData[field] ? "filled" : ""}
							/>
						)}
					</div>
				))}
			</div>
			<div className="output">
				<div dangerouslySetInnerHTML={{ __html: props.htmlContent }} />
			</div>
		</div>
	);
});

export default Layout;
