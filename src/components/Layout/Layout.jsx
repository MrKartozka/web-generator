import React, { forwardRef } from "react";
import "./Layout.css";
import InputField from "../Inputs/InputField";

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

		if (pastedData.length > 40) {
			event.preventDefault();
		}
	};

	return (
		<div className="container" ref={ref}>
			<div className="inputs">
				{fields.map((field) => (
					<InputField
						key={field}
						field={field}
						value={documentData[field] || ""}
						handleInputChange={handleInputChange}
						handleSelectChange={handleSelectChange}
						practiceTypes={practiceTypes}
						handlePaste={handlePaste}
					/>
				))}
			</div>
			<div className="output">
				<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
			</div>
		</div>
	);
});

export default Layout;
