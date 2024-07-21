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
}) => {
	return (
		// <div className={className}>
		<div>
			<label>{field}</label>
			{field === "Вид практики" ? (
				<FormControl fullWidth>
					<InputLabel>{field}</InputLabel>
					<Select
						name={field}
						value={value}
						onChange={handleSelectChange}
						className={value ? "filled" : className}
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
					className={value ? "filled" : className}
				/>
			)}
		</div>
	);
};

export default InputField;
