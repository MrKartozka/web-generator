import React, { useState, useEffect } from "react";
import showdown from "showdown";
import Sidebar from "./components/Sidebar";
import "./App.css";
import Layout from "./components/Layout";
import { Box, Typography } from "@mui/material";
import axios from "axios";

// Поля ввода для каждого шаблона
const inputFields = {
	report: [
		"ФАКУЛЬТЕТ",
		"КАФЕДРА",
		"ФИО",
		"Группа",
		"Вид",
		"Тип",
		"Предприятие",
		"Руководитель",
		"Оценка",
	],
	diary: [
		"ФИО",
		"Направление подготовки",
		"Специальность",
		"Направленность (Профиль)",
		"Учебная группа",
		"Форма обучения",
		"Вид практики",
		"Тип практики",
		"Учебный год",
		"Кафедра",
		"Наименование профильной организации",
		"Сроки организации практической подготовки",
		"Руководитель по практической подготовке от кафедры",
		"Руководитель по практической подготовке от профильной организации",
		"Оценка уровня сформированности компетенций",
	],
};

const DocumentGenerator = () => {
	const [template, setTemplate] = useState("report");
	const [documentData, setDocumentData] = useState({
		ФАКУЛЬТЕТ: "",
		КАФЕДРА: "",
		ФИО: "",
		Группа: "",
		Вид: "",
		Тип: "",
		Предприятие: "",
		Руководитель: "",
		Оценка: "",
		"Направление подготовки": "",
		Специальность: "",
		"Направленность (Профиль)": "",
		"Учебная группа": "",
		"Форма обучения": "",
		"Вид практики": "",
		"Тип практики": "",
		"Учебный год": "",
		Кафедра: "",
		"Наименование профильной организации": "",
		"Сроки организации практической подготовки": "",
		"Руководитель по практической подготовке от кафедры": "",
		"Руководитель по практической подготовке от профильной организации": "",
		"Оценка уровня сформированности компетенций": "",
	});
	const [markdownContent, setMarkdownContent] = useState("");
	const [drawerOpen, setDrawerOpen] = useState(true);

	// Функция для считывания markdown файла
	const fetchMarkdownContent = async (template) => {
		try {
			const response = await axios.get(`/${template}.md`);
			setMarkdownContent(response.data);
		} catch (error) {
			console.error("Error fetching markdown file:", error);
		}
	};

	useEffect(() => {
		fetchMarkdownContent(template);
	}, [template]);

	const handleTemplateChange = (template) => {
		setTemplate(template);
		fetchMarkdownContent(template);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setDocumentData({
			...documentData,
			[name]: value,
		});
	};

	const handleDrawerToggle = (open) => {
		setDrawerOpen(open);
	};

	const converter = new showdown.Converter();
	const generateMarkdown = () => {
		let markdown = markdownContent;
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
				<Sidebar
					onTemplateChange={handleTemplateChange}
					onDrawerToggle={handleDrawerToggle}
				/>
			</Box>
			<Box
				className={`content ${
					drawerOpen ? "drawer-open" : "drawer-closed"
				}`}
			>
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
