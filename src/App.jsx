import React, { useState, useEffect } from "react";
import showdown from "showdown";
import Sidebar from "./components/Sidebar";
import "./App.css";
import Layout from "./components/Layout";
import { Box, Typography } from "@mui/material";

// Шаблоны документов
const templates = {
	report: `
**Обучающийся:** ___ФИО___

**Группа:** ___Группа___

**Вид практики:** ___Вид___

**Тип практики:** ___Тип___

**Наименование предприятия:** ___Предприятие___

**Руководитель:** ___Руководитель___

**Оценка:** ___Оценка___
  `,
	diary: `
**Обучающийся:** ___ФИО___

**Специальность:** ___Специальность___

**Группа:** ___Группа___

**Форма обучения:** ___Форма___

**Вид практики:** ___Вид___

**Тип практики:** ___Тип___

**Учебный год:** ___Год___
  `,
};

// Поля ввода для каждого шаблона
const inputFields = {
	report: [
		"ФИО",
		"Группа",
		"Вид",
		"Тип",
		"Предприятие",
		"Руководитель",
		"Оценка",
	],
	diary: ["ФИО", "Специальность", "Группа", "Форма", "Вид", "Тип", "Год"],
};

const DocumentGenerator = () => {
	const [template, setTemplate] = useState("report");
	const [documentData, setDocumentData] = useState({
		ФИО: "",
		Группа: "",
		Вид: "",
		Тип: "",
		Предприятие: "",
		Руководитель: "",
		Оценка: "",
		Специальность: "",
		Форма: "",
		Год: "",
	});

	const handleTemplateChange = (template) => {
		setTemplate(template);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setDocumentData({
			...documentData,
			[name]: value,
		});
	};

	const converter = new showdown.Converter();
	const generateMarkdown = () => {
		let markdown = templates[template];
		for (let key in documentData) {
			const regex = new RegExp(`___${key}___`, "g");
			markdown = markdown.replace(regex, documentData[key]);
		}
		return markdown;
	};

	const htmlContent = converter.makeHtml(generateMarkdown());

	useEffect(() => {
		if (window.PagedPolyfill) {
			window.PagedPolyfill.preview();
		}
	}, [htmlContent]);

	return (
		<Box className="App">
			<Typography variant="h3" className="header-title">
				Заголовок
			</Typography>
			<Box className="sidebar">
				<Sidebar onTemplateChange={handleTemplateChange} />
			</Box>
			<Box className="content">
				<Layout
					documentData={documentData}
					handleInputChange={handleInputChange}
					htmlContent={htmlContent}
					template={template}
					fields={inputFields[template]}
				/>
			</Box>
		</Box>
	);
};

export default DocumentGenerator;
