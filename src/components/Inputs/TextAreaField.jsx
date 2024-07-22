import React from "react";
import { TextField } from "@mui/material";

const TextAreaField = ({ field, value, handleInputChange, className }) => {
	return (
		<div className={className}>
			<label>{field}</label>
			<TextField
				type="text"
				name={field}
				value={value}
				onChange={handleInputChange}
				multiline
				rows={4}
				inputProps={field === "Индивидуальное задание"
				|| field === "Характеристика-отзыв"
				|| field === "Выводы и оценки кафедры" ?
					{ maxLength: 1000 }
					:
					{ maxLength: 118 }}
				fullWidth
				className={value ? "filled" : ""}
			/>
		</div>
	);
};

export default TextAreaField;
