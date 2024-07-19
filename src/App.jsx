import React, { useState, useEffect, useRef } from "react";
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
		"Направление/Специальность",
		"Направленность/Профиль",
		"Учебная группа",
		"Форма обучения",
		"Вид практики",
		"Тип практики",
		"Начало учебного года",
		"Конец учебного года",
		"Календарный год",
		"Кафедра",
		"Город",
		"Наименование профильной организации",
		"День начала организации практической подготовки",
		"Месяц начала организации практической подготовки",
		"День конца организации практической подготовки",
		"Месяц конца организации практической подготовки",
		"Руководитель по практической подготовке от кафедры",
		"Номер телефона руководителя по практической подготовке от кафедры",
		"Руководитель по практической подготовке от профильной организации",
		"Оценка уровня сформированности компетенций",
	],
};

const practiceTypes = ["Учебная", "Производственная", "Преддипломная"];

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
		"Направление/Специальность": "",
		"Направленность/Профиль": "",
		"Учебная группа": "",
		"Форма обучения": "",
		"Вид практики": "",
		"Тип практики": "",
		"Начало учебного года": "",
		"Конец учебного года": "",
		"Календарный год": "",
		Кафедра: "",
		Город: "",
		"Наименование профильной организации": "",
		"День начала организации практической подготовки": "",
		"Месяц начала организации практической подготовки": "",
		"День конца организации практической подготовки": "",
		"Месяц конца организации практической подготовки": "",
		"Руководитель по практической подготовке от кафедры": "",
		"Номер телефона руководителя по практической подготовке от кафедры": "",
		"Руководитель по практической подготовке от профильной организации": "",
		"Оценка уровня сформированности компетенций": "",
	});
	const [markdownContent, setMarkdownContent] = useState("");
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [diary, setDiary] = useState(false);
	const printRef = useRef();

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

		if (value.length <= 40) {
			setDocumentData({
				...documentData,
				[name]: value,
			});
		}
	};

	const handleSelectChange = (e) => {
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
			const regex = new RegExp(
				`___${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}___`,
				"g"
			);
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

	const handlePrint = () => {
		window.print();
	};

	return (
		<Box className="App">
			<Typography variant="h3" className="header-title">
				{diary
					? "Дневник практики"
					: "Отчет по производственной практике"}
			</Typography>
			<Box className="sidebar">
				<Sidebar
					onTemplateChange={handleTemplateChange}
					onDrawerToggle={handleDrawerToggle}
					setDiary={setDiary}
					handlePrint={handlePrint}
				/>
			</Box>
			<Box
				className={`content ${
					drawerOpen ? "drawer-open" : "drawer-closed"
				}`}
				ref={printRef}
			>
				<Layout
					documentData={documentData}
					handleInputChange={handleInputChange}
					handleSelectChange={handleSelectChange}
					htmlContent={htmlContent}
					template={template}
					fields={inputFields[template]}
					practiceTypes={practiceTypes}
				/>
			</Box>
		</Box>
	);
};

export default DocumentGenerator;
