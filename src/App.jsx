import React, { useState, useEffect, useRef } from "react";
import showdown from "showdown";
import Sidebar from "./components/Sidebar/Sidebar";
import Layout from "./components/Layout/Layout";
import "./App.css";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import practicePlans from "./practicePlans.json";
import { inputFields, practiceTypes } from "./constants";

const DocumentGenerator = () => {
	const [template, setTemplate] = useState(() => {
		return localStorage.getItem("template") || "report";
	});
	const [documentData, setDocumentData] = useState(() => {
		const savedData = localStorage.getItem("documentData");
		return savedData
			? JSON.parse(savedData)
			: {
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
					"Вид практики": "Учебная практика",
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
					"Номер телефона руководителя по практической подготовке от кафедры":
						"",
					"Руководитель по практической подготовке от профильной организации":
						"",
					"Оценка уровня сформированности компетенций": "",
			  };
	});
	const [markdownContent, setMarkdownContent] = useState("");
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [diary, setDiary] = useState(template === "diary");
	const [practicePlan, setPracticePlan] = useState([]);

	const printRef = useRef();
	const converter = new showdown.Converter();

	useEffect(() => {
		fetchMarkdownContent(template);
	}, [template]);

	useEffect(() => {
		localStorage.setItem("documentData", JSON.stringify(documentData));
	}, [documentData]);

	useEffect(() => {
		const initialPlan = practicePlans.types.find(
			(type) => type.name === "Учебная практика"
		);
		setPracticePlan(initialPlan ? initialPlan.plan : []);
	}, []);

	const fetchMarkdownContent = async (template) => {
		try {
			const response = await axios.get(`/${template}.md`);
			setMarkdownContent(response.data);
		} catch (error) {
			console.error("Error fetching markdown file:", error);
		}
	};

	const handleTemplateChange = (template) => {
		setTemplate(template);
		localStorage.setItem("template", template);
		const newDocumentData = { ...documentData };

		inputFields[template].forEach((field) => {
			if (!newDocumentData[field]) {
				newDocumentData[field] = "";
			}
		});

		if (template === "diary") {
			newDocumentData["Вид практики"] = practiceTypes[0];
		}

		setDocumentData(newDocumentData);
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
		const selectedPlan = practicePlans.types.find(
			(type) => type.name === value
		);
		setPracticePlan(selectedPlan ? selectedPlan.plan : []);
	};

	const handleDrawerToggle = (open) => {
		setDrawerOpen(open);
	};

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

	const generateTableRows = () => {
		return practicePlan
			.map(
				(item, index) =>
					`<tr key=${index}>
                <td valign="top"></td>
                <td>${item.stage}</td>
                <td>${item.tasks}</td>
                <td></td>
            </tr>`
			)
			.join("");
	};

	const htmlContent = converter
		.makeHtml(generateMarkdown())
		.replace("<!-- РАБОЧИЙ ГРАФИК -->", generateTableRows());

	useEffect(() => {
		if (window.PagedPolyfill) {
			window.PagedPolyfill.preview();
		}
	}, [htmlContent]);

	const handlePrint = () => {
		window.print();
	};

	const handleDownloadPDF = () => {
		const pdfContent = htmlToPdfmake(htmlContent);
		const docDefinition = {
			content: pdfContent,
		};
		pdfMake.vfs = pdfFonts.pdfMake.vfs;
		pdfMake.createPdf(docDefinition).download("document.pdf");
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
					handleDownloadPDF={handleDownloadPDF}
					activeTemplate={template}
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
