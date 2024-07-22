import React from "react";
import {
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";

const InputField = ({
	field,
	value,
	handleInputChange,
	handleSelectChange,
	practiceTypes,
	handlePaste,
	className,
	practicesTypes,
}) => {

	let typesCollection = [];


	if (field === "Вид практики") {
		typesCollection = practiceTypes;
	}
	else if (field === "Тип практики") {
		typesCollection = practicesTypes;
	}


	return (
		// <div className={className}>
		<div>
			<label>{field}</label>
			{field === "Вид практики" || field === "Тип практики" ? (
				<FormControl fullWidth>
					<InputLabel>{field}</InputLabel>
					<Select
						name={field}
						value={value}
						onChange={handleSelectChange}
						className={value ? "filled" : className}
					>
						{typesCollection.map((type) => (
							<MenuItem key={type} value={type}>
								{type}
							</MenuItem>
						))
						}
					</Select>
				</FormControl>
			) : (
				<TextField
					type="text"
					name={field}
					value={value}
					onChange={handleInputChange}
					onPaste={handlePaste}
					inputProps={{ maxLength: 100 }}
					fullWidth
					className={value ? "filled" : className}
				/>
			)}
		</div>
	);
};

export default InputField;
