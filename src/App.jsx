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
		// const savedData = localStorage.getItem("documentData");
		const savedData = false;
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
					"Направление/СпециальностьДопстрока": "",
					"Направленность/Профиль": "",
					"Направленность/ПрофильДопстрока": "",
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
					"Заведующий кафедрой": "",
					"Номер телефона руководителя по практической подготовке от кафедры":
						"",
					"Руководитель по практической подготовке от профильной организации":
						"",
					"Оценка уровня сформированности компетенций": "",
					"Индивидуальное задание": "",
					"Характеристика-отзыв": "",
					"Выводы и оценки кафедры": "",
			  };
	});
	const [markdownContent, setMarkdownContent] = useState("");
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [diary, setDiary] = useState(template === "diary");
	const [practicePlan, setPracticePlan] = useState([]);
	const [practiceType, setPracticeType] = useState("");
	const [competencies, setCompetencies] = useState([]);
	const [practicesTypes, setPracticesTypes] = useState([]);

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
			// (type) => type.name === "Учебная практика"
			(type) => type.name === documentData["Вид практики"]
		);
		setPracticePlan(initialPlan ? initialPlan.plan : []);
		let list = [];
		initialPlan
			? initialPlan.types.forEach((type) => list.push(type.type))
			: (list = []);
		setPracticesTypes(list);
		initialPlan
			? (list = initialPlan.types.find(
					(value) => value.type === documentData["Тип практики"]
			  ).competencies)
			: (list = []);
		setCompetencies(list);
	}, [documentData["Тип практики"]]);

	const fetchMarkdownContent = async (template) => {
		try {
			// Выбираем нужный файл на основе шаблона
			let filePath;
			switch (template) {
				case "diary":
					filePath = "/markdown/Diary.md";
					break;
				case "report":
					filePath = "/markdown/Report.md";
					break;
				default:
					filePath = `/markdown/${template}.md`;
			}

			// Выполняем запрос к выбранному файлу
			const response = await axios.get(filePath);
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
		let { name, value } = e.target;

		setDocumentData({
			...documentData,
			[name]: value,
		});
	};

	const handleSelectChange = (e) => {
		const { name, value } = e.target;
		console.log(name + " " + value);
		setDocumentData({
			...documentData,
			[name]: value,
		});

		console.log(documentData["Тип практики"]);

		const selectedPlan = practicePlans.types.find(
			(type) => type.name === value
		);

		let list = [];
		selectedPlan
			? selectedPlan.types.forEach((value) => list.push(value.type))
			: (list = []);
		console.log(list);
		setPracticesTypes(list);

		// if (selectedPlan) {
		// 	if (selectedPlan.types.find((type) => type.type === documentData["Тип практики"]) === undefined) {
		// 		// setPracticeType("");
		// 		// setCompetencies([]);
		// 		// document.getElementsByName("Тип практики")[0].value = "";
		// 	}
		// 	else {
		// 		setPracticePlan(selectedPlan ? selectedPlan.plan : []);
		// 		setCompetencies(selectedPlan ? selectedPlan.types.competencies : []);
		// 	}
		// }

		// console.log(selectedPlan);

		// setDocumentData({
		// 	...documentData,
		// 	[name]: value,
		// });
		//
		// console.log(practiceType)
		// console.log(competencies)
		// console.log(selectedPlan);
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

	const generateCompetencies = () => {
		return competencies
			.map(
				(competence, index) =>
					`<tr key=${index}>
					<td style="text-align: center">${competence.label}</td>
					<td></td>
				</tr>`
			)
			.join("");
	};

	const generateIndividualTask = () => {
		return documentData["Индивидуальное задание"].length === 0
			? `
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
				`
			: `
					<div class="line-style" style="word-wrap: break-word; text-decoration: underline">
    					<span class="multiline_text">${documentData["Индивидуальное задание"]}</span>
  					</div>`;
	};

	const generateCharacteristics = () => {
		return documentData["Характеристика-отзыв"].length === 0
			? `
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
				`
			: `
				<div class="line-style" style="word-wrap: break-word; text-decoration: underline">
					<span class="multiline_text">${documentData["Характеристика-отзыв"]}</span>
				</div>`;
	};

	const generateMarks = () => {
		return documentData["Выводы и оценки кафедры"].length === 0
			? `
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
					<div class="line-style">
						<span class="line"></span>						
					</div>
				`
			: `
				<div class="line-style" style="word-wrap: break-word; text-decoration: underline">
					<span class="multiline_text">${documentData["Выводы и оценки кафедры"]}</span>
				</div>`;
	};

	const htmlContent = converter
		.makeHtml(generateMarkdown())
		.replace("<!-- РАБОЧИЙ ГРАФИК -->", generateTableRows())
		.replace("<!-- КОМПЕТЕНЦИИ -->", generateCompetencies())
		.replace("<!-- ИНДИВИДУАЛЬНОЕ ЗАДАНИЕ -->", generateIndividualTask())
		.replace("<!-- ХАРАКТЕРИСТИКА-ОТЗЫВ -->", generateCharacteristics())
		.replace("<!-- ВЫВОДЫ И ОЦЕНКИ КАФЕДРЫ -->", generateMarks());

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
					practiceType={practiceType}
					practicesTypes={practicesTypes}
				/>
			</Box>
		</Box>
	);
};

export default DocumentGenerator;
