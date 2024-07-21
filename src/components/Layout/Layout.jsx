import React, { forwardRef } from "react";
import "./Layout.css";
import InputField from "../Inputs/InputField";
import TextAreaField from "../Inputs/TextAreaField";

const Layout = forwardRef((props, ref) => {
	const {
		fields,
		documentData,
		handleInputChange,
		handleSelectChange,
		practiceTypes,
		htmlContent,
	} = props;

	const handlePaste = (event) => {
		const clipboardData = event.clipboardData || window.clipboardData;
		const pastedData = clipboardData.getData("Text");

		if (pastedData.length > 118) {
			event.preventDefault();
		}
	};

	return (
		<div className="container" ref={ref}>
			<div className="inputs">
				{fields.map((field) => (
					<div
						key={field}
						className="textarea-container hidden-print input-field"
					>
						{field.startsWith("Индивидуальное задание") ||
						field.startsWith("Характеристика-отзыв") ||
						field.startsWith("Выводы и оценки кафедры") ? (
							<TextAreaField
								field={field}
								value={documentData[field] || ""}
								handleInputChange={handleInputChange}
								className="hidden-print"
							/>
						) : (
							<InputField
								field={field}
								value={documentData[field] || ""}
								handleInputChange={handleInputChange}
								handleSelectChange={handleSelectChange}
								practiceTypes={practiceTypes}
								handlePaste={handlePaste}
								className="input-field"
							/>
						)}
					</div>
				))}
			</div>
			<div className="output">
				<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
			</div>
		</div>
	);
});

export default Layout;
