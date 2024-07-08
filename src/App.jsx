import React, { useState, useEffect } from "react";
import showdown from "showdown";
import Sidebar from "./components/Sidebar";
import "./App.css";
import Layout from "./components/Layout";
import { Box, Typography } from "@mui/material";

// import 'pagedjs/dist/paged.polyfill.js';

// Шаблоны документов
const templates = {
	report: `
# Отчет по производственной практике

**Обучающийся:** ___ФИО___

**Группа:** ___Группа___

**Вид практики:** ___Вид___

**Тип практики:** ___Тип___

**Наименование предприятия:** ___Предприятие___

**Руководитель:** ___Руководитель___

**Оценка:** ___Оценка___
  `,
	diary: `
# Дневник практики

**Обучающийся:** ___ФИО___

**Специальность:** ___Специальность___

**Группа:** ___Группа___

**Форма обучения:** ___Форма___

**Вид практики:** ___Вид___

**Тип практики:** ___Тип___

**Учебный год:** ___Год___
  `,
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
		<>
			<Box container className="App">
				<Typography variant="h3" className="header-title">
					URAAAAA
				</Typography>
				<Box item className="sidebar">
					<Sidebar onTemplateChange={handleTemplateChange} />
				</Box>
				<Box item className="content">
					<Layout
						documentData={documentData}
						handleInputChange={handleInputChange}
						htmlContent={htmlContent}
					/>
				</Box>
			</Box>
		</>
	);
};
export default DocumentGenerator;
