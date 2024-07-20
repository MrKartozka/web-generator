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
}) => {
	return (
		<div>
			<label>{field}</label>
			{field === "Вид практики" ? (
				<FormControl fullWidth>
					<InputLabel>{field}</InputLabel>
					<Select
						name={field}
						value={value}
						onChange={handleSelectChange}
						className={value ? "filled" : ""}
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
					value={value}
					onChange={handleInputChange}
					onPaste={handlePaste}
					inputProps={{ maxLength: 40 }}
					fullWidth
					className={value ? "filled" : ""}
				/>
			)}
		</div>
	);
};

export default InputField;
